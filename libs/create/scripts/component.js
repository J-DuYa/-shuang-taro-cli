// const log = require('@logger');
// const fs = require('fs');
// const cwd = process.cwd();
// const inquirer = require('inquirer');
// const execa = require('execa');
// const { firstToUpper } = require('@utils/utils');

// module.exports = async name => {
//   const commponetsPath = `/src/components/${firstToUpper(name)}`;

//    /* index.tsx */
//   const indexFile = `import { View } from '@tarojs/components';
// import type { ${name}Props } from './index.d';
// import './index.scss';

// const ${firstToUpper(name)} = (props: ${name}Props) => {
//   return (
//     <View className='${name}'>
//       ${name} Clone 代码成功
//     </View>
//   );
// }

// export default ${firstToUpper(name)};
//   `;

//   /* index.d.ts */
//   const indexDFile = `export interface ${name}Props {
//   [propName: string]: any;\n}\n`;

//   /* index.scss */
//   const indexScssFile = `/*------------------------------*\
//   TODO
// *-------------------------------*/
//   `;

//   const Task = [
//     { toFile: 'index.tsx', fromFile: indexFile },
//     { toFile: 'index.d.ts', fromFile: indexDFile },
//     { toFile: 'index.scss', fromFile: indexScssFile },
//   ];

//   function executor () {
//     return new Promise(async (resolve, reject) => {
//       try {
//         await fs.mkdirSync(cwd + commponetsPath);
    
//         await Task.map(async job => {
//           const path = cwd + `${commponetsPath}/${job.toFile}`;
//           await fs.writeFileSync(path, job.fromFile, { encoding: 'utf8' });
//           log.info(`✔ 创建文件: ${path}`);
//         });

//         log.info(`\nclone ${name} to ${cwd + commponetsPath} success\n`);
        
//         resolve();
//       } catch (e) {
//         reject(e);
//       }
//     });
//   }

//   try { await executor(); } catch (e) {
//     if (e.message.includes('file already exists')) {
//       const { isDelete } = await inquirer.prompt([{
//         type: 'list',
//         message: `文件夹已存在，是否删除文件夹 ${name} ?`,
//         name: 'isDelete',
//         choices: ['Yes', 'No']
//       }]);

//       if (isDelete) { await execa('rm', ['-rf', commponetsPath]); }

//       log.info('');
//     } else {
//       log.error(e);
//     }
//   }
  
// }

const log = require('@logger');
const fs = require('fs');
const cwd = process.cwd();
const inquirer = require('inquirer');
const execa = require('execa');
const Listr = require('listr');
const { firstToUpper } = require('@utils/utils');

module.exports = async name => { 
  const commponetsPath = `/src/components/${firstToUpper(name)}`;

  /* index.tsx */
  const indexFile = `import { View } from '@tarojs/components';
  import type { ${name}Props } from './index.d';
  import './index.scss';

  const ${firstToUpper(name)} = (props: ${name}Props) => {
    return (
      <View className='${name}'>
        ${name} Clone 代码成功
      </View>
    );
  }

  export default ${firstToUpper(name)};
    `;

    /* index.d.ts */
    const indexDFile = `export interface ${name}Props {
    [propName: string]: any;\n}\n`;

    /* index.scss */
    const indexScssFile = `/*------------------------------*\
    TODO
  *-------------------------------*/
    `;

  const Task = [
    { toFile: 'index.tsx', fromFile: indexFile },
    { toFile: 'index.d.ts', fromFile: indexDFile },
    { toFile: 'index.scss', fromFile: indexScssFile },
  ];

  function executor () {
    return new Promise(async (resolve, reject) => {
      try {
        await fs.mkdirSync(cwd + `/src/components/${firstToUpper(name)}`);
        
        const tasks = new Listr([
          {
            title: `生成组件 ${firstToUpper(name)} 相关模块代码\n`,
            task: () => new Listr(
              Task.map(t => ({
                title: `创建组件: ${cwd}/src/components/${firstToUpper(name)}/${t.toFile}`,
                task: () => fs.writeFileSync(`${cwd}/src/components/${firstToUpper(name)}/${t.toFile}`, t.fromFile, { encoding: 'utf-8' })
              })), { concurrent: true }),
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
        message: `组件已存在，是否删除组件 ${firstToUpper(name)} ?`,
        name: 'isDelete',
        choices: ['Yes', 'No']
      }]);

      if (isDelete) {
        const ErrorTasks = new Listr([
          {
            title: `删除 Component ${firstToUpper(name)} 相关模块代码\n`,
            task: async () => execa('rm', ['-rf', cwd + commponetsPath]),
          },
        ]);

        ErrorTasks.run().catch(error => log.error('删除 Component 相关配置文件失败'));
      }
    } else {
      log.error(e);
    }
  }
}