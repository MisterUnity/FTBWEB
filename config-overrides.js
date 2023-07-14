const path = require('path');
module.exports = function override(config, env){
  // 參數中的config 就是預設的 webpack config
  // 對config 進行修改
  config.resolve.alias = {
    '@': path.join(__dirname, '.', 'src')
  };
  return config;
}