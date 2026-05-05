import { readFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = "https://1000namesofmakali.com";
const MANIFEST_PATH = join(process.cwd(), "public", "data_manifest.json");

let cachedStaticNamesData = null;

function splitIntoParagraphs(value) {
	if (typeof value !== "string") {
		return [];
	}

	return value
		.split(/\r?\n\s*\r?\n+/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

function loadDataManifest() {
	const manifestText = readFileSync(MANIFEST_PATH, "utf8");
	const manifest = JSON.parse(manifestText);

	if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
		throw new Error("Invalid data_manifest.json: files[] is required.");
	}

	return manifest;
}

function loadChunkFile(fileName) {
	const chunkPath = join(process.cwd(), "public", fileName);
	const chunkText = readFileSync(chunkPath, "utf8");
	return JSON.parse(chunkText);
}

function enrichEntry(entry) {
	return {
		...entry,
		index: Number(entry.index),
		english_elaboration_paragraphs: splitIntoParagraphs(
			entry.english_elaboration,
		),
	};
}

function buildRangeMetadata(entries, rangeNumber, totalRanges) {
	const first = entries[0];
	const last = entries[entries.length - 1];
	const start = first.index;
	const end = last.index;
	const slug = `${start}-${end}`;
	const path = `/names/${slug}/`;

	return {
		slug,
		path,
		canonical: `${SITE_URL}${path}`,
		start,
		end,
		count: entries.length,
		label: `${start}-${end}`,
		title: `Adya Mahakali Names ${start}-${end} | 1000 Names of Maa Kali`,
		description: `Read Adya Mahakali Sahasranama names ${start}-${end}, from ${first.english_name} to ${last.english_name}, with English meanings and elaborations.`,
		heading: `Adya Mahakali Names ${start}-${end}`,
		firstName: {
			index: first.index,
			english: first.english_name,
		},
		lastName: {
			index: last.index,
			english: last.english_name,
		},
		rangeNumber,
		totalRanges,
	};
}

export function getStaticNamesData() {
	if (cachedStaticNamesData) {
		return cachedStaticNamesData;
	}

	const manifest = loadDataManifest();
	const allEntries = manifest.files
		.flatMap((fileName) => loadChunkFile(fileName))
		.map(enrichEntry)
		.sort((a, b) => a.index - b.index);

	const rangeSize = 100;
	const ranges = [];

	for (let offset = 0; offset < allEntries.length; offset += rangeSize) {
		const entries = allEntries.slice(offset, offset + rangeSize);
		ranges.push({ entries });
	}

	const totalRanges = ranges.length;

	const rangesWithMetadata = ranges.map((range, index) => {
		const metadata = buildRangeMetadata(range.entries, index + 1, totalRanges);
		return {
			...metadata,
			entries: range.entries,
		};
	});

	cachedStaticNamesData = {
		siteUrl: SITE_URL,
		totalCount: allEntries.length,
		hub: {
			path: "/names/",
			canonical: `${SITE_URL}/names/`,
			title: "Adya Mahakali 1000 Names by Range | 1000 Names of Maa Kali",
			description:
				"Browse all 1072 Adya Mahakali names in crawlable static ranges with direct links to each English name and meaning.",
		},
		ranges: rangesWithMetadata,
	};

	return cachedStaticNamesData;
}

export function getStaticRangeBySlug(slug) {
	const { ranges } = getStaticNamesData();
	return ranges.find((range) => range.slug === slug) ?? null;
}

export function getRangeNavigation(slug) {
	const { ranges } = getStaticNamesData();
	const currentIndex = ranges.findIndex((range) => range.slug === slug);

	if (currentIndex === -1) {
		return { previous: null, next: null };
	}

	return {
		previous: ranges[currentIndex - 1] ?? null,
		next: ranges[currentIndex + 1] ?? null,
	};
}

export { splitIntoParagraphs };
