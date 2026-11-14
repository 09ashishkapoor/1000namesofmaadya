import json

kali = json.load(open('design-demos/_tools/kali.json', encoding='utf-8'))

blocks = []
for b in kali['blocks']:
    if 'h' in b:
        blocks.append(f'<h3 class="dev-sec">{b["h"]}</h3>')
    else:
        text = b['p']
        blocks.append(f'<p>{text}</p>')
# first paragraph becomes the lede with a drop cap
blocks[0] = blocks[0].replace('<p>', '<p class="lede drop">', 1)

NAME_HTML = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{kali["common"]} ({kali["iast"]}) — Meaning in the 1000 Names of Maa Kali</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Tiro+Devanagari+Sanskrit:ital@0;1&family=Noto+Serif+Devanagari:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="pothi-system.css">
</head>
<body>

<div class="fore" aria-hidden="true"><i class="now"></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>

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
        <li><a href="/names/1-100/">1–100</a></li>
        <li><span aria-current="page">{kali["common"]}</span></li>
      </ol>
    </nav>

    <p class="kicker">Sahasranama position 2 of the 1,072 names</p>
    <h1 class="dev-title" lang="sa">{kali["dev"]}</h1>
    <p class="iast-title">{kali["iast"]}</p>
    <p class="common-title">Also written {kali["common"]}</p>

    <div class="sheet" style="margin-top:clamp(22px,3vw,36px)">
      <span class="folio" aria-label="Position 2">2</span>
      <section class="panel" aria-labelledby="means">
        <h2 class="sec" id="means"><span class="n">01</span>What {kali["common"]} means</h2>
        <p class="prose lede" style="max-width:60ch;margin:0 0 18px">
          <strong>{kali["common"]}</strong> is name 2 in the <strong>Adya Mahakali Sahasranama</strong>, the
          1,072-name devotional text to Maa Kali. {kali["one"]}
        </p>
        <dl class="spellings">
          <dt>Devanagari</dt><dd lang="sa">{kali["dev"]}</dd>
          <dt>IAST</dt><dd>{kali["iast"]}</dd>
          <dt>Common spelling</dt><dd>{kali["common"]}</dd>
          <dt>Source transliteration</dt><dd class="src">{kali["site"]}</dd>
        </dl>
        <p style="font-size:14.5px;line-height:1.6;color:var(--ash);margin:18px 0 0;max-width:64ch">
          Sanskrit names travel into English in several romanizations. This page keeps the common spelling,
          the IAST form, and the source transliteration together so the same name is discoverable under each
          spelling readers use.
        </p>
      </section>
    </div>

    <section style="margin-top:clamp(30px,4vw,52px)" aria-labelledby="elab">
      <h2 class="sec" id="elab"><span class="n">02</span>Meaning and elaboration</h2>
      <div class="prose">
        <p style="font-size:16.5px;color:var(--ash);font-variant:all-small-caps;letter-spacing:.12em;margin-bottom:18px">
          Meaning — {kali["one"]}
        </p>
        {chr(10).join("        " + b for b in blocks)}
      </div>
    </section>

    <nav class="pager" aria-label="Name navigation" style="margin-top:clamp(30px,4vw,48px)">
      <a href="/names/shmashana-kalika/">
        <span class="lab">← Previous name · position 1</span>
        <span class="dev" lang="sa">श्मशान कालिका</span>
        <span class="iast">Śmaśāna Kālikā</span>
      </a>
      <a href="/names/bhadrakali/">
        <span class="lab">Next name · position 3 →</span>
        <span class="dev" lang="sa">भद्रकाली</span>
        <span class="iast">Bhadrakālī</span>
      </a>
    </nav>

    <section style="margin-top:clamp(28px,3.4vw,44px)">
      <div class="seealso">
        <a class="tl" href="/names/1-100/"><span class="t">All names in range 1–100</span><span class="d"></span><span class="p">range</span></a>
        <a class="tl" href="/names/"><span class="t">All 1,072 names</span><span class="d"></span><span class="p">hub</span></a>
        <a class="tl" href="/kali-sahasranama-pdf/"><span class="t">PDF edition</span><span class="d"></span><span class="p">68 pages</span></a>
        <a class="tl" href="/108-names-of-kali/"><span class="t">108 names guide</span><span class="d"></span><span class="p">practice set</span></a>
        <a class="tl" href="/"><span class="t">The reader</span><span class="d"></span><span class="p">sets of eleven</span></a>
        <a class="tl" href="/sources/"><span class="t">Sources &amp; corrections</span><span class="d"></span><span class="p">editorial</span></a>
      </div>
    </section>

    <section class="panel" style="margin-top:clamp(28px,3.4vw,44px)" aria-labelledby="sources">
      <h2 class="sec" id="sources"><span class="n">03</span>Text and sources</h2>
      <p class="prose" style="font-size:16px;margin:0 0 12px">
        The name list follows the Adya Mahakali Sahasranama as compiled for this project. The English meaning
        and elaboration are interpretive notes for devotional study, not a translation of a single critical
        edition.
      </p>
      <p style="font-size:16px;margin:0 0 8px"><a class="u" href="/sources/">Read the editorial method and source notes →</a></p>
      <p style="font-size:15px;color:var(--ash);margin:0">
        <a class="u" href="/about/">About the author</a> ·
        <a class="u" href="/contact/">Contact and corrections</a> ·
        <a class="u" href="/privacy/">Privacy policy</a>
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
  <p class="fine">Maa Ādya Mahākālī Sahasranāma · 1,072 names · The Pothi, name page</p>
</footer>

</body>
</html>
'''

open('design-demos/pothi-name-page.html', 'w', encoding='utf-8').write(NAME_HTML)
print('wrote pothi-name-page.html', len(NAME_HTML))
