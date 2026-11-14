p = 'dir-2.html'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:70].replace('\n', ' | '))
        return
    s = s.replace(old, new, 1)


# tokens used by both themes
sub('''    --edge:clamp(20px,5vw,72px);''',
    '''    --edge:clamp(20px,5vw,72px);
    --paper-3:#f2e7cf;
    --rule-soft:rgba(120,95,55,.15);
    --edge-band:#e9dfc7;
    --hover:rgba(250,243,227,.7);
    --placeholder:#9a8d76;
    --spread-shadow:0 30px 60px -30px rgba(70,50,20,.65);''')

# night theme + print fallback
sub('''  *{box-sizing:border-box}''',
    '''  /* ---------- night reading ---------- */
  :root[data-theme="night"]{
    --desk:#0c0907;
    --paper:#1a1410;
    --paper-2:#120e0b;
    --paper-3:#171210;
    --ink:#efe3cd;
    --ink-2:#d3c5ad;
    --ash:#a99a83;
    --cinnabar:#e0604a;
    --gold:#d3ab5a;
    --rule:rgba(211,171,90,.20);
    --rule-dark:rgba(211,171,90,.34);
    --rule-soft:rgba(211,171,90,.14);
    --edge-band:#2a211a;
    --hover:rgba(224,96,74,.06);
    --placeholder:#8f8471;
    --spread-shadow:0 24px 50px -30px rgba(0,0,0,.85);
    color-scheme:dark;
  }
  :root[data-theme="night"] body{
    background-image:repeating-linear-gradient(90deg,rgba(211,171,90,.035) 0 1px,transparent 1px 3px);
  }
  :root[data-theme="night"] .frontis{background:#0e0b09}
  :root[data-theme="night"] .frontis img{filter:grayscale(1) sepia(.3) contrast(1.04) brightness(.6)}
  :root[data-theme="night"] .frontis::after{
    background:linear-gradient(180deg,rgba(14,11,9,.10),rgba(14,11,9,.6) 78%,var(--paper-2));
  }
  :root[data-theme="night"] .frontis .plate{
    background:linear-gradient(180deg,transparent,rgba(6,4,3,.88));
  }
  @media print{
    :root[data-theme="night"]{
      --paper:#faf3e3;--paper-2:#eee3ca;--paper-3:#f2e7cf;
      --ink:#1b1510;--ink-2:#4a3f31;--ash:#5b5142;
      --cinnabar:#9c2b1c;--gold:#775a21;
      --rule:#cdbc9c;--rule-dark:#b7a37e;--rule-soft:rgba(120,95,55,.15);
    }
  }

  *{box-sizing:border-box}''')

# hard-coded colours -> tokens
sub('''  .frontis{position:relative;overflow:hidden;background:#d9cbae}''',
    '''  .frontis{position:relative;overflow:hidden;background:var(--paper-3)}''')
sub('''  .fore i{flex:1;display:block;background:#e9dfc7}''',
    '''  .fore i{flex:1;display:block;background:var(--edge-band)}''')
sub('''  .mfind{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--rule);background:#f2e7cf}''',
    '''  .mfind{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--rule);background:var(--paper-3)}''')
sub('''  .mfind input::placeholder{color:#9a8d76;font-style:italic}''',
    '''  .mfind input::placeholder{color:var(--placeholder);font-style:italic}''')
sub('''  .toc li{border-bottom:1px solid rgba(120,95,55,.13)}''',
    '''  .toc li{border-bottom:1px solid var(--rule-soft)}''')
sub('''          background:var(--paper);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 30px 60px -30px rgba(70,50,20,.65),0 2px 0 rgba(255,255,255,.5) inset,0 0 0 1px var(--rule-dark);''',
    '''          background:var(--paper);box-shadow:0 1px 0 rgba(255,255,255,.06) inset,var(--spread-shadow),0 0 0 1px var(--rule-dark);''')
s = s.replace('1px solid rgba(120,95,55,.14)', '1px solid var(--rule-soft)')
s = s.replace('1px solid rgba(120,95,55,.13)', '1px solid var(--rule-soft)')
s = s.replace('1px solid rgba(120,95,55,.12)', '1px solid var(--rule-soft)')

# the control, in the running head
sub('''  .bar nav a:hover,.bar nav a:focus-visible{color:var(--ink);border-color:var(--cinnabar)}''',
    '''  .bar nav a:hover,.bar nav a:focus-visible{color:var(--ink);border-color:var(--cinnabar)}
  .theme{display:inline-flex;align-items:center;gap:7px;background:none;border:0;border-left:1px solid var(--rule-soft);
         margin-left:4px;padding:0 0 0 16px;min-height:36px;font-family:var(--serif);font-size:12.5px;
         font-variant:all-small-caps;letter-spacing:.14em;color:var(--ash);cursor:pointer}
  .theme:hover,.theme:focus-visible{color:var(--ink)}
  .theme .sw{width:10px;height:10px;border-radius:50%;border:1px solid currentColor;display:inline-block}
  .theme[aria-pressed="true"] .sw{background:currentColor}
  .theme[aria-pressed="true"]{color:var(--gold)}
  @media (max-width:640px){.theme{border-left:0;padding-left:0;min-height:44px}}''')

open(p, 'w', encoding='utf-8').write(s)
print('dir-2: night tokens + control')
