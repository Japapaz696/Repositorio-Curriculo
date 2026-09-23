from pathlib import Path
import re

p = Path(__file__).with_name("index.html")
t = p.read_text(encoding="utf-8")
pattern = r'(<a href="https://wa\.me/5531973403545"[^>]*>\s*<span class="contact-icon" aria-hidden="true">)[^<]+(</span>)'
t2, n = re.subn(pattern, r"\1wa\2", t, count=1)
print("replacements", n)
if n:
    p.write_text(t2, encoding="utf-8")
    print("ok")
else:
    i = t.find("wa.me")
    print(repr(t[i:i+350]))
