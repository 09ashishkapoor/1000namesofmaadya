p = 'dir-1.html'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:70])
        return
    s = s.replace(old, new, 1)


sub("""      const a0 = (i / TOTAL_SETS) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 1) / TOTAL_SETS) * Math.PI * 2 - Math.PI / 2;""",
    """      const a0 = ((i - 0.5) / TOTAL_SETS) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 0.5) / TOTAL_SETS) * Math.PI * 2 - Math.PI / 2;""")

# quiet inner guide rings
sub("""    for (let i = 0; i < 8; i++){
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;""",
    """    [[182, .13], [150, .09]].forEach(([r, a]) => {
      const c2 = document.createElementNS(ns, 'circle');
      c2.setAttribute('cx', c); c2.setAttribute('cy', c);
      c2.setAttribute('r', r);
      c2.setAttribute('fill', 'none');
      c2.setAttribute('stroke', 'rgba(201,162,39,' + a + ')');
      svg.appendChild(c2);
    });
    for (let i = 0; i < 8; i++){
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;""")

open(p, 'w', encoding='utf-8').write(s)
print('ok')
