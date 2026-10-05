/* Captura páginas reais em contexto limpo. Não envia formulários nem autentica. */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '../..');
const out = path.resolve(__dirname, '..');
function findPlaywright() {
  if (process.env.LINKEDIN_PLAYWRIGHT_PATH) return require(process.env.LINKEDIN_PLAYWRIGHT_PATH);
  const links = path.join(process.env.LOCALAPPDATA, 'ms-playwright', '.links');
  const candidates = fs.readdirSync(links).map(f => fs.readFileSync(path.join(links, f), 'utf8').trim());
  candidates.sort((a,b) => {
    const version = p => { try { return require(path.join(p,'package.json')).version.split('.').map(Number); } catch { return [0,0,0]; } };
    const av=version(a),bv=version(b); return bv[0]-av[0] || bv[1]-av[1] || bv[2]-av[2];
  });
  for (const p of candidates) { try { const w=require(p); if(fs.existsSync(w.chromium.executablePath())) return w; } catch {} }
  throw new Error('Playwright/Chromium não encontrado. Defina LINKEDIN_PLAYWRIGHT_PATH para playwright ou playwright-core.');
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.woff2':'font/woff2'};
function staticServer(dir) {
  return http.createServer((req,res)=> {
    let relative;try { relative=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname); }catch {res.writeHead(400).end();return;}
    const file=path.resolve(dir,'.'+relative+(relative.endsWith('/')?'index.html':''));
    const inside=file.startsWith(path.resolve(dir)+path.sep);
    const ext=path.extname(file).toLowerCase();
    // Não expor código de backend, .env, armazenamento de dados nem administração.
    const denied=/(^|[\\/])(\.git|\.env[^\\/]*|data|node_modules|backend)([\\/]|$)/i.test(file) || /(?:server\.js|admin\.html)$/.test(file);
    if(!inside || denied || !mime[ext]){res.writeHead(403).end();return;}
    fs.readFile(file,(err,buf)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':mime[ext]});res.end(buf);});
  });
}
async function listen(server){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return `http://127.0.0.1:${server.address().port}`;}
async function main(){
  for(const d of ['banner','projects','screenshots','posts','featured','reports'])fs.mkdirSync(path.join(out,d),{recursive:true});
  const w=findPlaywright();const browser=await w.chromium.launch({headless:true});const records=[];const servers=[];
  const projects=[
    {name:'portfolio',url:'https://japapaz696.github.io/Repositorio-Curriculo/',dir:root},
    {name:'veronica',url:'https://site-veronica.onrender.com',dir:path.join(root,'Site-veronica')},
    {name:'anna',url:'https://japapaz696.github.io/Portfolio-Anna/',dir:path.join(root,'portfolio-anna/Portfolio-Anna')},
    {name:'lucas-dev',dir:path.join(root,'Lucas')},
    {name:'lucas-ai',dir:path.join(root,'IA-Automa-es-')},
    {name:'taskmaster',dir:path.join(root,'01-task-master-ai/frontend/dist')}
  ];
  try{
    for(const p of projects){
      const server=staticServer(p.dir);servers.push(server);const local=await listen(server);
      for(const mode of ['desktop','mobile']){
        const viewport=mode==='desktop'?{width:1440,height:960}:{width:390,height:844};
        const context=await browser.newContext({viewport,deviceScaleFactor:mode==='desktop'?1:2,isMobile:mode==='mobile',hasTouch:mode==='mobile',reducedMotion:'reduce'});
        const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
        let source='local',url=local,status=null,remoteError=null;
        if(p.url){try{const response=await page.goto(p.url,{waitUntil:'domcontentloaded',timeout:60000});status=response?.status();if(status>=400)throw new Error(`HTTP ${status}`);source='public';url=p.url;}catch(e){remoteError=e.message;}}
        if(source==='local'){const response=await page.goto(local,{waitUntil:'domcontentloaded',timeout:30000});status=response?.status();}
        await page.evaluate(()=>document.fonts.ready).catch(()=>{});
        // Aciona o reveal real das páginas, sem substituir conteúdo ou ocultar falhas.
        for(let y=0;y<Math.min(await page.evaluate(()=>document.body.scrollHeight),18000);y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(100);}
        await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(900);
        const title=await page.title();const heading=await page.locator('h1').first().textContent().catch(()=>null);
        const name=`${p.name}-home-${mode}.png`;
        await page.screenshot({path:path.join(out,'screenshots',name),fullPage:false});
        const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,missingImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src'))}));
        records.push({project:p.name,mode,source,url,status,title,heading,file:`screenshots/${name}`,errors,remoteError,...layout});
        if(mode==='desktop')await page.screenshot({path:path.join(out,'screenshots',`${p.name}-full-desktop.png`),fullPage:true});
        console.log(JSON.stringify({project:p.name,mode,source,status,title,errors:errors.length,overflow:layout.scrollWidth>layout.viewport,missingImages:layout.missingImages.length}));
        await context.close();
      }
    }
    const ctx=await browser.newContext({viewport:{width:1440,height:960}});const page=await ctx.newPage();
    let linkedin;
    try{const response=await page.goto('https://www.linkedin.com/in/lucas-santana-da-paz-215816247/',{waitUntil:'domcontentloaded',timeout:40000});linkedin={status:response?.status(),url:page.url(),title:await page.title(),publicText:(await page.locator('body').innerText()).slice(0,10000)};await page.screenshot({path:path.join(out,'reports','linkedin-public-access.png')});}catch(e){linkedin={error:e.message};}
    fs.writeFileSync(path.join(out,'reports','linkedin-access.json'),JSON.stringify(linkedin,null,2));
    fs.writeFileSync(path.join(out,'reports','captures.json'),JSON.stringify({browserVersion:browser.version(),captureDate:new Date().toISOString(),records},null,2));
  }finally{await browser.close();for(const s of servers)await new Promise(resolve=>s.close(resolve));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
