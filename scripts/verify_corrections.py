#!/usr/bin/env python3
import glob, json, sys
phrase = 'योगिनियों के समूह की स्वामिनी'
print('Searching JSON files for the phrase:')
matches = []
for path in glob.glob('**/*.json', recursive=True):
    try:
        with open(path, 'r', encoding='utf-8') as fh:
            txt = fh.read()
    except Exception:
        continue
    if phrase in txt:
        matches.append(path)
        print(f"  {path}")
if not matches:
    print('  (no matches found)')

print('\nValidating JSON files:')
targets = ['mahakali_sahasranama_meanings.json'] + glob.glob('data_chunk_*.json')
for f in targets:
    try:
        with open(f, 'r', encoding='utf-8') as fh:
            json.load(fh)
        print(f"  {f}: OK")
    except Exception as e:
        print(f"  {f}: ERROR - {e}")

print('\nDone.')
