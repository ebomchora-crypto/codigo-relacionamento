const { chromium } = require('playwright'); const path=require('path');
const dir=__dirname;
const html=(W,H,top,sceneH)=>`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:PF;font-weight:600;src:url(file://${dir}/fonts/pf600.ttf)}
@font-face{font-family:PF;font-weight:700;src:url(file://${dir}/fonts/pf700.ttf)}
@font-face{font-family:IN;font-weight:700;src:url(file://${dir}/fonts/inter700.ttf)}
*{margin:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:#09090B;position:relative;overflow:hidden;font-family:IN}
.glow{position:absolute;left:50%;top:${top+120}px;width:1300px;height:1300px;transform:translate(-50%,-50%);background:radial-gradient(closest-side,rgba(198,161,91,.22),transparent)}
.scene{position:absolute;left:0;bottom:0;width:${W}px;height:${sceneH}px;background:url(file://${dir}/scene.jpg) center/cover;
 -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 38%)}
.txt{position:absolute;left:0;right:0;top:${top}px;text-align:center;padding:0 80px}
.eyebrow{color:#C6A15B;font-weight:700;font-size:28px;letter-spacing:.24em;text-transform:uppercase}
.line{width:90px;height:3px;background:linear-gradient(90deg,#C6A15B,#E4C990,#C6A15B);margin:30px auto 0}
h1{font-family:PF;font-weight:700;color:#F7F4EF;font-size:${W>1080||H>1400?132:118}px;line-height:1.06;margin-top:34px}
h1 em{font-style:normal;color:#E4C990}
p{color:#D8D3C8;font-size:36px;font-weight:700;line-height:1.35;margin:36px auto 0;max-width:820px}
.pill{position:absolute;left:50%;bottom:${H>1400?300:70}px;transform:translateX(-50%);white-space:nowrap;background:linear-gradient(135deg,#C6A15B,#E4C990 50%,#C6A15B);color:#17120a;font-weight:700;font-size:36px;padding:26px 54px;border-radius:999px;box-shadow:0 14px 50px rgba(198,161,91,.45)}
</style><div class=glow></div><div class=scene></div>
<div class=txt><div class=eyebrow>Análise de comunicação afetiva</div><div class=line></div>
<h1>Visualizou.<br><em>E nada.</em></h1>
<p>Antes de mandar outra mensagem, faça esta análise gratuita.</p></div>
<div class=pill>8 perguntas · sem cadastro</div>`;
(async()=>{const b=await chromium.launch();
 for(const [name,W,H,top,sh] of [['criativo-imagem-4x5',1080,1350,120,640],['criativo-imagem-9x16',1080,1920,300,820]]){
  const p=await b.newPage({viewport:{width:W,height:H}}); require('fs').writeFileSync(dir+'/p.html',html(W,H,top,sh)); await p.goto('file://'+dir+'/p.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(800);
  await p.screenshot({path:`${dir}/${name}.png`}); console.log(name);}
 await b.close();})();
