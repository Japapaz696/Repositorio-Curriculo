const fs=require('node:fs');
const path=require('node:path');
const {findPlaywright,staticServer,listen}=require('./capture.cjs');
const root=path.resolve(__dirname,'../..'),out=path.resolve(__dirname,'..');
async function main(){
 const browser=await findPlaywright().chromium.launch({headless:true});const records=fs.existsSync(path.join(out,'reports/extra-captures.json'))?JSON.parse(fs.readFileSync(path.join(out,'reports/extra-captures.json'),'utf8')):[];const servers=[];
 const cases=[
  {name:'veronica-agendamento-desktop',dir:path.join(root,'Site-veronica'),pathname:'/agendamento.html',kind:'local static scheduling form; no backend or submission'},
  {name:'ai-creative-lab-desktop',url:'https://japapaz696.github.io/Repositorio-Curriculo/',selector:'#lab',kind:'public visual studies in the portfolio'},
  {name:'lucas-dev-configurador-desktop',dir:path.join(root,'Lucas'),selector:'#orcamento',kind:'local front-end configurator'},
  {name:'lucas-ai-simulacao-desktop',dir:path.join(root,'IA-Automa-es-'),selector:'#demonstracao',kind:'local simulated conversations; no AI API'}
 ];
 try{
  for(const c of cases){
   if(fs.existsSync(path.join(out,'screenshots',c.name+'.png')) && !process.argv.includes('--refresh'))continue;
   const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   let url=c.url;if(c.dir){const server=staticServer(c.dir);servers.push(server);url=(await listen(server))+(c.pathname||'');}
   const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
   await page.evaluate(()=>document.fonts.ready).catch(()=>{});
   for(let y=0;y<Math.min(await page.evaluate(()=>document.body.scrollHeight),15000);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(90);}
   const target=c.selector?page.locator(c.selector):(c.find?page.locator('section').filter({has:page.getByRole('heading',{name:c.find})}).first():null);
   if(target){if(await target.count()!==1)throw Error(`Seção não encontrada: ${c.name}`);await target.scrollIntoViewIfNeeded();}else await page.evaluate(()=>scrollTo(0,0));
   await page.waitForTimeout(800);await page.screenshot({path:path.join(out,'screenshots',c.name+'.png')});
   records.push({file:`screenshots/${c.name}.png`,url,kind:c.kind,status:response.status(),errors});await context.close();
  }
 }finally{await browser.close();for(const s of servers)await new Promise(resolve=>s.close(resolve));fs.writeFileSync(path.join(out,'reports/extra-captures.json'),JSON.stringify(records,null,2));}
 console.log(JSON.stringify({captures:records.length,records}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
