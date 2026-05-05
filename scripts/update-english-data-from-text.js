const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();
const SOURCE_PATH = path.join(
	ROOT,
	"adyamahakali_sahasranama1000_withelaborations_combined_may042027.txt",
);
const CANONICAL_PATH = path.join(
	ROOT,
	"public",
	"mahakali_sahasranama_meanings.json",
);
const MANIFEST_PATH = path.join(ROOT, "public", "data_manifest.json");

function parseSource(text) {
	const markerPattern =
		/^\s*(\d+)\.\s+([^\n]+)\r?\n([^\n]+)\r?\n\s*\r?\nELABORATION:\r?\n/gm;
	const markers = [...text.matchAll(markerPattern)];

	if (markers.length !== 1072) {
		throw new Error(`Expected 1072 source entries, found ${markers.length}`);
	}

	return markers.map((match, markerIndex) => {
		const index = Number(match[1]);
		const next = markers[markerIndex + 1];
		const elaborationStart = match.index + match[0].length;
		const elaborationEnd = next ? next.index : text.length;
		const elaboration = text
			.slice(elaborationStart, elaborationEnd)
			.replace(/[\r\n\t ]+$/g, "")
			.trim();

		if (index !== markerIndex + 1) {
			throw new Error(
				`Expected source index ${markerIndex + 1}, found ${index}`,
			);
		}

		if (!elaboration) {
			throw new Error(`Missing elaboration for index ${index}`);
		}

		return {
			index,
			english_name: match[2].trim(),
			english_one_line: match[3].trim(),
			english_elaboration: elaboration,
		};
	});
}

function assertNoRemovedLocaleFields(entries, label) {
	const removedLocalePrefix = ["hi", "ndi_"].join("");

	for (const entry of entries) {
		for (const key of Object.keys(entry)) {
			if (key.startsWith(removedLocalePrefix)) {
				throw new Error(`${label} entry ${entry.index} still has ${key}`);
			}
		}
	}
}

function main() {
	const sourceText = fs
		.readFileSync(SOURCE_PATH, "utf8")
		.replace(/^\uFEFF/, "")
		.replace(/\r\n?/g, "\n");
	const sourceEntries = parseSource(sourceText);

	const existing = JSON.parse(fs.readFileSync(CANONICAL_PATH, "utf8"));
	if (!Array.isArray(existing) || existing.length !== 1072) {
		throw new Error(
			`Expected existing canonical JSON to have 1072 entries, found ${existing.length}`,
		);
	}

	existing.forEach((entry, offset) => {
		const expectedIndex = offset + 1;
		if (Number(entry.index) !== expectedIndex) {
			throw new Error(
				`Existing JSON index mismatch at offset ${offset}: expected ${expectedIndex}, found ${entry.index}`,
			);
		}
	});

	const updatedEntries = sourceEntries.map((entry) => ({ ...entry }));
	assertNoRemovedLocaleFields(updatedEntries, "updated");

	fs.writeFileSync(
		CANONICAL_PATH,
		`${JSON.stringify(updatedEntries, null, 2)}\n`,
	);

	const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
	const chunkSize = Number(manifest.chunk_size);
	if (chunkSize !== 200 || manifest.total !== 1072 || manifest.chunks !== 6) {
		throw new Error(
			"Unexpected data manifest shape; refusing to rewrite chunks.",
		);
	}

	manifest.files.forEach((fileName, chunkIndex) => {
		const start = chunkIndex * chunkSize;
		const chunk = updatedEntries.slice(start, start + chunkSize);
		const expectedLength = chunkIndex === manifest.files.length - 1 ? 72 : 200;
		if (chunk.length !== expectedLength) {
			throw new Error(
				`Unexpected chunk length for ${fileName}: ${chunk.length}`,
			);
		}
		assertNoRemovedLocaleFields(chunk, fileName);
		fs.writeFileSync(
			path.join(ROOT, "public", fileName),
			`${JSON.stringify(chunk)}\n`,
		);
	});

	console.log(
		"Updated English-only canonical data and chunks from source text.",
	);
}

main();
