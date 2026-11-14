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
'''

BUTTON = '''    <button class="theme" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to night reading">
      <span class="sw" aria-hidden="true"></span><span class="lbl">Night</span>
    </button>
'''

JS = '''<script>
  (function () {
    var root = document.documentElement;
    var KEY = 'pothi-theme';
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
        try { localStorage.setItem(KEY, night ? 'night' : 'day'); } catch (e) {}
        label();
      });
    });
    label();
  })();
</script>
'''


def patch(path):
    s = open(path, encoding='utf-8').read()
    link = '<link rel="stylesheet" href="pothi-system.css">'
    assert link in s, path + ': stylesheet link not found'
    s = s.replace(link, link + '\n' + HEAD, 1)

    nav_end = '  </nav>\n</header>'
    assert nav_end in s, path + ': nav end not found'
    s = s.replace(nav_end, '  </nav>\n' + BUTTON + '</header>', 1)

    assert '</body>' in s
    s = s.replace('</body>', JS + '</body>', 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('patched', path)


patch('pothi-name-page.html')
patch('pothi-range-page.html')
