import re

NORM = r"""
  function norm(s){
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
"""


def edit(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        if old not in s:
            print(path, 'MISSING:', old[:70].replace('\n', ' | '))
            continue
        s = s.replace(old, new, 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('patched', path)


# ---------- dir 1 ----------
edit('dir-1.html', [
    ("  const list = $('#names');", "  const list = $('#names');" + NORM),
    # give each row searchable text
    ("""        '<li class="nm" data-num="' + num + '">' +""",
     """        '<li class="nm" data-num="' + num + '" data-search="' + norm(dev + ' ' + iast + ' ' + common + ' ' + one) + '">' +"""),
    ("""    const q = $('#q').value.trim().toLowerCase();
    let shown = 0;
    list.querySelectorAll('.nm').forEach(function(li){
      const hit = !q || li.textContent.toLowerCase().indexOf(q) !== -1;""",
     """    const q = norm($('#q').value.trim());
    let shown = 0;
    list.querySelectorAll('.nm').forEach(function(li){
      const hit = !q || li.getAttribute('data-search').indexOf(q) !== -1;"""),
])

# ---------- dir 2 ----------
edit('dir-2.html', [
    ("  const slice = i => NAMES.slice(i * SET_SIZE, i * SET_SIZE + SET_SIZE);",
     "  const slice = i => NAMES.slice(i * SET_SIZE, i * SET_SIZE + SET_SIZE);" + NORM),
    ("""      '<li><button type="button" data-i="' + i + '" aria-current="' + (i === current) + '">' +""",
     """      '<li data-search="' + norm(r[1] + ' ' + r[2] + ' ' + r[3] + ' ' + r[4]) + '"><button type="button" data-i="' + i + '" aria-current="' + (i === current) + '">' +"""),
    ("""    const q = $('#q').value.trim().toLowerCase();
    let shown = 0;
    toc.querySelectorAll('li').forEach(li => {
      const hit = !q || li.textContent.toLowerCase().indexOf(q) !== -1;""",
     """    const q = norm($('#q').value.trim());
    let shown = 0;
    toc.querySelectorAll('li').forEach(li => {
      const hit = !q || li.getAttribute('data-search').indexOf(q) !== -1;"""),
])

# ---------- dir 3 ----------
edit('dir-3.html', [
    ("  const segs = $('#segs');", "  const segs = $('#segs');" + NORM),
    ("""      return '<article class="seg" data-i="' + i + '">' +""",
     """      return '<article class="seg" data-i="' + i + '" data-search="' + norm(dev + ' ' + iast + ' ' + common + ' ' + one) + '">' +"""),
    ("""    const q = $('#q').value.trim().toLowerCase();
    let shown = 0;
    segs.querySelectorAll('.seg').forEach(s => {
      const hit = !q || s.textContent.toLowerCase().indexOf(q) !== -1;""",
     """    const q = norm($('#q').value.trim());
    let shown = 0;
    segs.querySelectorAll('.seg').forEach(s => {
      const hit = !q || s.getAttribute('data-search').indexOf(q) !== -1;"""),
])
