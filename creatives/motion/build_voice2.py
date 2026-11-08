"""Usa a narração real (ElevenLabs, voz Yuri): remove os números lidos em voz alta,
reposiciona as 9 frases e recalcula timeline.json com o tempo de cada palavra."""
import json, re, subprocess, wave, difflib, unicodedata
import numpy as np

SRC = "voice2/yuri.mp3"
SR = 44100
# faixas (s) de cada frase no arquivo original, já sem o número falado antes dela
RANGES = [(0.838, 2.2266), (3.577, 6.144), (7.4294, 11.0693), (12.3566, 15.3081), (16.5461, 20.8049),
          (21.9993, 26.2912), (27.4521, 31.6533), (32.6086, 35.819), (36.7396, 39.079)]
SCRIPT = [
    "Visualizou e *não respondeu?*",
    "Você manda outra mensagem. E mais outra.",
    "Só que quanto mais você corre atrás, mais o *silêncio* pesa.",
    "Primeiro: *respire.* Não envie nada agora.",
    "Segundo: *entenda o sinal.* Nem todo silêncio é falta de interesse.",
    "Terceiro: *comunique sem carência.* Uma mensagem clara e calma.",
    "Quarto: veja a *reciprocidade.* O esforço precisa ser dos dois.",
    "Descubra seu padrão de comunicação em *oito perguntas* rápidas.",
    "Faça a *análise gratuita.* Sem cadastro.",
]
GAPS = [0.45, 0.40, 0.50, 0.50, 0.50, 0.50, 0.55, 0.45, 0.90]
START = 0.35

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", SRC, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(raw, dtype=np.float32)
words = json.load(open("voice2/words.json"))

NUM = {"1": "um", "2": "dois", "3": "tres", "4": "quatro", "5": "cinco", "6": "seis", "7": "sete", "8": "oito", "9": "nove"}
def norm(w):
    w = unicodedata.normalize("NFD", w.lower()); w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    w = re.sub(r"[^a-z0-9]", "", w); return NUM.get(w, w)

def align(script_words, heard):
    """tempo (relativo) de cada palavra do roteiro, alinhando com o que o Whisper ouviu."""
    a = [norm(w) for w in script_words]; b = [norm(h["w"]) for h in heard]
    times = [None] * len(a)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size): times[blk.a + k] = (heard[blk.b + k]["t0"], heard[blk.b + k]["t1"])
    # interpola o que não casou
    for i, t in enumerate(times):
        if t is None:
            l = next((j for j in range(i - 1, -1, -1) if times[j]), None); r = next((j for j in range(i + 1, len(a)) if times[j]), None)
            lo = times[l][1] if l is not None else heard[0]["t0"]; hi = times[r][0] if r is not None else heard[-1]["t1"]
            n_gap = (r if r is not None else len(a)) - (l if l is not None else -1) - 1; pos = i - (l if l is not None else -1) - 1
            step = (hi - lo) / max(1, n_gap); times[i] = (lo + step * pos, lo + step * (pos + 1))
    return times

def fade(x, n=int(0.012 * SR)):
    x = x.copy(); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n); return x

timeline = {"lines": [], "sr": SR}; chunks = [np.zeros(int(START * SR), np.float32)]; t = START
for i, ((a0, a1), text, gap) in enumerate(zip(RANGES, SCRIPT, GAPS)):
    seg = fade(audio[int(a0 * SR): int(a1 * SR)]); dur = len(seg) / SR
    heard = [dict(w=w["w"], t0=w["t0"] - a0, t1=w["t1"] - a0) for w in words if a0 - 0.3 <= w["t0"] < a1 and not (w["t0"] < a0 - 0.02 and norm(w["w"]) in NUM.values())]
    toks = text.split(); inside = False; items = []
    for tk in toks:
        if tk.startswith("*"): inside = True
        items.append((tk.replace("*", ""), inside))
        if tk.rstrip(".,?!:;").endswith("*"): inside = False
    times = align([w for w, _ in items], heard)
    wl = [{"w": w, "t0": round(max(0, a), 3), "t1": round(min(dur, max(b, a + 0.08)), 3), "hi": hi} for (w, hi), (a, b) in zip(items, times)]
    timeline["lines"].append({"i": i, "t0": round(t, 3), "dur": round(dur, 3), "words": wl, "text": text.replace("*", "")})
    chunks += [seg, np.zeros(int(gap * SR), np.float32)]; t += dur + gap
timeline["total"] = round(t + 0.4, 3)
full = np.concatenate(chunks + [np.zeros(int(0.4 * SR), np.float32)])
pcm = (np.clip(full / (np.abs(full).max() + 1e-9) * 0.95, -1, 1) * 32767).astype(np.int16)
with wave.open("voice2/vo_full.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
json.dump(timeline, open("timeline.json", "w"), ensure_ascii=False, indent=1)
for l in timeline["lines"]: print(l["i"], l["t0"], l["dur"], " ".join(f"{w['w']}@{w['t0']}" for w in l["words"]))
print("TOTAL", timeline["total"])
