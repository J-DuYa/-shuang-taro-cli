/**
 * 前端 CLI 工程化
 * 1. 本地自定义生成相应文件
*/
require('module-alias/register');
const commander = require('commander');
const { info } = require('@logger');
const { getVersion } = require('@utils/version');
const { program } = commander;

/* 查看 CLI 版本 */  
program
  .command('version')
  .description('当前项目的版本号')
  .action(async () => {
    info(`当前项目的版本号: ${await getVersion()}`);
  })

/* 新建 page */  
program
  .command('create <type> <name>')
  .description('用于创建 page component')
  .action((type, name) => {
    require('@libs/create').call(this, { type, name });
  })

program
  .command('publish')
  .description('git 发布项目到远程仓库')
  .action(() => {
    require('@libs/publish').call(this);
  })

commander
  .version(require('./package.json').version, '-v, -version')
  .parse(process.argv);
