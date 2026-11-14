import json, re, glob

rows = json.load(open('src/data/name-mapping.json', encoding='utf-8'))['rows']
chunks = []
for f in sorted(glob.glob('public/data_chunk_*.json')):
    chunks += json.load(open(f, encoding='utf-8'))
by_index = {int(e['index']): e for e in chunks}


def sentences(text):
    cuts = [0]
    for m in re.finditer(r'[.!?]["\u201d]?(?:\s+|$)', text):
        cuts.append(m.end())
    parts = []
    for i in range(len(cuts) - 1):
        seg = text[cuts[i]:cuts[i + 1]].strip()
        if seg:
            parts.append(seg)
    tail = text[cuts[-1]:].strip()
    if tail:
        parts.append(tail)
    return parts


out = []
for n in range(1, 23):
    e = by_index[n]
    r = rows[n - 1]
    elab = re.sub(r'\s+', ' ', e['english_elaboration']).strip()
    parts = [elab]  # full note verbatim: it is the client's sacred text, not ours to edit
    acc = ''
    for p in parts:
        if acc and len(acc) + len(p) > 380:
            break
        acc = (acc + ' ' + p).strip()
    out.append([n, r['devanagari'], r['iast'], r['spelling_common'],
                e['english_one_line'].strip(), acc])

js = 'const NAMES=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';'
open('design-demos/_tools/names.js', 'w', encoding='utf-8').write(js)
for row in out[:3] + out[-1:]:
    print(row[0], row[2], '|', row[5][:150])
