import sys

p = 'dir-1.html'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:80].replace('\n', ' | '))
        return
    s = s.replace(old, new, 1)


sub('  .wrap{position:relative;z-index:1}', '  .wrap{position:relative;z-index:1}\n  a{color:inherit}')
sub('  .top nav a{text-decoration:none;border-bottom:1px solid transparent;padding-bottom:3px}',
    '  .top nav a{text-decoration:none;color:var(--ash);border-bottom:1px solid transparent;padding-bottom:3px}')
sub('  .begin{display:inline-flex;align-items:center;gap:14px;font-size:15px;letter-spacing:.12em;text-transform:uppercase;',
    '  .begin{display:inline-flex;align-items:center;gap:14px;font-size:17px;letter-spacing:.06em;font-variant:all-small-caps;')
sub('  .ring .photo{position:absolute;left:50%;top:50%;width:42%;',
    '  .ring .photo{position:absolute;left:50%;top:50%;width:50%;')
sub('''  .ring .cap{position:absolute;left:0;right:0;bottom:-4%;display:flex;justify-content:space-between;
             font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ash-dim)}''',
    '''  .ring .cap{position:absolute;left:0;right:0;bottom:-5%;display:flex;justify-content:center;gap:28px;
             font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ash-dim)}''')
sub('  .reasons h4{margin:0 0 2px;font-family:var(--dev);font-weight:500;font-size:18px;color:var(--paper)}',
    '  .reasons h4{margin:0 0 2px;font-family:var(--serif);font-weight:600;font-size:19px;color:var(--paper)}')
sub('  .aside h3{font-family:var(--dev);font-weight:500;font-size:15px;margin:0 0 3px;color:var(--paper)}',
    '  .aside h3{font-family:var(--dev);font-weight:500;font-size:16px;margin:0 0 3px;color:var(--paper)}')
sub('  .glist h3 span{font-family:var(--dev);font-size:14px;color:var(--gold);margin-right:9px}',
    '  .glist h3 span{font-family:var(--dev);font-size:18px;color:var(--gold);margin-right:10px;vertical-align:-1px}')
sub('  .fcols p,.fcols a{font-size:14.5px;color:var(--ash);line-height:1.75;text-decoration:none;margin:0 0 4px;display:block}',
    '  .fcols p,.fcols a{font-size:14.5px;color:var(--ash);line-height:1.75;text-decoration:none;margin:0 0 4px;display:block}\n  .fcols p a{display:inline;border-bottom:1px solid var(--gold-hair)}')
sub("arcPath(c, c, inner, outer, a0, a1, 0.004)", "arcPath(c, c, inner, outer, a0, a1, 0.0016)")
sub("active ? 'rgba(201,162,39,.92)' : loaded ? 'rgba(201,162,39,.32)' : 'rgba(201,162,39,.12)'",
    "active ? 'rgba(201,162,39,.95)' : loaded ? 'rgba(201,162,39,.36)' : 'rgba(201,162,39,.15)'")
sub('        <dt>Heard in</dt><dd>11</dd>', '        <dt>In this set</dt><dd>11</dd>')
sub("aria-controls=\"note-' + num + '\">' +", "aria-controls=\"note-' + num + '\" aria-label=\"Open the note for ' + common + '\">' +")

# mobile header + search stacking
sub('''  @media (max-width:720px){
    body{font-size:17px}
    .top{padding:15px 20px}
    .top nav{gap:15px;font-size:12px}
    .brand .dev{font-size:13.5px}''',
    '''  @media (max-width:720px){
    body{font-size:17px}
    .top{padding:14px 20px;gap:10px}
    .top nav{gap:14px;font-size:12px}
    .top nav a:nth-child(2),.top nav a:nth-child(3){display:none}
    .brand{gap:8px}
    .brand .om{font-size:18px}
    .brand .dev{font-size:13px;line-height:1.3}
    .entry-ring{margin-bottom:14px}
    .ring{width:min(100%,250px)}
    .searchbar{flex-wrap:wrap;gap:6px 12px}
    .searchbar input{flex:1 1 100%;order:3}
    .searchbar .state{margin-left:auto}''')

open(p, 'w', encoding='utf-8').write(s)
print('patched dir-1 →', len(s), 'chars')
