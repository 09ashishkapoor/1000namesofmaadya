def edit(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        if old not in s:
            print(path, 'MISSING:', old[:70].replace('\n', ' | '))
            continue
        s = s.replace(old, new, 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('patched', path)


# ---------------- D1: nav tap targets ----------------
edit('dir-1.html', [
    ('  .top nav a{text-decoration:none;color:var(--ash);border-bottom:1px solid transparent;padding-bottom:3px}',
     '  .top nav a{display:inline-flex;align-items:center;min-height:44px;text-decoration:none;color:var(--ash);border-bottom:1px solid transparent}'),
])

# ---------------- D2: 320 header, kicker, turn buttons, scroll to page on tap ----------------
edit('dir-2.html', [
    ('''    .bar nav{gap:16px;font-size:12.5px}
    .bar nav a:nth-child(3){display:none}''',
     '''    .bar nav{gap:16px;font-size:12.5px}
    .bar nav a{display:inline-flex;align-items:center;min-height:44px}
    .bar nav a:nth-child(1),.bar nav a:nth-child(2){display:none}
    .brand .dev{font-size:15px;white-space:nowrap}
    .cover-copy .kicker{letter-spacing:.09em;font-size:13.5px}
    .turn button{min-height:44px}'''),
    ('''  @media (max-width:640px){''',
     '''  @media (max-width:400px){
    .bar nav a:nth-child(3){display:none}
    .brand .dev{font-size:14px}
  }
  @media (max-width:640px){'''),
    ('  .leaf-right{padding:clamp(20px,3vw,42px) clamp(20px,3.2vw,48px) clamp(18px,2.4vw,26px);display:flex;flex-direction:column;position:relative}',
     '  .leaf-right{padding:clamp(20px,3vw,42px) clamp(20px,3.2vw,48px) clamp(18px,2.4vw,26px);display:flex;flex-direction:column;position:relative;scroll-margin-top:12px}'),
    ('''    mlist.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => { current = +b.dataset.i; renderList(); renderPage(); });
    });''',
     '''    mlist.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        current = +b.dataset.i; renderList(); renderPage();
        if (window.matchMedia('(max-width:1080px)').matches) pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });'''),
])

# ---------------- D3: non-sticky bar on phones, bigger note hit area, nav targets ----------------
edit('dir-3.html', [
    ('''    .bar-in{padding:8px 16px;min-height:52px;gap:10px}''',
     '''    .bar{position:static}
    .bar-in{padding:8px 16px;min-height:52px;gap:10px}
    .bar nav a{display:inline-flex;align-items:center;min-height:44px}'''),
    ('''  .seg .note-btn{display:inline-flex;align-items:center;gap:5px;background:none;border:0;padding:0;cursor:pointer;''',
     '''  .seg .note-btn{position:relative;display:inline-flex;align-items:center;gap:5px;background:none;border:0;padding:0;cursor:pointer;'''),
    ('''  .seg .note-btn .ch{transition:transform .25s;font-size:13px;color:var(--crimson)}''',
     '''  .seg .note-btn::after{content:"";position:absolute;inset:-13px -10px}
  .seg .note-btn .ch{transition:transform .25s;font-size:13px;color:var(--crimson)}'''),
])
