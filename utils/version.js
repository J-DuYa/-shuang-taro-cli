const fs = require('fs');

const CURRENT_PATH = process.cwd();

/* 获取 cli 版本 */
const getVersion = async () => {
  const BUFFER_FILE = await fs.readFileSync(CURRENT_PATH + '/package.json');
  const PROGRAM = JSON.parse(BUFFER_FILE.toString())
  return PROGRAM.version;
}

module.exports = {
  getVersion,
}