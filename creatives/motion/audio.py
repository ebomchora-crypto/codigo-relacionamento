"""Mixagem: narração (Piper) + SFX sincronizados com a cena + trilha sintetizada."""
import json, re, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json"))
L = [l["t0"] for l in tl["lines"]]
TOTAL = tl["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(3)

# ---------- narração ----------
with wave.open("voice2/vo_full.wav") as w:
    vsr = w.getframerate()
    vo_in = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
vo = vo_in if vsr == SR else np.interp(np.arange(int(len(vo_in) / vsr * SR)) / SR, np.arange(len(vo_in)) / vsr, vo_in).astype(np.float32)
vo = vo / (np.abs(vo).max() + 1e-9) * 0.9
VO = np.zeros(N, np.float32); VO[: len(vo)] = vo[: N]

def place(buf, sig, t, gain=1.0):
    i = int(t * SR)
    if i < 0 or i >= len(buf): return
    j = min(len(buf), i + len(sig)); buf[i:j] += sig[: j - i] * gain

def env(n, a=0.005, d=0.1):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)

def pop(f0=620, f1=980, dur=0.1):
    n = int(dur * SR); t = np.arange(n) / SR; f = f0 + (f1 - f0) * (t / dur)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.003, 0.035)).astype(np.float32)

def ding(f=1318.5, dur=0.9):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.01 * t) + 0.2 * np.sin(2 * np.pi * f * 3.02 * t)
    return (s * env(n, 0.004, 0.28) * 0.5).astype(np.float32)

def whoosh(dur=0.45, lo=300, hi=3000):
    n = int(dur * SR); noise = rng.standard_normal(n).astype(np.float32)
    spec = np.fft.rfft(noise); fr = np.fft.rfftfreq(n, 1 / SR)
    center = lo + (hi - lo) * np.linspace(0, 1, len(fr)) * 0  # placeholder
    band = np.exp(-((np.log(fr + 1) - np.log(900)) ** 2) / 0.9)
    s = np.fft.irfft(spec * band, n)
    t = np.arange(n) / SR; e = np.sin(np.pi * t / dur) ** 2
    return (s / (np.abs(s).max() + 1e-9) * e * 0.8).astype(np.float32)

def thud(dur=0.22):
    n = int(dur * SR); t = np.arange(n) / SR; f = 130 - 70 * (t / dur)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.07) * 0.9).astype(np.float32)

def sparkle():
    out = np.zeros(int(0.9 * SR), np.float32)
    for k, f in enumerate([1568, 2093, 2637, 3136]):
        place(out, ding(f, 0.5) * 0.5, k * 0.06)
    return out

def burst(dur=0.5):
    n = int(dur * SR); s = rng.standard_normal(n).astype(np.float32)
    return (s * env(n, 0.002, 0.12) * 0.35).astype(np.float32)

SFX = np.zeros(N, np.float32)

# eventos de pílulas/títulos lidos de scene.js (mesmos tempos da cena)
src = open("scene.js").read()
for m in re.finditer(r'^(pill|title)\("[^"]+",\s*(?:"\w+",\s*)?L\[(\d)\]\s*\+\s*([\d.]+)', src, re.M):
    kind, li, off = m.group(1), int(m.group(2)), float(m.group(3))
    t = L[li] + off
    place(SFX, pop(620, 980) if kind == "pill" else pop(440, 760, 0.14), t, 0.55 if kind == "pill" else 0.7)

for off in (0.12, 1.07, 1.72):        # mensagens enviadas
    place(SFX, whoosh(0.5), L[1] + off, 0.55)
    place(SFX, thud(), L[1] + off + 1.0, 0.5)
place(SFX, whoosh(0.6), L[2] + 0.25, 0.5)             # corrida
place(SFX, thud(0.3), L[3] + 0.88, 0.8)               # celular cai
place(SFX, pop(500, 800), L[3] + 0.5, 0.6)            # pausa
place(SFX, ding(1046), L[5] + 1.75, 0.7)              # check
place(SFX, ding(1318), L[4] + 3.15, 0.6)              # sinal verde
place(SFX, ding(1568), L[6] + 2.35, 0.8)              # balança nivela
place(SFX, sparkle(), L[7] + 0.5, 0.8)                # livro
place(SFX, burst(), L[8] + 0.15, 0.9); place(SFX, sparkle(), L[8] + 0.2, 0.7)

# passos durante as caminhadas
def steps(t0, t1, period=0.33, g=0.35):
    t = t0
    while t < t1:
        place(SFX, thud(0.08) * 0.6, t, g); t += period
steps(L[2] + 0.3, L[2] + 2.95, 0.2, 0.3)
for k in (4, 5, 6, 7): steps(L[k], L[k] + 1.3)
steps(L[8] - 0.15, L[8] + 1.3, 0.25, 0.3)

# ---------- trilha (pad + arpejo), mais sombria no início e luminosa depois ----------
def note(f, dur, g=1.0, harm=(1, 0.5, 0.25)):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * (i + 1) * t) for i, a in enumerate(harm))
    e = np.minimum(t / 0.6, 1) * np.minimum((dur - t) / 0.9, 1)
    return (s * np.clip(e, 0, 1) * g).astype(np.float32)
MUS = np.zeros(N, np.float32)
fq = lambda m: 440 * 2 ** ((m - 69) / 12)
chords = [  # (início, dur, notas MIDI)
    (0.0, L[3], [45, 52, 57, 60]),          # Am
    (L[3], 3.4, [48, 55, 60, 64]),          # C
    (L[3] + 3.4, 3.4, [43, 55, 59, 62]),    # G
    (L[3] + 6.8, 3.4, [45, 52, 57, 60]),    # Am
    (L[3] + 10.2, 3.4, [41, 53, 57, 60]),   # F
    (L[3] + 13.6, TOTAL - (L[3] + 13.6), [48, 55, 60, 64, 67]),  # C
]
for t0, d, notes in chords:
    for m in notes: place(MUS, note(fq(m), d + 0.8, 0.16), t0)
    for i in range(int(d / 0.5)):                        # arpejo suave
        place(MUS, note(fq(notes[i % len(notes)] + 12), 0.5, 0.07, (1, 0.3)) * np.hanning(int(0.5 * SR)).astype(np.float32), t0 + i * 0.5)

# ducking da trilha sob a voz
def movavg(x, k):
    c = np.cumsum(np.insert(x, 0, 0.0)); out = (c[k:] - c[:-k]) / k
    pad = len(x) - len(out); return np.concatenate([np.full(pad // 2, out[0]), out, np.full(pad - pad // 2, out[-1])])
amp = np.abs(VO)
envv = np.clip(movavg(amp, int(0.08 * SR)) * 6, 0, 1)
envv = movavg(envv, int(0.25 * SR))
MUS *= (1 - 0.65 * envv)
fade = np.ones(N, np.float32); fade[: int(0.8 * SR)] = np.linspace(0, 1, int(0.8 * SR)); fade[int((TOTAL - 1.2) * SR): int(TOTAL * SR)] = np.linspace(1, 0, int(1.2 * SR)); fade[int(TOTAL * SR):] = 0
MUS *= fade

mix = VO * 1.0 + SFX * 0.55 + MUS * 0.55
mix = mix[: int(TOTAL * SR)]
peak = np.abs(mix).max(); mix = mix / peak * 0.89
pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open("audio_mix.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("ok", len(pcm) / SR, "s; peak before norm", round(float(peak), 2))
