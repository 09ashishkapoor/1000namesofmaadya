#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to apply Hindi corrections from namecorrection.txt to JSON data files.
Usage: python scripts/apply_name_corrections.py
This will update `mahakali_sahasranama_meanings.json` and any `data_chunk_*.json` files
by replacing the `hindi_elaboration` for matching `hindi_name` entries.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORRECTION_FILE = ROOT / 'namecorrection.txt'
TARGET_FILES = [ROOT / 'mahakali_sahasranama_meanings.json'] + sorted(ROOT.glob('data_chunk_*.json'))


def load_corrections():
    text = CORRECTION_FILE.read_text(encoding='utf-8')
    # Expect blocks like "629. वृंदा (Vrinda)" then Hindi paragraphs.
    entries = {}
    parts = re.split(r"\n(?=\d+\.\s)", text)
    for part in parts:
        part = part.strip()
        if not part:
            continue
        m = re.match(r'^(\d+)\.\s+([^\n\(]+)', part)
        if not m:
            continue
        idx = int(m.group(1))
        name = m.group(2).strip()
        # Remove the leading "629. Name" line
        body = re.sub(r'^\d+\.\s+[^\n]+\n?', '', part).strip()
        # We only need the Hindi portion — keep body as-is
        entries[name] = body
    return entries


def replace_in_meanings(corrections):
    path = ROOT / 'mahakali_sahasranama_meanings.json'
    data = json.loads(path.read_text(encoding='utf-8'))
    changed = 0
    for entry in data:
        hname = entry.get('hindi_name') or entry.get('hindiName')
        if not hname:
            continue
        # Match by exact Hindi name
        if hname in corrections:
            new_elab = corrections[hname]
            if entry.get('hindi_elaboration') != new_elab:
                entry['hindi_elaboration'] = new_elab
                changed += 1
                print(f"Updated {entry.get('index')}: {hname}")
    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    return changed


def replace_in_chunks(corrections):
    total = 0
    for p in ROOT.glob('data_chunk_*.json'):
        try:
            arr = json.loads(p.read_text(encoding='utf-8'))
        except Exception as e:
            print(f"Skipping {p.name}: read error: {e}")
            continue
        changed = 0
        for item in arr:
            hname = item.get('hindi_name')
            if hname and hname in corrections:
                if item.get('hindi_elaboration') != corrections[hname]:
                    item['hindi_elaboration'] = corrections[hname]
                    changed += 1
        if changed:
            p.write_text(json.dumps(arr, ensure_ascii=False, indent=2), encoding='utf-8')
            print(f"Updated {changed} entries in {p.name}")
        total += changed
    return total


def main():
    corrections = load_corrections()
    if not corrections:
        print('No corrections found in', CORRECTION_FILE)
        return
    print('Loaded corrections for names:', list(corrections.keys()))
    changed_meanings = replace_in_meanings(corrections)
    changed_chunks = replace_in_chunks(corrections)
    print(f'Changes applied: meanings={changed_meanings}, chunks={changed_chunks}')


if __name__ == '__main__':
    main()
