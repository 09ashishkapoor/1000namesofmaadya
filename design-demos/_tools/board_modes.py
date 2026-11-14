from PIL import Image, ImageDraw, ImageFont
import os

W, H = 700, 438          # 1440x900 scaled to half
GAP = 22
MARGIN = 36
TOP = 92
LABEL_H = 70
BG = (22, 20, 18)
FG = (232, 226, 214)

panels = [
    ('review/mode-day-name.png', '01', 'Day', 'paper, ink, cinnabar — the printed page'),
    ('review/mode-night-name.png', '02', 'Night', 'warm ink-black, lighter cinnabar — lamplight'),
]
Wtot = MARGIN * 2 + W * 2 + GAP
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


f_title = font(['georgia.ttf', 'segoeui.ttf', 'arial.ttf'], 26)
f_meta = font(['segoeui.ttf', 'arial.ttf'], 14)
f_num = font(['segoeui.ttf', 'arial.ttf'], 13)
f_lab = font(['georgia.ttf', 'segoeui.ttf'], 22)
f_sub = font(['segoeui.ttf', 'arial.ttf'], 13)

d.text((MARGIN, 28), 'Night reading — the same book, after dark', font=f_title, fill=FG)
d.text((MARGIN, 62), 'tokens switch, geometry does not · contrast measured ≥4.5:1 for all active text',
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
    d.text((x + 28, y - 5), label, font=f_lab, fill=FG)
    d.text((x + 28, y + 24), sub, font=f_sub, fill=(150, 143, 130))

board.save('review/day-night-board.png')
print('saved review/day-night-board.png', board.size)
