# Criativo em motion (3D low-poly) — O Código do Silêncio

Vídeo 9:16 de 32 s renderizado por código (Three.js + Chromium headless + ffmpeg).
Resultado pronto: `out/criativo-codigo-do-silencio-9x16.mp4` (1080x1920, 30 fps, com áudio).

## Como re-renderizar
```bash
cd creatives/motion && npm i                     # three
pip install piper-tts numpy                      # narração pt-BR (voz baixada de rhasspy/piper-voices, pt_BR-faber-medium)
python3 build_voice.py                           # narração + timeline.json (edite LINES para mudar o roteiro)
(cd ../.. && python3 -m http.server 8765 &)      # servidor na raiz do repositório
for i in 0 1 2 3; do node render.js video frames 1080 1920 30 $i 4 & done; wait
python3 audio.py                                 # mixa narração + efeitos + trilha
ffmpeg -framerate 30 -i frames/f%05d.jpg -i audio_mix.wav -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac out/criativo.mp4
```
- `scene.js`: cena 3D e linha do tempo (etiquetas, títulos, adereços). Tudo é função do tempo.
- Para trocar a narração por uma voz humana/ElevenLabs, gere o áudio das mesmas frases e
  substitua `voice/vo_full.wav` mantendo os tempos de `timeline.json` (ou refaça `timeline.json`).
