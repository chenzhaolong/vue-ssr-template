/**
 * @file 环境配置文件
 */

module.exports = {
  client: {
    domain: {
      test: '',
      prod: '',
    },
    respond: {
      body: 'data',
      code: 'code',
      msg: 'message',
    },
    validCode: [200, 0],
    timeout: 3000,
  },

  server: {
    port: {
      development: 8001,
      production: 8011,
    },
    apiPrefix: '',
    ssr: true,
    proxy: {
      host: '',
      apiPrefix: '',
      timeout: 5000,
    },
  },

  mysql: {
    open: false,
    host: '',
    user: '',
    password: '',
    database: '',
  },

  redis: {},
};
