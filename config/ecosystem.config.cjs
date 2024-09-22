/**
 * pm2 클러스터링 설정
 */
module.exports = {
  apps: [
    {
      name: 'sparta-futsal-single',
      script: '../src/app.js',
      instances: 3,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
