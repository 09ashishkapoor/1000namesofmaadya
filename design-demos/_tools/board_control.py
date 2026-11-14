from PIL import Image, ImageDraw, ImageFont
import os

# right end of the running head, both modes
box = (1240, 8, 1408, 52)
day = Image.open('review/range-header-day.png').convert('RGB').crop(box)
night = Image.open('review/range-header-night.png').convert('RGB').crop(box)

SCALE = 3
w = (box[2] - box[0]) * SCALE
h = (box[3] - box[1]) * SCALE
day = day.resize((w, h), Image.LANCZOS)
night = night.resize((w, h), Image.LANCZOS)

LABEL = 30
MARGIN = 18
W = w + MARGIN * 2
H = MARGIN * 2 + h * 2 + LABEL * 2 + 10
board = Image.new('RGB', (W, H), (22, 20, 18))
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


f_lab = font(['segoeui.ttf', 'arial.ttf'], 14)

y = MARGIN
for img, label in [(day, 'DAY  ·  hollow dot, "Night"'), (night, 'NIGHT  ·  filled dot, "Day"')]:
    board.paste(img, (MARGIN, y))
    d.text((MARGIN, y + h + 6), label, font=f_lab, fill=(170, 160, 146))
    y += h + LABEL

board.save('review/theme-control.png')
print('saved review/theme-control.png', board.size)
