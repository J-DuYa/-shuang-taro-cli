const { hasPackage } = require('@utils/utils');
const log = require('@logger');

module.exports = async ({ type, name }) => {
  const isRoot = await hasPackage();
  if (!isRoot) return log.warning('😢 抱歉，需要在项目的根目录运行\n');

  switch (type) {
    case 'page':
      require('./scripts/page')(name);
      break;
    case 'component':
      require('./scripts/component')(name);
      break;  
    default:
      log.warning('此类类型暂时不支持');
  }
}