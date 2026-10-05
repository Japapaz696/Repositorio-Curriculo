const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { spawn } = require('node:child_process');
const temporary = path.join(process.env.TEMP, 'linkedin-supportflow-audit-20261005-91c8a1');
const output = path.resolve(__dirname, '../reports');
function databaseUrl() {
  const server = fs.readFileSync(path.join(temporary, 'audit-server.mjs'), 'utf8');
  const found = server.match(/postgres(?:ql)?:\/\/[^'"\s]+/);
  if (!found) throw new Error('Não foi possível recuperar a conexão isolada.');
  const url = new URL(found[0]);
  if (url.hostname !== '127.0.0.1' || url.port !== '55439' || !temporary.includes('linkedin-supportflow-audit-')) throw new Error('Conexão fora do ambiente temporário autorizado.');
  return url;
}
async function main(){
  const url=databaseUrl();
  const { Pool }=require(path.join(temporary,'node_modules/pg'));
  const pool=new Pool({connectionString:url.href});
  try {
    const counts=(await pool.query('SELECT (SELECT count(*) FROM users) AS users, (SELECT count(*) FROM tickets) AS tickets, (SELECT count(*) FROM schema_migrations) AS migrations')).rows;
    const users=(await pool.query("SELECT email, role FROM users WHERE email LIKE '%@example.test'")).rows;
    const migrations=(await pool.query('SELECT version, name FROM schema_migrations ORDER BY version')).rows;
    const summary={isolated:true,host:url.hostname,port:Number(url.port),database:url.pathname.slice(1),counts,users,migrations};
    fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'supportflow-isolated-state.json'),JSON.stringify(summary,null,2));
    console.log(JSON.stringify(summary));
    if(process.argv.includes('--tests')){
      const dbName='supportflow_linkedin_verification';
      const exists=(await pool.query('SELECT 1 FROM pg_database WHERE datname = $1',[dbName])).rowCount;
      if(!exists)await pool.query('CREATE DATABASE '+dbName);
      const verificationUrl=new URL(url.href);verificationUrl.pathname='/'+dbName;
      const env={...process.env,DATABASE_URL:verificationUrl.href,TEST_DATABASE_URL:verificationUrl.href,JWT_SECRET:randomBytes(48).toString('hex'),NODE_ENV:'development'};
      // A cópia temporária não contém .env; credenciais originais não são carregadas.
      if(fs.existsSync(path.join(temporary,'.env')))throw Error('Arquivo .env inesperado na cópia isolada.');
      const bin=path.join(temporary,'node_modules/tsx/dist/cli.mjs');
      const run=async(args,name,customEnv=env)=>{
        const lines=[];const child=spawn(process.execPath,args,{cwd:temporary,env:customEnv,stdio:['ignore','pipe','pipe'],windowsHide:true});
        child.stdout.on('data',d=>lines.push(d.toString()));child.stderr.on('data',d=>lines.push(d.toString()));
        const code=await new Promise(resolve=>child.on('close',resolve));
        const text=lines.join('').replace(/postgres(?:ql)?:\/\/[^\s)]+/g,'[conexão local omitida]').replace(/\x1b\[[0-9;]*m/g,'');
        fs.writeFileSync(path.join(output,name),text);console.log(JSON.stringify({check:name,exitCode:code,output:text.slice(-4500)}));return code;
      };
      const migrationCode=await run([bin,'apps/backend/src/database/migrate.ts'],'supportflow-migrations.txt');
      if(migrationCode!==0)throw Error('Falha nas migrations de verificação.');
      const testCode=await run([path.join(temporary,'node_modules/vitest/vitest.mjs'),'run','apps/backend/src','--maxWorkers=1','--no-file-parallelism'],'supportflow-tests.txt',{...env,DATABASE_URL:url.href,NODE_ENV:'test'});
      if(testCode!==0)process.exitCode=1;
      const typecheckCode=await run([path.join(temporary,'node_modules/typescript/bin/tsc'),'-p','apps/backend/tsconfig.json','--noEmit'],'supportflow-backend-typecheck.txt');
      if(typecheckCode!==0)process.exitCode=1;
    }
  } finally {await pool.end();}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
