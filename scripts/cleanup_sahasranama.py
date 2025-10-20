#!/usr/bin/env python3
"""
Streaming parser/cleanup for Kalabhairava Sahasranama source files.

Produces cleaned text files, a combined JSON and CSV for website use.

Run from the workspace root (this script uses relative paths).
"""
import re
import os
import json
import csv
from typing import List, Dict, Optional

# Config - source filenames (exact names in workspace)
ROOT = os.path.dirname(os.path.dirname(__file__))
SRC_DIR = ROOT

FILES = {
    'en_oneline': os.path.join(SRC_DIR, 'kalabhairava_sahasranama(1000)_onelinemeanings.txt'),
    'en_elab'  : os.path.join(SRC_DIR, 'kalabhairava_sahasranama(1000)_withelaborations.txt'),
    'hi_oneline': os.path.join(SRC_DIR, 'kalabhairava_sahasranama(1000)_HINDI_onelinemeanings.txt'),
    'hi_elab'  : os.path.join(SRC_DIR, 'kalabhairava_sahasranama(1000)_HINDI_withelaborations.txt'),
}

OUTFILES = {
    'en_oneline_clean': os.path.join(SRC_DIR, 'kalabhairava_sahasranama_1000_onelinemeanings.txt'),
    'en_elab_clean': os.path.join(SRC_DIR, 'kalabhairava_sahasranama_1000_withelaborations.txt'),
    'hi_oneline_clean': os.path.join(SRC_DIR, 'kalabhairava_sahasranama_1000_HINDI_onelinemeanings.txt'),
    'hi_elab_clean': os.path.join(SRC_DIR, 'kalabhairava_sahasranama_1000_HINDI_withelaborations.txt'),
    'json': os.path.join(SRC_DIR, 'sahasranama_meanings.json'),
    'csv': os.path.join(SRC_DIR, 'sahasranama_meanings.csv'),
}

NUM_HEADER_RE = re.compile(r'^\s*(\d+)\)\s*(.+)$')
ONE_LINE_SPLIT_RE = re.compile(r'\s*:\s*')
ELAB_MARKER_RE = re.compile(r'(?i)\bELABORATION\b|व्याख्या|विस्तार')


def parse_oneliners(path: str) -> Dict[int, Dict[str,str]]:
    """Parse simple one-line files of the form 'Name: Meaning' (per line).
    Returns dict indexed by inferred position (1-based increment), but if the file
    contains explicit leading numbers we'll use them when present.
    """
    results = {}
    if not os.path.exists(path):
        print(f"Warning: oneliner source not found: {path}")
        return results
    with open(path, 'r', encoding='utf-8') as f:
        idx = 0
        for raw in f:
            line = raw.strip()
            if not line:
                continue
            # try to detect leading numeric '1) ' patterns
            m = NUM_HEADER_RE.match(line)
            if m:
                idx = int(m.group(1))
                rest = m.group(2)
            else:
                idx += 1
                rest = line
            parts = ONE_LINE_SPLIT_RE.split(rest, maxsplit=1)
            name = parts[0].strip()
            meaning = parts[1].strip() if len(parts) > 1 else ''
            results[idx] = {'name': name, 'meaning': meaning}
    return results


def parse_elaborations(path: str) -> Dict[int, Dict[str,str]]:
    """Parse elaborations file where each entry begins with 'N) NAME' and contains
    a short meaning then an 'ELABORATION' marker followed by paragraphs.
    Returns dict indexed by entry number.
    """
    results = {}
    if not os.path.exists(path):
        print(f"Warning: elaboration source not found: {path}")
        return results

    current = None
    buffer_lines: List[str] = []

    def flush_current():
        nonlocal current, buffer_lines
        if current is None:
            return
        content = '\n'.join(l.rstrip() for l in buffer_lines).strip()
        # split at ELAB marker if present
        parts = ELAB_MARKER_RE.split(content, maxsplit=1)
        if len(parts) == 2:
            short = parts[0].strip() or ''
            elab = parts[1].strip() or ''
            # remove leftover leading punctuation that can occur when the
            # original marker was part of a compound like 'व्याख्या/विस्तार'
            # e.g. splitting on 'व्याख्या' may leave '/विस्तार' at the start.
            elab = re.sub(r'^[\s\-–—/:]+', '', elab)
        else:
            # no explicit marker; heuristically take first paragraph as short
            paragraphs = [p.strip() for p in re.split(r'\n\s*\n', content) if p.strip()]
            short = paragraphs[0] if paragraphs else ''
            elab = '\n\n'.join(paragraphs[1:]) if len(paragraphs) > 1 else ''
            # also trim leading punctuation from heuristic elaboration
            elab = re.sub(r'^[\s\-–—/:]+', '', elab)
        results[current['idx']] = {
            'name': current['name'],
            'short': short,
            'elaboration': elab,
        }
        current = None
        buffer_lines = []

    with open(path, 'r', encoding='utf-8') as f:
        for raw in f:
            line = raw.rstrip('\n')
            m = NUM_HEADER_RE.match(line)
            if m:
                # new entry
                # flush previous
                flush_current()
                idx = int(m.group(1))
                name = m.group(2).strip()
                current = {'idx': idx, 'name': name}
                buffer_lines = []
                continue
            # separator lines like '-' only may indicate end of block but we keep them
            buffer_lines.append(line)
        # final flush
        flush_current()

    return results


def merge_records(en_oneline, en_elab, hi_oneline, hi_elab):
    # collect all indices
    idxs = set()
    idxs.update(en_oneline.keys())
    idxs.update(en_elab.keys())
    idxs.update(hi_oneline.keys())
    idxs.update(hi_elab.keys())
    merged = []
    for idx in sorted(idxs):
        rec = {'index': idx}
        e_on = en_oneline.get(idx, {})
        e_el = en_elab.get(idx, {})
        h_on = hi_oneline.get(idx, {})
        h_el = hi_elab.get(idx, {})
        rec['english_name'] = e_on.get('name') or e_el.get('name') or ''
        rec['english_one_line'] = e_on.get('meaning') or e_el.get('short') or ''
        rec['english_elaboration'] = e_el.get('elaboration') or ''
        rec['hindi_name'] = h_on.get('name') or h_el.get('name') or ''
        rec['hindi_one_line'] = h_on.get('meaning') or h_el.get('short') or ''
        rec['hindi_elaboration'] = h_el.get('elaboration') or ''
        merged.append(rec)
    return merged


def write_clean_oneliners(outpath: str, records: List[Dict], lang: str):
    with open(outpath, 'w', encoding='utf-8') as f:
        for r in records:
            name = r.get(f'{lang}_name') or ''
            meaning = r.get(f'{lang}_one_line') or ''
            f.write(f"{r['index']}. {name}: {meaning}\n")


def write_clean_elabs(outpath: str, records: List[Dict], lang: str):
    with open(outpath, 'w', encoding='utf-8') as f:
        for r in records:
            name = r.get(f'{lang}_name') or ''
            short = r.get(f'{lang}_one_line') or ''
            elab = r.get(f'{lang}_elaboration') or ''
            f.write(f"{r['index']}) {name}\n")
            if short:
                f.write(short + "\n")
            if elab:
                f.write('\n')
                f.write('ELABORATION:\n')
                f.write(elab + '\n')
            f.write('\n-\n\n')


def write_json(path: str, records: List[Dict]):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)


def write_csv(path: str, records: List[Dict]):
    fieldnames = ['index', 'english_name', 'hindi_name', 'english_one_line', 'hindi_one_line']
    with open(path, 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in records:
            row = {k: r.get(k, '') for k in fieldnames}
            w.writerow(row)


def main():
    print('Parsing sources...')
    en_oneline = parse_oneliners(FILES['en_oneline'])
    en_elab = parse_elaborations(FILES['en_elab'])
    hi_oneline = parse_oneliners(FILES['hi_oneline'])
    hi_elab = parse_elaborations(FILES['hi_elab'])

    merged = merge_records(en_oneline, en_elab, hi_oneline, hi_elab)

    print(f'Found indices: {len(merged)} entries (unique indices).')

    # Write cleaned outputs
    write_clean_oneliners(OUTFILES['en_oneline_clean'], merged, 'english')
    write_clean_elabs(OUTFILES['en_elab_clean'], merged, 'english')
    write_clean_oneliners(OUTFILES['hi_oneline_clean'], merged, 'hindi')
    write_clean_elabs(OUTFILES['hi_elab_clean'], merged, 'hindi')
    write_json(OUTFILES['json'], merged)
    write_csv(OUTFILES['csv'], merged)

    # Summary
    counts = {
        'en_oneline': len(en_oneline),
        'en_elab': len(en_elab),
        'hi_oneline': len(hi_oneline),
        'hi_elab': len(hi_elab),
        'merged': len(merged),
    }
    print('Write complete. Counts:')
    for k, v in counts.items():
        print(f'  {k}: {v}')
    print('\nOutputs:')
    for k, v in OUTFILES.items():
        print(f'  {k}: {v}')


if __name__ == '__main__':
    main()
