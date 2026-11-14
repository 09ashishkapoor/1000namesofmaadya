p = 'dir-2.html'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:70])
        return
    s = s.replace(old, new, 1)


# stronger object separation
sub('    --desk:#e4d8bf;\n    --paper:#f6efdd;\n    --paper-2:#efe5cf;',
    '    --desk:#ddcfb2;\n    --paper:#faf3e3;\n    --paper-2:#eee3ca;')
sub('''  .spread{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);
          background:var(--paper);box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 18px 40px -22px rgba(70,50,20,.55),0 0 0 1px var(--rule-dark);
          position:relative}''',
    '''  .spread{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);
          background:var(--paper);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 30px 60px -30px rgba(70,50,20,.65),0 2px 0 rgba(255,255,255,.5) inset,0 0 0 1px var(--rule-dark);
          position:relative}''')
sub('  .reader{padding:clamp(28px,4vw,54px) var(--edge) clamp(26px,3.4vw,44px);position:relative}',
    '  .reader{padding:clamp(28px,4vw,54px) var(--edge) clamp(26px,3.4vw,44px);position:relative;background:var(--desk)}')

# name size safety + truncation of the long note
sub('  .page-name{font-family:var(--dev);font-weight:400;font-size:clamp(34px,3.6vw,50px);line-height:1.32;margin:0 0 4px;color:var(--ink)}',
    '  .page-name{font-family:var(--dev);font-weight:400;font-size:clamp(30px,3vw,44px);line-height:1.4;margin:0 0 2px;color:var(--ink)}')
sub("'<p class=\"page-elab\">' + elab + '</p>' +",
    "'<p class=\"page-elab\">' + shorten(elab) + '</p>' +")
sub('''  function renderPage(){''',
    '''  function shorten(t){
    if (t.length <= 640) return t;
    return t.slice(0, 640).replace(/[\\s,;:]\\S*$/, '') + '…';
  }

  function renderPage(){''')

open(p, 'w', encoding='utf-8').write(s)
print('patched dir-2')
