// Build a compact, client-side search index for the reader.
//
// The reader only server-renders the first set of eleven names, so its search
// inputs used to filter those eleven rows only. This index carries every name
// (all 1,072) in a few small fields — enough to search by Devanagari, IAST,
// common spelling, spelling variants, one-line meaning, or page slug — without
// shipping the heavy elaboration chunks to the browser.
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const MAPPING_PATH = path.join(ROOT, "src", "data", "name-mapping.json");
const OUTPUT_PATH = path.join(ROOT, "public", "search-index.json");

function main() {
	const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, "utf8"));
	const rows = mapping.rows;
	if (!Array.isArray(rows) || rows.length !== 1072) {
		throw new Error(`Expected 1072 mapping rows, found ${rows && rows.length}`);
	}

	const index = rows.map((row, offset) => {
		const number = Number(row.number);
		if (number !== offset + 1) {
			throw new Error(`Expected name ${offset + 1}, found ${row.number}`);
		}
		if (!row.devanagari || !row.iast || !row.meaning) {
			throw new Error(`Missing searchable fields for name ${number}`);
		}

		const common = row.spelling_common || row.iast;
		// Variants are the extra spellings the mapping already knows about; keep
		// only ones not already covered by the primary spellings.
		const primary = new Set([row.devanagari, row.iast, common]);
		const variants = (Array.isArray(row.variants) ? row.variants : []).filter(
			(variant) => variant && !primary.has(variant),
		);

		return [
			number,
			row.devanagari,
			row.iast,
			common,
			row.meaning,
			row.page_slug || row.slug || null,
			variants,
		];
	});

	fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(index)}\n`);
	console.log(`Wrote ${index.length} searchable names to public/search-index.json.`);
}

main();
