p = 'pothi-system.css'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:70].replace('\n', ' | '))
        return
    s = s.replace(old, new, 1)


# 1. extra tokens on the day theme
sub('''  --rule: #cdbc9c;
  --rule-dark: #b7a37e;''',
    '''  --rule: #cdbc9c;
  --rule-dark: #b7a37e;
  --rule-soft: rgba(120, 95, 55, .18);
  --edge-band: #e2d5b8;
  --edge-bg: #e9dfc7;
  --hover: rgba(250, 243, 227, .7);
  --hover-accent: rgba(156, 43, 28, .05);
  --panel-shadow: 0 18px 40px -30px rgba(70, 50, 20, .55);
  --placeholder: #9a8d76;''')

# 2. night theme: the same book, after dark
sub('''* { box-sizing: border-box; }''',
    '''/* ---------- night reading: warm ink-black, not a dark skin ---------- */
:root[data-theme="night"] {
  --paper: #1a1410;
  --paper-2: #120e0b;
  --paper-3: #171210;
  --ink: #efe3cd;
  --ink-2: #d3c5ad;
  --ash: #a99a83;
  --cinnabar: #e0604a;
  --gold: #d3ab5a;
  --rule: rgba(211, 171, 90, .20);
  --rule-dark: rgba(211, 171, 90, .34);
  --rule-soft: rgba(211, 171, 90, .14);
  --edge-band: #2a211a;
  --edge-bg: #171210;
  --hover: rgba(224, 96, 74, .06);
  --hover-accent: rgba(224, 96, 74, .10);
  --panel-shadow: none;
  --placeholder: #8f8471;
  color-scheme: dark;
}
:root[data-theme="night"] body {
  background-image: repeating-linear-gradient(90deg, rgba(211, 171, 90, .035) 0 1px, transparent 1px 3px);
}
@media print {
  :root[data-theme="night"] {
    --paper: #faf3e3; --paper-2: #eee3ca; --paper-3: #f2e7cf;
    --ink: #1b1510; --ink-2: #4a3f31; --ash: #5b5142;
    --cinnabar: #9c2b1c; --gold: #775a21;
    --rule: #cdbc9c; --rule-dark: #b7a37e;
  }
}

* { box-sizing: border-box; }''')

# 3. components use the tokens
sub('''.fore i { flex: 0 0 34px; display: block; background: #e2d5b8; }''',
    '''.fore i { flex: 0 0 34px; display: block; background: var(--edge-band); }''')
sub('''  border-left: 1px solid rgba(120, 95, 55, .18); background: #efe5cd;''',
    '''  border-left: 1px solid var(--rule-soft); background: var(--edge-bg);''')
sub('''  box-shadow: 0 18px 40px -30px rgba(70, 50, 20, .55);''',
    '''  box-shadow: var(--panel-shadow);''')
sub('''  border-left: 1px solid rgba(120, 95, 55, .18);
}''',
    '''  border-left: 1px solid var(--rule-soft);
}''')
sub('''.rtabs a:hover { color: var(--cinnabar); background: rgba(156, 43, 28, .05); }''',
    '''.rtabs a:hover { color: var(--cinnabar); background: var(--hover-accent); }''')
sub('''.nrow:hover { background: rgba(250, 243, 227, .7); }''',
    '''.nrow:hover { background: var(--hover); }''')
sub('''.nrow {''', '''.nrow {''')

# 4. theme control, in the running head
sub('''/* ---------- fore-edge''',
    '''/* ---------- night-reading control ---------- */
.theme {
  display: inline-flex; align-items: center; gap: 7px;
  background: none; border: 0; border-left: 1px solid var(--rule-soft);
  margin-left: 4px; padding: 0 0 0 16px; min-height: 36px;
  font-family: var(--serif); font-size: 12.5px; font-variant: all-small-caps;
  letter-spacing: .14em; color: var(--ash); cursor: pointer;
}
.theme:hover, .theme:focus-visible { color: var(--ink); }
.theme .sw { width: 10px; height: 10px; border-radius: 50%; border: 1px solid currentColor; display: inline-block; }
.theme[aria-pressed="true"] .sw { background: currentColor; }
.theme[aria-pressed="true"] { color: var(--gold); }
@media (max-width: 700px) {
  .theme { border-left: 0; padding-left: 0; min-height: 38px; }
}

/* ---------- fore-edge''')

# 5. remaining hard-coded borders -> tokens
s = s.replace('1px solid rgba(120, 95, 55, .16)', '1px solid var(--rule-soft)')
s = s.replace('1px solid rgba(120, 95, 55, .2)', '1px solid var(--rule-soft)')

open(p, 'w', encoding='utf-8').write(s)
print('pothi-system.css: night mode added')
