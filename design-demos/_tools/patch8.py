def edit(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        if old not in s:
            print(path, 'MISSING:', old[:70].replace('\n', ' | '))
            continue
        s = s.replace(old, new, 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('patched', path)


# D1: shorter search hint (fits 320px)
edit('dir-1.html', [
    ('placeholder="a name, a transliteration, or a meaning…"', 'placeholder="a name or a meaning…"'),
])

# D3: shorter search hint
edit('dir-3.html', [
    ('placeholder="Search the names and their meanings"', 'placeholder="Search a name or a meaning"'),
])

# D2: drop caps off on phones (they read as a stray indent at small sizes)
edit('dir-2.html', [
    ('''  @media (max-width:640px){
    body{font-size:17.5px}''',
     '''  @media (max-width:640px){
    body{font-size:17.5px}
    .page-elab::first-letter,.essay-body p:first-child::first-letter{font-size:1em;float:none;padding:0;color:inherit;font-family:inherit}'''),
])
