from PIL import Image, ImageDraw, ImageFont
import os

W, H = 720, 450          # each panel, uniform 16:10 scale of a 1440x900 first screen
GAP = 26
MARGIN = 40
TOP = 96
LABEL_H = 78
BG = (24, 22, 20)
FG = (232, 226, 214)

panels = [
    ('review/d1-1440.png', '01', 'The Ring of Names', 'Sugiura · dark, radial, one crimson aperture'),
    ('review/d2-1440.png', '02', 'The Pothi', 'Irma Boom · paper, spread, fore-edge of 98 sets'),
    ('review/d3-1440.png', '03', 'The Study Page', 'Sefaria · white, segmented, tool-like'),
]

Wtot = MARGIN * 2 + W * 3 + GAP * 2
Htot = TOP + H + LABEL_H + MARGIN
board = Image.new('RGB', (Wtot, Htot), BG)
d = ImageDraw.Draw(board)

font_dir = os.path.join(os.environ.get('WINDIR', 'C:/Windows'), 'Fonts')


def font(names, size):
    for cand in names:
        p = os.path.join(font_dir, cand)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


f_title = font(['georgia.ttf', 'segoeui.ttf', 'arial.ttf'], 30)
f_meta = font(['segoeui.ttf', 'arial.ttf'], 15)
f_num = font(['segoeui.ttf', 'arial.ttf'], 14)
f_lab = font(['georgia.ttf', 'segoeui.ttf'], 24)
f_sub = font(['segoeui.ttf', 'arial.ttf'], 14)

d.text((MARGIN, 30), 'Maa Ādya Mahākālī Sahasranāma — three directions', font=f_title, fill=FG)
d.text((MARGIN, 66), 'real Devanagari · real names 1–11 · first screen at 1440 × 900 · full-page shots in design-demos/review/',
       font=f_meta, fill=(150, 143, 130))

for i, (path, num, label, sub) in enumerate(panels):
    x = MARGIN + i * (W + GAP)
    im = Image.open(path).convert('RGB')
    im = im.crop((0, 0, im.width, min(900, im.height)))
    im = im.resize((W, H), Image.LANCZOS)
    board.paste(im, (x, TOP))
    d.rectangle([x, TOP, x + W - 1, TOP + H - 1], outline=(58, 54, 48))
    y = TOP + H + 16
    d.text((x, y), num, font=f_num, fill=(170, 140, 80))
    d.text((x + 30, y - 6), label, font=f_lab, fill=FG)
    d.text((x + 30, y + 26), sub, font=f_sub, fill=(150, 143, 130))

board.save('review/proposal-board.png')
print('saved review/proposal-board.png', board.size)

# individual first-screen crops for sharing
for path, name in [('review/d1-1440.png', 'shot-d1.png'), ('review/d2-1440.png', 'shot-d2.png'),
                   ('review/d3-1440.png', 'shot-d3.png')]:
    im = Image.open(path).convert('RGB')
    im.crop((0, 0, im.width, min(900, im.height))).save('review/' + name)
    print('saved review/' + name)
