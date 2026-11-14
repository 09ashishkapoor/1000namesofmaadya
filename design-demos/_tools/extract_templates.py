import json, re, glob

rows = json.load(open('src/data/name-mapping.json', encoding='utf-8'))['rows']
chunks = []
for f in sorted(glob.glob('public/data_chunk_*.json')):
    chunks += json.load(open(f, encoding='utf-8'))
by_index = {int(e['index']): e for e in chunks}


def blocks(text):
    out = []
    for raw in re.split(r'\r?\n\s*\r?\n+', text):
        raw = raw.strip()
        if not raw:
            continue
        lines = [l.strip() for l in raw.split('\n') if l.strip()]
        # a short first line without terminal punctuation is a section heading
        if len(lines) > 1 and len(lines[0]) < 70 and not lines[0].endswith(('.', '?', '!')):
            out.append({'h': lines[0]})
            out.append({'p': ' '.join(lines[1:])})
        else:
            out.append({'p': ' '.join(lines)})
    return out


k = by_index[2]
r = rows[1]
kali = {
    'n': 2, 'dev': r['devanagari'], 'iast': r['iast'], 'common': r['spelling_common'],
    'site': r['spelling_site'], 'variants': r['variants'], 'one': k['english_one_line'].strip(),
    'blocks': blocks(k['english_elaboration']),
}
json.dump(kali, open('design-demos/_tools/kali.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

hundred = []
for n in range(1, 101):
    e = by_index[n]
    rr = rows[n - 1]
    hundred.append([n, rr['devanagari'], rr['iast'], rr['spelling_common'], e['english_one_line'].strip()])
open('design-demos/_tools/names-100.js', 'w', encoding='utf-8').write(
    'const HUNDRED=' + json.dumps(hundred, ensure_ascii=False, separators=(',', ':')) + ';')

ranges = []
for start in range(1, 1073, 100):
    end = min(start + 99, 1072)
    ranges.append({'label': f'{start}–{end}', 'path': f'/names/{start}-{end}/',
                   'first': rows[start - 1]['iast'], 'last': rows[end - 1]['iast']})
open('design-demos/_tools/ranges.js', 'w', encoding='utf-8').write(
    'const RANGES=' + json.dumps(ranges, ensure_ascii=False, separators=(',', ':')) + ';')

print('kali blocks:', len(kali['blocks']))
for b in kali['blocks']:
    print(' ', 'H' if 'h' in b else 'P', (b.get('h') or b.get('p'))[:80])
print('ranges:', ranges[0], '…', ranges[-1])
