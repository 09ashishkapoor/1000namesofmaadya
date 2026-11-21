// Generates public/sitemap.xml, including one URL per generated name page.
// Run manually or via `npm run build` (prebuild hook).
//
// Keep the legacy static entries byte-identical to the previous sitemap so the
// existing structure tests keep validating dates/priorities.
//
// lastmod must describe when the CONTENT changed, not when the build ran.
// Stamping `new Date()` on ~1,000 URLs tells Google every page changed on every
// deploy, which trains it to distrust the sitemap. Dates are read from git
// instead (the last commit touching the page's source), with a fixed fallback
// for environments without history (shallow clones, tarball builds).

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SITE_URL = "https://1000namesofmakali.com";
const MANIFEST_PATH = join(ROOT, "public", "data_manifest.json");
const MAPPING_PATH = join(ROOT, "src", "data", "name-mapping.json");
const SITEMAP_PATH = join(ROOT, "public", "sitemap.xml");

// Used when git history is unavailable. Must stay a real content date, never
// "today", so repeated builds produce identical output.
const FALLBACK_LASTMOD = "2026-04-26";

const dateCache = new Map();

/** Last commit date (YYYY-MM-DD) that touched any of the given repo paths. */
function gitLastmod(paths) {
	const key = paths.join("|");
	if (dateCache.has(key)) return dateCache.get(key);

	let latest = "";
	for (const path of paths) {
		try {
			const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", path], {
				cwd: ROOT,
				encoding: "utf8",
				stdio: ["ignore", "pipe", "ignore"],
			}).trim();
			if (date > latest) latest = date;
		} catch {
			// No git, no history, or the path is untracked: use the fallback.
		}
	}

	const result = latest || FALLBACK_LASTMOD;
	dateCache.set(key, result);
	return result;
}

function staticEntries() {
	const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
	const total = Number(manifest.total);

	const entries = [
		{ loc: `${SITE_URL}/`, lastmod: "2026-04-21", changefreq: "weekly", priority: "1.0" },
		{ loc: `${SITE_URL}/names/`, lastmod: "2026-04-26", changefreq: "weekly", priority: "0.9" },
		{ loc: `${SITE_URL}/sources/`, lastmod: "2026-04-30", changefreq: "monthly", priority: "0.7" },
	];

	for (let start = 1; start <= total; start += 100) {
		const end = Math.min(start + 99, total);
		entries.push({
			loc: `${SITE_URL}/names/${start}-${end}/`,
			lastmod: "2026-04-26",
			changefreq: "weekly",
			priority: "0.8",
		});
	}

	// Added on the SEO branch; keep extending this list as landing pages ship.
	const landingPages = [
		"/108-names-of-kali/",
		"/1008-names-of-kali/",
		"/kali-sahasranama-pdf/",
		"/kali-sahasranama-lyrics/",
		"/kali-sahasranama-benefits/",
		"/about/",
		"/colophon/",
		"/contact/",
		"/privacy/",
	];
	for (const path of landingPages) {
		entries.push({
			loc: `${SITE_URL}${path}`,
			lastmod: gitLastmod([`src/pages${path}index.astro`]),
			changefreq: "monthly",
			priority: "0.9",
		});
	}

	return entries;
}

function nameEntries() {
	const mapping = JSON.parse(readFileSync(MAPPING_PATH, "utf8"));
	// Every name page is rendered from the same template, from the same data.
	const lastmod = gitLastmod(["src/pages/names/[name].astro", "src/data/name-mapping.json"]);

	return mapping.pageGroups.map((group) => ({
		loc: `${SITE_URL}/names/${group.slug}/`,
		lastmod,
		changefreq: "monthly",
		priority: "0.6",
	}));
}

function renderEntry(entry) {
	return [
		"  <url>",
		`    <loc>${entry.loc}</loc>`,
		`    <lastmod>${entry.lastmod}</lastmod>`,
		`    <changefreq>${entry.changefreq}</changefreq>`,
		`    <priority>${entry.priority}</priority>`,
		"  </url>",
	].join("\n");
}

function main() {
	const staticList = staticEntries();
	const nameList = nameEntries();
	const entries = [...staticList, ...nameList];
	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
		'        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		entries.map(renderEntry).join("\n"),
		"</urlset>",
		"",
	].join("\n");

	writeFileSync(SITEMAP_PATH, xml, "utf8");
	console.log(
		`sitemap: ${entries.length} URLs (${nameList.length} name pages, ${staticList.length} static) -> public/sitemap.xml`,
	);
}

main();
