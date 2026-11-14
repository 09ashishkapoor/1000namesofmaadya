import json, subprocess

hundred = open('design-demos/_tools/names-100.js', encoding='utf-8').read()
ranges = open('design-demos/_tools/ranges.js', encoding='utf-8').read()

HTML = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Adya Mahakali Names 1–100 — The Pothi</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Tiro+Devanagari+Sanskrit:ital@0;1&family=Noto+Serif+Devanagari:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="pothi-system.css">
</head>
<body>

<div class="fore" id="fore" aria-hidden="true"></div>

<header class="bar">
  <a class="brand" href="/">
    <span class="dev">आद्या महाकाली सहस्रनाम</span>
    <span class="lat">Maa Ādya Mahākālī</span>
  </a>
  <nav aria-label="Site">
    <a href="/names/">Names</a>
    <a href="/108-names-of-kali/">108 names</a>
    <a href="/kali-sahasranama-pdf/">PDF</a>
    <a href="/sources/">Sources</a>
  </nav>
</header>

<main class="page">
  <div class="narrow">

    <nav class="crumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/names/">Names hub</a></li>
        <li><span aria-current="page">1–100</span></li>
      </ol>
    </nav>

    <p class="kicker">Range 1 of 11 · 100 of the 1,072 names</p>
    <h1 class="num-title" lang="sa">१–१००</h1>
    <p class="iast-title">Names 1–100</p>
    <p class="common-title">Śmaśāna Kālikā → Caṇḍā</p>

    <nav class="rtabs" id="rtabs" aria-label="Name ranges"></nav>

    <div class="sechead" style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin:22px 0 6px;flex-wrap:wrap">
      <h2 class="sec" style="border:0;margin:0;flex:1"><span class="n">पाठ</span>The first hundred names</h2>
      <span class="meta" style="font-family:var(--serif);font-size:12.5px;font-variant:all-small-caps;letter-spacing:.12em;color:var(--ash)">Devanagari · IAST · meaning</span>
    </div>

    <div class="index-cols" id="idx">
      <noscript>
        <p>This prototype renders the hundred rows with a small script; the production page is
        generated as static HTML at build time, exactly like the current range pages.</p>
      </noscript>
    </div>

    <nav class="pager" aria-label="Range navigation" style="margin-top:clamp(26px,3vw,40px)">
      <a href="/names/" style="visibility:hidden">
        <span class="lab">← Previous range</span>
        <span class="dev">—</span>
      </a>
      <a href="/names/101-200/">
        <span class="lab">Next range · 101–200 →</span>
        <span class="dev" lang="sa">१०१–२००</span>
        <span class="iast">Kula Vartma Prakāśinī → …</span>
      </a>
    </nav>

    <section class="panel" style="margin-top:clamp(26px,3vw,40px)" aria-labelledby="note">
      <h2 class="sec" id="note"><span class="n">स्रोत</span>About these pages</h2>
      <p class="prose" style="font-size:16px;margin:0 0 10px">
        Ten ranges of one hundred names, then a final range of seventy-two. Each name has its own page with
        the Sanskrit in Devanagari, the IAST transliteration, the meaning and the longer note. The same text
        is available as a printable PDF.
      </p>
      <p style="font-size:15px;color:var(--ash);margin:0">
        <a class="u" href="/sources/">Editorial method</a> ·
        <a class="u" href="/kali-sahasranama-pdf/">PDF edition</a> ·
        <a class="u" href="/108-names-of-kali/">108 names guide</a>
      </p>
    </section>

  </div>
</main>

<footer class="colophon">
  <div class="om">ॐ</div>
  <p class="ded">Dedicated to <strong>Shri Praveen Radhakrishnan</strong> and <strong>Khyapa Parampara</strong></p>
  <p class="mantra">Jai Ma Krishna<br>Jai Mā Ādya Mahākālī<br>Jai Kālabhairava</p>
  <div class="links">
    <a href="/">The reader</a><a href="/names/">Names hub</a><a href="/about/">About</a>
    <a href="/sources/">Sources</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a>
  </div>
  <p class="fine">Maa Ādya Mahākālī Sahasranāma · 1,072 names · The Pothi, range page</p>
</footer>

<script>
__HUNDRED__
__RANGES__
(function () {
  var idx = document.getElementById('idx');
  var frag = document.createDocumentFragment();
  HUNDRED.forEach(function (r) {
    var a = document.createElement('a');
    a.className = 'nrow';
    a.href = '/names/' + r[5] + '/';
    a.innerHTML = '<span class="no">' + String(r[0]).padStart(2, '0') + '</span>' +
      '<span><span class="dev" lang="sa">' + r[1] + '</span>' +
      '<span class="iast">' + r[2] + '</span>' +
      '<span class="one">' + r[4] + '</span></span>';
    frag.appendChild(a);
  });
  idx.appendChild(frag);

  var tabs = document.getElementById('rtabs');
  RANGES.forEach(function (rg, i) {
    var a = document.createElement('a');
    a.href = rg.path;
    a.textContent = rg.label.replace('–', '–');
    if (rg.label.indexOf('1–100') === 0) a.setAttribute('aria-current', 'page');
    tabs.appendChild(a);
  });

  var fore = document.getElementById('fore');
  for (var i = 0; i < 11; i++) {
    var b = document.createElement('i');
    if (i === 0) b.className = 'now';
    fore.appendChild(b);
  }
})();
</script>
</body>
</html>
'''

HTML = HTML.replace('__HUNDRED__', hundred).replace('__RANGES__', ranges)
open('design-demos/pothi-range-page.html', 'w', encoding='utf-8').write(HTML)
print('wrote pothi-range-page.html', len(HTML))
