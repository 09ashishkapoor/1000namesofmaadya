from PIL import Image, ImageDraw, ImageFont
import os

W, H = 375, 812
GAP = 26
MARGIN = 40
TOP = 92
LABEL_H = 78
BG = (24, 22, 20)
FG = (232, 226, 214)

panels = [
    ('review/m-view-d1.png', '01', 'The Ring of Names', '375 px · ring + one reading column'),
    ('review/m-view-d2.png', '02', 'The Pothi', '375 px · frontispiece + 2-column set index'),
    ('review/m-view-d3.png', '03', 'The Study Page', '375 px · entry + fixed set bar'),
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


f_title = font(['georgia.ttf', 'segoeui.ttf', 'arial.ttf'], 27)
f_meta = font(['segoeui.ttf', 'arial.ttf'], 14)
f_num = font(['segoeui.ttf', 'arial.ttf'], 13)
f_lab = font(['georgia.ttf', 'segoeui.ttf'], 21)
f_sub = font(['segoeui.ttf', 'arial.ttf'], 13)

d.text((MARGIN, 26), 'Phone check — 375 × 812', font=f_title, fill=FG)
d.text((MARGIN, 60), 'also verified at 320 · 360 · 390 · 414 · 768 · no horizontal scroll, no console errors',
       font=f_meta, fill=(150, 143, 130))

for i, (path, num, label, sub) in enumerate(panels):
    x = MARGIN + i * (W + GAP)
    im = Image.open(path).convert('RGB')
    im = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
    im = im.crop((0, 0, W, min(H, im.height)))
    board.paste(im, (x, TOP))
    d.rectangle([x, TOP, x + W - 1, TOP + H - 1], outline=(58, 54, 48))
    y = TOP + H + 14
    d.text((x, y), num, font=f_num, fill=(170, 140, 80))
    d.text((x + 26, y - 5), label, font=f_lab, fill=FG)
    d.text((x + 26, y + 22), sub, font=f_sub, fill=(150, 143, 130))

board.save('review/mobile-board.png')
print('saved review/mobile-board.png', board.size)
