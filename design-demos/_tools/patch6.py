def edit(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        if old not in s:
            print(path, 'MISSING:', old[:60])
            continue
        s = s.replace(old, new, 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('patched', path)


edit('dir-1.html', [
    ('    .nm-note p{font-size:15.5px;padding-left:14px}', '    .nm-note p{font-size:16px;padding-left:14px}'),
])

edit('dir-2.html', [
    ('--gold:#7d5f24;', '--gold:#775a21;'),
])

edit('dir-3.html', [
    ('    .seg .note p{font-size:15.5px;padding:12px 14px}', '    .seg .note p{font-size:16px;padding:12px 14px}'),
    ('  .rail .hint{font-size:11.5px;', '  .rail .hint{font-size:12px;'),
    ('               font-size:15.5px;line-height:1.55;color:var(--ash)}', '               font-size:16px;line-height:1.55;color:var(--ash)}'),
    ('  .practice b{font-family:var(--serif);font-weight:600;font-size:15.5px;color:var(--ink)}',
     '  .practice b{font-family:var(--serif);font-weight:600;font-size:16px;color:var(--ink)}'),
])
