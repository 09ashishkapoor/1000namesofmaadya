import re


def edit(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        if old not in s:
            print(path, 'MISSING:', old[:70].replace('\n', ' | '))
            continue
        s = s.replace(old, new, 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('patched', path)


# ---------------- D1 ----------------
edit('dir-1.html', [
    ('--ash-dim:#6f6557;', '--ash-dim:#8a8072;'),
    # CTA height ≥44
    ('''  .begin{display:inline-flex;align-items:center;gap:14px;font-size:17px;letter-spacing:.06em;font-variant:all-small-caps;
         color:var(--paper);text-decoration:none;border-bottom:1px solid var(--gold);padding-bottom:8px}''',
     '''  .begin{display:inline-flex;align-items:center;gap:14px;font-size:17px;letter-spacing:.06em;font-variant:all-small-caps;
         color:var(--paper);text-decoration:none;border-bottom:1px solid var(--gold);padding:8px 0 12px;min-height:44px}'''),
    # reason copy to 16px
    ('  .reasons p{margin:0;font-size:15.5px;line-height:1.6;color:var(--ash-dim);max-width:none}',
     '  .reasons p{margin:0;font-size:16px;line-height:1.62;color:var(--ash-dim);max-width:none}'),
])

# ---------------- D2 ----------------
edit('dir-2.html', [
    ('--ash:#6d6250;', '--ash:#5b5142;'),
    ('--gold:#a9853f;', '--gold:#7d5f24;'),
    # frontispiece caption: scrim so it stays legible over the photo
    ('''  .frontis .plate{position:absolute;left:26px;bottom:24px;z-index:2;font-family:var(--serif);font-size:12px;
               font-variant:all-small-caps;letter-spacing:.16em;color:#f8f2e2;text-shadow:0 1px 8px rgba(40,25,10,.7)}''',
     '''  .frontis .plate{position:absolute;left:0;right:0;bottom:0;z-index:2;font-family:var(--serif);font-size:12px;
               font-variant:all-small-caps;letter-spacing:.16em;color:#f8f2e2;padding:14px 26px 16px;
               background:linear-gradient(180deg,transparent,rgba(28,20,10,.78))}'''),
])

# ---------------- D3 ----------------
edit('dir-3.html', [
    ('--ash:#6b6259;', '--ash:#5c544b;'),
    ('--mute:#9a9186;', '--mute:#6d6459;'),
    # tabs -> visual only (removes 15x8 click targets; jump input stays the keyboard path)
    ("""    <div class="ticks" id="ticks"></div>""",
     """    <div class="ticks" id="ticks" aria-hidden="true"></div>"""),
    ("""      const el = document.createElement('button');
      el.type = 'button';
      if (i < setIndex) el.className = 'done';
      if (i === setIndex) el.className = 'now';
      if (i < 2){
        el.title = 'Set ' + String(i + 1).padStart(2, '0');
        el.setAttribute('aria-label', 'Go to set ' + (i + 1));
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => { setIndex = i; render(); });
      } else {
        el.tabIndex = -1;
        el.setAttribute('aria-hidden', 'true');
      }
      t.appendChild(el);""",
     """      const el = document.createElement('i');
      if (i < setIndex) el.className = 'done';
      if (i === setIndex) el.className = 'now';
      t.appendChild(el);"""),
    ('  .ticks button{height:8px;padding:0;background:#e8e2d8;border:0;cursor:default}',
     '  .ticks i{display:block;height:8px;background:#e8e2d8}'),
    # rail buttons ≥40 tall
    ('''  .rail .steps button{flex:1;background:var(--panel);border:1px solid var(--line);border-radius:3px;
                      font-family:var(--ui);font-size:12px;color:var(--ink);padding:8px 6px;cursor:pointer}''',
     '''  .rail .steps button{flex:1;min-height:40px;background:var(--panel);border:1px solid var(--line);border-radius:3px;
                      font-family:var(--ui);font-size:12px;color:var(--ink);padding:8px 6px;cursor:pointer}'''),
])
