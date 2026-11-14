import re

FILES = ['pothi-name-page.html', 'pothi-range-page.html', 'dir-2.html']
SCRIPT_TAG = '<script src="pothi-theme.js" defer></script>\n'

# the inline toggle block used in the prototypes (from '<script>' ... '</script>' before </body>)
PATTERN = re.compile(
    r"<script>\s*\(function \(\) \{\s*var (?:root|var) = document\.documentElement;.*?</script>\n?(?=</body>)",
    re.S,
)

for path in FILES:
    s = open(path, encoding='utf-8').read()
    if 'pothi-theme.js' in s:
        print(path, 'already wired')
        continue

    m = PATTERN.search(s)
    if not m:
        print(path, 'PATTERN NOT FOUND — inspect manually')
        continue

    removed = m.group(0)
    s = s[:m.start()] + SCRIPT_TAG + s[m.end():]
    open(path, 'w', encoding='utf-8').write(s)
    print(path, 'wired to pothi-theme.js (removed %d chars of inline JS)' % len(removed))
