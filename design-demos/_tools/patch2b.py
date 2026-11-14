p = 'dir-2.html'
s = open(p, encoding='utf-8').read()


def sub(old, new):
    global s
    if old not in s:
        print('MISSING:', old[:80].replace('\n', ' | '))
        return
    s = s.replace(old, new, 1)


# real dotted leaders
sub('  .tl .d{flex:1;border-bottom:1px dotted var(--rule-dark);transform:translateY(-3px)}',
    '''  .tl .d{flex:1;height:2px;align-self:center;transform:translateY(-2px);
          background-image:radial-gradient(circle,var(--rule-dark) .9px,transparent 1px);
          background-size:6px 2px;background-repeat:repeat-x}''')

# thumb strip: edge fade so it reads as scrollable
sub('''  .thumbs{display:none}''',
    '''  .thumbs{display:none}
  .thumb-wrap{display:none}''')
sub('''    .thumbs{display:flex;overflow-x:auto;gap:0;border-bottom:1px solid var(--rule);background:#ecdfc4;scrollbar-width:none}''',
    '''    .thumbs{display:flex;overflow-x:auto;gap:0;border-bottom:1px solid var(--rule);background:#ecdfc4;scrollbar-width:none;
            -webkit-overflow-scrolling:touch;mask-image:linear-gradient(90deg,#000 88%,transparent)}''')

open(p, 'w', encoding='utf-8').write(s)
print('patched dir-2 (b)')
