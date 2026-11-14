p = 'dir-3.html'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:80].replace('\n', ' | '))
        return
    s = s.replace(old, new, 1)


# 1. constrain the entry block
sub("  .entry-in{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:clamp(20px,4vw,54px);align-items:start;max-width:1180px}",
    "  .entry-in{display:grid;grid-template-columns:minmax(0,720px) auto;gap:clamp(20px,4vw,54px);align-items:start;justify-content:space-between;max-width:1000px}")

# 2. rail set line
sub('''    <div class="set"><span>Set</span><b id="rSet">01</b><span>of 98</span></div>''',
    '''    <div class="set"><span>Set <b id="rSet">01</b> of 98</span></div>''')
sub('''  .rail .set{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:12px}''',
    '''  .rail .set{display:flex;align-items:baseline;justify-content:flex-start;border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:12px}''')

# 3. hint copy (no false URL claim)
sub('''    <p class="hint">Each set is eleven names. Your place is kept in the URL, so you can return to the same set.</p>''',
    '''    <p class="hint">Each set is eleven names, so the recitation has a natural place to pause. The darker marks above are the sets before this one.</p>''')

# 4. quieter, tighter segments
sub('  .seg{display:grid;grid-template-columns:46px minmax(0,1fr);gap:0 18px;padding:22px 0 20px;border-top:1px solid var(--line)}',
    '  .seg{display:grid;grid-template-columns:46px minmax(0,1fr);gap:0 18px;padding:18px 0 14px;border-top:1px solid var(--line)}')
sub('  .seg .one{font-size:18px;line-height:1.6;color:var(--ink-2);margin:0 0 10px;max-width:60ch}',
    '  .seg .one{font-size:18px;line-height:1.6;color:var(--ink-2);margin:0 0 8px;max-width:60ch}')
sub('''  .seg .note-btn{display:inline-flex;align-items:center;gap:6px;background:none;border:0;padding:2px 0;cursor:pointer;
                 font-family:var(--ui);font-size:12px;color:var(--ash);border-bottom:1px solid transparent}''',
    '''  .seg .note-btn{display:inline-flex;align-items:center;gap:5px;background:none;border:0;padding:0;cursor:pointer;
                 font-family:var(--ui);font-size:11.5px;letter-spacing:.02em;color:var(--mute);transition:color .15s}''')
sub('  .seg .note-btn:hover,.seg .note-btn:focus-visible{color:var(--crimson);border-color:rgba(158,27,50,.4)}',
    '  .seg .note-btn:hover,.seg .note-btn:focus-visible{color:var(--crimson)}')

# 5. clickable ticks
sub('''      <div class="ticks" id="ticks" aria-hidden="true"></div>''',
    '''    <div class="ticks" id="ticks"></div>''')
sub("  .ticks i{height:6px;background:#e8e2d8}",
    "  .ticks button{height:8px;padding:0;background:#e8e2d8;border:0;cursor:default}")
sub('''    const t = $('#ticks');
    t.innerHTML = '';
    for (let i = 0; i < TOTAL_SETS; i++){
      const el = document.createElement('i');
      if (i < setIndex) el.className = 'done';
      if (i === setIndex) el.className = 'now';
      t.appendChild(el);
    }''',
    '''    const t = $('#ticks');
    t.innerHTML = '';
    for (let i = 0; i < TOTAL_SETS; i++){
      const el = document.createElement('button');
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
      t.appendChild(el);
    }''')

# 6. mobile: search row + sticky set bar
sub('''    .gsearch{order:3;flex:1 1 100%;max-width:none;margin-left:0;margin-top:6px;display:none}''',
    '''    .bar-in{flex-wrap:wrap}
    .gsearch{order:3;flex:1 1 100%;max-width:none;margin:6px 0 2px;display:flex}''')

sub('''  <footer>''',
    '''  <div class="mbar" aria-label="Set navigation">
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
print('patched dir-3')
