const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('C:/Users/Lucas/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const out=path.resolve(__dirname,'..');
const temporary=path.join(process.env.TEMP,'linkedin-supportflow-audit-20261005-91c8a1');
async function main(){
 const seed=fs.readFileSync(path.join(temporary,'audit-seed.mjs'),'utf8');
 const password=seed.match(/const\s+password\s*=\s*['"]([^'"]+)['"]/i)?.[1];
 if(!password)throw Error('Credencial fictícia do seed isolado indisponível.');
 const browser=await chromium.launch({headless:true});const records=[];
 try{
  for(const mode of ['desktop','mobile']){
   const context=await browser.newContext({viewport:mode==='desktop'?{width:1440,height:960}:{width:390,height:844},deviceScaleFactor:mode==='desktop'?1:2,reducedMotion:'reduce'});
   await context.route('**/*',route=>{const u=new URL(route.request().url());return ['127.0.0.1','localhost'].includes(u.hostname)?route.continue():route.abort();});
   const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:5179',{waitUntil:'networkidle'});
   await page.getByLabel('E-mail',{exact:true}).fill('gestor@example.test');
   await page.getByLabel('Senha',{exact:true}).fill(password);
   await page.getByRole('button',{name:'Entrar',exact:true}).click();
   await page.getByRole('button',{name:'Dashboard',exact:true}).waitFor();
   await page.getByText('Carregando').waitFor({state:'hidden',timeout:10000}).catch(()=>{});
   await page.waitForTimeout(1000);
   const save=async(name,fullPage=false)=>{
    await page.waitForTimeout(300);
    await page.screenshot({path:path.join(out,'screenshots',`${name}.png`),fullPage});
    const layout=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
    records.push({file:`screenshots/${name}.png`,mode,url:page.url(),source:'real local app with isolated PostgreSQL and synthetic data',errors:[...errors],...layout});
   };
   await save(`supportflow-dashboard-${mode}`);
   await save(`supportflow-home-${mode}`);
   await page.getByRole('button',{name:'Chamados',exact:true}).click();
   await page.getByRole('button',{name:'Novo chamado',exact:true}).waitFor();
   await save(`supportflow-chamados-${mode}`,true);
   if(mode==='desktop'){
    await page.locator('button.ticket-card').filter({hasText:'Erro 500 na integração de pedidos'}).click();
    await page.getByRole('heading',{name:/Diagnóstico Técnico/i}).waitFor();
    await save('supportflow-detalhe-desktop',true);
   }
   await context.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(out,'reports/supportflow-captures.json'),JSON.stringify({syntheticData:true,mockedResponses:false,records},null,2));
 console.log(JSON.stringify({captures:records.length,errors:records.flatMap(r=>r.errors),overflow:records.filter(r=>r.scrollWidth>r.viewport).map(r=>r.file)}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
