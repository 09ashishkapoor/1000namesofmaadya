p = 'dir-2.html'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:80].replace('\n', ' | '))
        return
    s = s.replace(old, new, 1)


# --- mobile index (replaces the numeric thumb strip) ---
sub('''    <div class="thumbs" id="thumbs" aria-label="Names in this set"></div>''',
    '''    <div class="mindex" id="mindex">
      <div class="mfind">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <input id="mq" type="search" placeholder="find a name or meaning" autocomplete="off" aria-label="Search this set">
        <span class="mc" id="mcount" role="status" aria-live="polite">11 names</span>
      </div>
      <ol class="mlist" id="mlist"></ol>
    </div>''')

sub('''  .thumbs{display:none}
  .thumb-wrap{display:none}''',
    '''  .thumbs{display:none}
  .mindex{display:none}''')

# styles for the mobile index (desktop: hidden)
sub('''  /* essay */''',
    '''  .mindex{display:none}
  .mfind{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--rule);background:#f2e7cf}
  .mfind svg{width:13px;height:13px;stroke:var(--ash);fill:none;stroke-width:1.7}
  .mfind input{flex:1;border:0;background:none;font-family:var(--serif);font-size:15px;color:var(--ink);padding:2px 0;min-width:0}
  .mfind input:focus{outline:none}
  .mfind input::placeholder{color:#9a8d76;font-style:italic}
  .mfind .mc{font-family:var(--serif);font-size:12px;color:var(--ash);font-variant:small-caps;letter-spacing:.06em;white-space:nowrap}
  .mlist{list-style:none;margin:0;padding:2px 0 6px;display:grid;grid-template-columns:1fr 1fr;column-gap:14px}
  .mlist li{border-bottom:1px solid rgba(120,95,55,.13)}
  .mlist button{width:100%;display:flex;align-items:baseline;gap:8px;background:none;border:0;padding:9px 4px;text-align:left;cursor:pointer;color:var(--ink)}
  .mlist .n{font-family:var(--serif);font-size:11px;color:var(--gold);font-variant-numeric:tabular-nums;min-width:16px}
  .mlist .w{font-family:var(--dev);font-size:16px;line-height:1.4}
  .mlist .i{display:block;font-family:var(--serif);font-style:italic;font-size:11.5px;color:var(--ash);margin-top:-1px}
  .mlist button[aria-current="true"] .w{color:var(--cinnabar)}
  .mlist button[aria-current="true"] .n{color:var(--cinnabar)}
  .mlist li.is-hidden{display:none}
  .mlist .none{grid-column:1/-1;font-family:var(--serif);font-size:14px;font-style:italic;color:var(--ash);padding:12px 4px;display:none}
  .mlist .none.on{display:block}

  /* essay */''')

# mobile media query: show the index, drop the old thumbs rules
sub('''    .thumbs{display:flex;overflow-x:auto;gap:0;border-bottom:1px solid var(--rule);background:#ecdfc4;scrollbar-width:none;
            -webkit-overflow-scrolling:touch;mask-image:linear-gradient(90deg,#000 88%,transparent)}
    .thumbs::-webkit-scrollbar{display:none}
    .thumbs button{flex:0 0 auto;min-width:44px;min-height:44px;background:none;border:0;border-right:1px solid rgba(120,95,55,.2);
                   font-family:var(--serif);font-size:12px;color:var(--ash);cursor:pointer;padding:0 4px}
    .thumbs button[aria-current="true"]{background:var(--paper);color:var(--cinnabar);font-weight:600}''',
    '''    .mindex{display:block;border-bottom:1px solid var(--rule)}''')

# JS: replace thumb rendering with the mobile index
sub('''  const toc = $('#toc'), pageEl = $('#page'), fore = $('#fore'), thumbs = $('#thumbs');''',
    '''  const toc = $('#toc'), pageEl = $('#page'), fore = $('#fore'), mlist = $('#mlist');''')

sub('''    thumbs.innerHTML = rows.map((r, i) =>
      '<button type="button" data-i="' + i + '" aria-current="' + (i === current) + '" aria-label="Name ' + r[0] + ': ' + r[3] + '">' +
      String(r[0]).padStart(2, '0') + '</button>').join('');
    thumbs.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => { current = +b.dataset.i; renderList(); renderPage(); });
    });''',
    '''    mlist.innerHTML = rows.map((r, i) =>
      '<li data-search="' + norm(r[1] + ' ' + r[2] + ' ' + r[3] + ' ' + r[4]) + '"><button type="button" data-i="' + i + '" aria-current="' + (i === current) + '" aria-label="Name ' + r[0] + ': ' + r[3] + '">' +
        '<span class="n">' + String(r[0]).padStart(2, '0') + '</span>' +
        '<span><span class="w" lang="sa">' + r[1] + '</span><span class="i">' + r[2] + '</span></span>' +
      '</button></li>').join('') + '<li class="none" id="mNone">No name in this set matches that search.</li>';
    mlist.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => { current = +b.dataset.i; renderList(); renderPage(); });
    });''')

# mobile filter + keep count in sync
sub('''  function filter(){''',
    '''  function mfilter(){
    const q = norm(($('#mq').value || '').trim());
    let shown = 0;
    mlist.querySelectorAll('li[data-search]').forEach(li => {
      const hit = !q || li.getAttribute('data-search').indexOf(q) !== -1;
      li.classList.toggle('is-hidden', !hit);
      if (hit) shown++;
    });
    $('#mcount').textContent = q ? shown + '/' + mlist.querySelectorAll('li[data-search]').length : '11 names';
    const none = $('#mNone');
    if (none) none.classList.toggle('on', !!q && shown === 0);
    if (q && shown) {
      const active = mlist.querySelector('button[aria-current="true"]');
      if (active && active.closest('li').classList.contains('is-hidden')) {
        mlist.querySelector('li[data-search]:not(.is-hidden) button').click();
      }
    }
  }

  function filter(){''')

sub('''  $('#q').addEventListener('input', filter);''',
    '''  $('#q').addEventListener('input', filter);
  $('#mq').addEventListener('input', mfilter);''')

sub('''    renderList(); renderPage();
  })''',
    '''    renderList(); renderPage(); mfilter();
  })''')

# mobile name rows: bigger tap area
sub('''    .nm{grid-template-columns:32px minmax(0,1fr);gap:0 10px}''',
    '''    .nm{grid-template-columns:32px minmax(0,1fr);gap:0 10px}''')

open(p, 'w', encoding='utf-8').write(s)
print('patched dir-2 mobile index')
