"""Gera a narração (Piper, pt-BR) frase a frase e a linha do tempo (timeline.json)."""
import json, subprocess, wave, re
import numpy as np

MODEL = "voice/pt_BR-faber-medium.onnx"
# (texto com *destaques*, pausa depois em segundos)
LINES = [
    ("Visualizou e *não respondeu?*", 0.45),
    ("Você manda outra mensagem. E mais outra.", 0.40),
    ("Só que quanto mais você corre atrás, mais o *silêncio* pesa.", 0.55),
    ("Primeiro: *respire.* Não envie nada agora.", 0.50),
    ("Segundo: *entenda o sinal.* Nem todo silêncio é falta de interesse.", 0.50),
    ("Terceiro: *comunique sem carência.* Uma mensagem clara e calma.", 0.50),
    ("Quarto: veja a *reciprocidade.* O esforço precisa ser dos dois.", 0.55),
    ("Descubra seu padrão de comunicação em *oito perguntas* rápidas.", 0.45),
    ("Faça a *análise gratuita.* Sem cadastro.", 0.90),
]
START = 0.35
SR = 22050

def synth(i, text):
    clean = text.replace("*", "")
    out = f"voice/line{i}.wav"
    subprocess.run(["python3", "-m", "piper", "-m", MODEL, "-f", out],
                   input=clean.encode(), check=True, capture_output=True)
    with wave.open(out) as w:
        assert w.getframerate() == SR
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return data

def words_with_timing(text, dur):
    toks = text.split()
    items = []
    for tk in toks:
        hi = tk.startswith("*") or tk.endswith("*") or ("*" in tk)
        items.append((tk.replace("*", ""), hi))
    # destaque se a palavra estiver dentro de um par *...*
    inside = False; flagged = []
    for tk in toks:
        starts = tk.startswith("*"); ends = tk.rstrip(".,?!:;").endswith("*")
        if starts: inside = True
        flagged.append(inside)
        if ends: inside = False
    weights = []
    for (w, _), in zip(items):
        wgt = len(re.sub(r"\W", "", w)) + 2
        if re.search(r"[.,:;?!]$", w): wgt += 3
        weights.append(wgt)
    tot = sum(weights); t = 0.0; out = []
    for (w, _), f, wgt in zip(items, flagged, weights):
        d = dur * wgt / tot
        out.append({"w": w, "t0": round(t, 3), "t1": round(t + d, 3), "hi": f})
        t += d
    return out

timeline = {"lines": [], "sr": SR}
chunks = [np.zeros(int(START * SR), dtype=np.int16)]
t = START
for i, (text, gap) in enumerate(LINES):
    data = synth(i, text)
    dur = len(data) / SR
    timeline["lines"].append({"i": i, "t0": round(t, 3), "dur": round(dur, 3),
                              "words": words_with_timing(text, dur), "text": text.replace("*", "")})
    chunks.append(data); chunks.append(np.zeros(int(gap * SR), dtype=np.int16))
    t += dur + gap
timeline["total"] = round(t + 0.4, 3)
full = np.concatenate(chunks + [np.zeros(int(0.4 * SR), dtype=np.int16)])
with wave.open("voice/vo_full.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(full.tobytes())
json.dump(timeline, open("timeline.json", "w"), ensure_ascii=False, indent=1)
for l in timeline["lines"]:
    print(l["i"], l["t0"], l["dur"], l["text"])
print("TOTAL", timeline["total"])
