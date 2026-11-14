p = 'dir-2.html'
s = open(p, encoding='utf-8').read()

HEAD = '''<meta name="color-scheme" content="light dark">
<script>
  (function () {
    try {
      var t = localStorage.getItem('pothi-theme');
      if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
      if (t === 'night') document.documentElement.dataset.theme = 'night';
    } catch (e) {}
  })();
</script>
</head>'''

BUTTON = '''  </nav>
  <button class="theme" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to night reading">
    <span class="sw" aria-hidden="true"></span><span class="lbl">Night</span>
  </button>
</header>'''

JS = '''<script>
  (function () {
    var root = document.documentElement;
    function label() {
      var night = root.dataset.theme === 'night';
      document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(night));
        b.setAttribute('aria-label', night ? 'Switch to day reading' : 'Switch to night reading');
        var l = b.querySelector('.lbl');
        if (l) l.textContent = night ? 'Day' : 'Night';
      });
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var night = root.dataset.theme !== 'night';
        if (night) root.dataset.theme = 'night'; else root.removeAttribute('data-theme');
        try { localStorage.setItem('pothi-theme', night ? 'night' : 'day'); } catch (e) {}
        label();
      });
    });
    label();
  })();
</script>
</body>'''

assert '</head>' in s and '  </nav>\n</header>' in s and '</body>' in s
s = s.replace('</head>', HEAD, 1)
s = s.replace('  </nav>\n</header>', BUTTON, 1)
s = s.replace('</body>', JS, 1)
open(p, 'w', encoding='utf-8').write(s)
print('dir-2: toggle wired')
