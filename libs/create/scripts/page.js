const log = require('@logger');
const fs = require('fs');
const cwd = process.cwd();
const inquirer = require('inquirer');
const execa = require('execa');
const Listr = require('listr');
const { firstToUpper } = require('@utils/utils');

module.exports = async name => { 
  /* index.tsx */
  const indexFile = `import { View } from '@tarojs/components';
import { inject, observer } from 'mobx-react';
import type { ${name}Props } from './index.d';
import './index.scss';

const ${firstToUpper(name)} = (props: ${name}Props) => {
  return (
    <View className='${name}'>
      ${name} Clone 代码成功
    </View>
  );
}

export default inject('store')(observer(${firstToUpper(name)}));
  `;
  

  /* index.d.ts */
  const indexDFile = `export interface ${name}Props {
  [propName: string]: any;\n}\n`;

  /* index.scss */
  const indexScssFile = `/*------------------------------*\
  TODO
*-------------------------------*/
  `;

  /* index.confis.ts */
  const indexConfigFile = `export default {
  navigationBarTitleText: '${name}',
  backgroundColor: '#f5f5f5',
  allowsBounceVertical: false,\n}\n
  `;

  const Task = [
    { toFile: 'index.tsx', fromFile: indexFile },
    { toFile: 'index.d.ts', fromFile: indexDFile },
    { toFile: 'index.scss', fromFile: indexScssFile },
    { toFile: 'index.config.ts', fromFile: indexConfigFile }
  ];

  function executor () {
    return new Promise(async (resolve, reject) => {
      try {
        await fs.mkdirSync(cwd + `/src/pages/${name}`);
        
        const tasks = new Listr([
          {
            title: '生成 Page 相关模块代码',
            task: () => new Listr(
              Task.map(t => ({
                title: `创建界面: ${cwd}/src/pages/${name}/${t.toFile}`,
                task: () => fs.writeFileSync(`${cwd}/src/pages/${name}/${t.toFile}`, t.fromFile, { encoding: 'utf-8' })
              })), { concurrent: true }),
          }, {
            title: '修改 app.config.ts 文件\n',
            task: async () => {
              await execa(`tsc`, [`${cwd}/src/app.config.ts`], { cwd: process.cwd() });
              const data = await import(`${cwd}/src/app.config.js`);

              if (!data.default.default.pages.includes(`pages/${name}/index`)) {
                data.default.default.pages.push(`pages/${name}/index`);
                await fs.writeFileSync(`${cwd}/src/app.config.ts`, `export default ${JSON.stringify(data.default.default, null, 2)}`, { encoding: 'utf8' });
              };

              await execa('rm', ['-rf', `${cwd}/src/app.config.js`]);
              resolve();
            },
          }
        ]);

        tasks.run().catch(error => log.error(error));
      } catch (e) {
        reject(e);
      }
    });
  }

  try { await executor(); } catch (e) {
    if (e.message.includes('file already exists')) {
      const { isDelete } = await inquirer.prompt([{
        type: 'list',
        message: `界面已存在，是否删除界面 ${name} ?`,
        name: 'isDelete',
        choices: ['Yes', 'No']
      }]);

      if (isDelete) {
        const ErrorTasks = new Listr([
          {
            title: `删除 page ${name} 相关模块代码`,
            task: () => execa('rm', ['-rf', `src/pages/${name}`]),
          },
          {
            title: '修改 app.config.ts 文件\n',
            task: async () => {
              await execa(`tsc`, [`${cwd}/src/app.config.ts`], { cwd: process.cwd() })
              const data = await import(`${cwd}/src/app.config.js`);

              if (data.default.default.pages.includes(`pages/${name}/index`)) {
                data.default.default.pages.splice(data.default.default.pages.indexOf(`pages/${name}/index`), 1);
                await fs.writeFileSync(`${cwd}/src/app.config.ts`, `export default ${JSON.stringify(data.default.default, null, 2)}`, { encoding: 'utf8' });
              };

              await execa('rm', ['-rf', `${cwd}/src/app.config.js`]);
            }
          },
        ]);

        ErrorTasks.run().catch(error => log.error('删除 page 相关配置文件失败'));
      }
    } else {
      log.error(e);
    }
  }
}