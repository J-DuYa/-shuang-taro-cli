module.exports = {
  msg_types: [
    { name: 'feature', value: 'feature', desciption: '新增新功能' },
    { name: 'fix', value: 'fix', desciption: '修复缺陷' },
    { name: 'docs', value: 'docs', desciption: '仅仅修改了文档' },
    { name: 'style', value: 'style', desciption: '格式代码或者文档，不影响功能<影响的功能单独提出来>' },
    { name: 'refactor', value: 'refactor', desciption: '代码重构' },
    { name: 'perf', value: 'perf', desciption: '优化相关' },
    { name: 'test', value: 'test', desciption: '增加测试代码和模版' },
    { name: 'chore', value: 'chore', desciption: '构建过程或辅助工具的变动' },
  ],
};