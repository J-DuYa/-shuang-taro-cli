const { warning } = require('@logger');
const { msg_types } = require('@config/config');
const inquirer = require('inquirer');
const { error } = require('@logger'); 
const execa = require('execa');

/* 发布脚本 */
module.exports = async () => {
  warning('为了广度使用支持发布到 github\n');

  await publishDepository();

};

function publishDepository () {
  return new Promise(async resolve => {
    try {
      let COMMIT_MESSAGE;
      // 缓存代码
      await execa('git', ['add', '.']);

      const { operation, message } = await inquirer.prompt([{
        type: 'list',
        message: '请选择提交类型',
        name: 'operation',
        choices: (msg_types || []).map(({ name, value, desciption }) => ({
          key: value,
          name: `${name} (${desciption})`,
          value
        })),
        default: 'feature'
      }, {
        type: 'input',
        message: '请输入提交内容描述',
        name: 'message'
      }]);

      if (!(message || '').trim()) {
        warning('提交内容描述');
        return false;
      }

      COMMIT_MESSAGE = operation + ': ' + message;

      // 编辑提交信息 暂时写死
      await execa('git', ['commit', '-m', `${COMMIT_MESSAGE || 'feat: 这是脚手架 push 的代码'}`]);

      // 问题是第一次提交不好提交
      const { stderr } = await execa('git', ['push']);

      info(`发布到代码仓库成功\n${stderr}\n`);

      resolve();

    } catch (e) {
      error(`同步代码仓库异常\n${e}`);
      process.exit(0);
    }
  });
}