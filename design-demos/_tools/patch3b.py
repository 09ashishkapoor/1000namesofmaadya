p = 'dir-3.html'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:80].replace('\n', ' | '))
        return
    s = s.replace(old, new, 1)


sub('<div class="ticks" id="ticks" aria-hidden="true"></div>', '<div class="ticks" id="ticks"></div>')

sub('''<footer>''',
    '''<div class="mbar" aria-label="Set navigation">
  <button id="mPrev" type="button" disabled>← set</button>
  <span>set <b id="mSet">01</b> / 98</span>
  <button id="mNext" type="button">set →</button>
</div>

<footer>''')

sub('''  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}''',
    '''  .mbar{display:none}
  @media (max-width:1040px){
    .mbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:30;align-items:center;justify-content:space-between;
          gap:10px;padding:8px 16px calc(8px + env(safe-area-inset-bottom));background:rgba(251,249,245,.97);
          border-top:1px solid var(--line);font-family:var(--ui);font-size:12px;color:var(--ash)}
    .mbar button{background:var(--panel);border:1px solid var(--line);border-radius:3px;font-family:var(--ui);
                 font-size:12.5px;color:var(--ink);padding:9px 14px;min-height:40px;cursor:pointer}
    .mbar button:disabled{color:#c3bbb0}
    .mbar b{color:var(--crimson);font-weight:600}
    body{padding-bottom:62px}
  }
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}''')

sub('''    $('#prev').disabled = setIndex === 0;
    $('#next').disabled = setIndex >= 1;''',
    '''    $('#prev').disabled = setIndex === 0;
    $('#next').disabled = setIndex >= 1;
    $('#mPrev').disabled = setIndex === 0;
    $('#mNext').disabled = setIndex >= 1;
    $('#mSet').textContent = String(setIndex + 1).padStart(2, '0');''')

sub('''  $('#prev').addEventListener('click', () => { if (setIndex > 0){ setIndex--; render(); } });''',
    '''  $('#prev').addEventListener('click', () => { if (setIndex > 0){ setIndex--; render(); } });
  $('#mPrev').addEventListener('click', () => { if (setIndex > 0){ setIndex--; render(); } });
  $('#mNext').addEventListener('click', () => { if (setIndex < 1){ setIndex++; render(); } });''')

open(p, 'w', encoding='utf-8').write(s)
print('patched dir-3 (b)')
