const fs = require('fs');
const cwd = process.cwd();

module.exports = {
  /* 去除空格 */
  getSpaceAndTrim (name) {

    if (typeof name !== 'string') {
      error('非字符串不能解析');
      process.exit(0);
    }
  
    // 处理前后空格
    return name ? name.trim() : null;
  },

  /* 判断当前目录是否是根目录 */
  async hasPackage () {
    const dirs = await fs.readdirSync(cwd);
    // console.log('当前目录文件', dirs);
    return dirs.includes('package.json')
  },

  /* 首字母大写 */
  firstToUpper (str) {
    return str.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
      return $1.toUpperCase() + $2.toLowerCase();
    });
  }
}