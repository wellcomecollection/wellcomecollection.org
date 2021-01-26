module.exports = {
  apps:
    process.env.NODE_ENV === 'production'
      ? [
          {
            name: 'server',
            script: 'lib/index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '2G',
            env_production: {
              NODE_ENV: 'production',
            },
          },
        ]
      : [
          {
            name: 'server',
            script: 'lib/index.js',
            instances: 1,
            autorestart: true,
            watch: ['lib'],
            watch_options: {
              ignored: 'frontend/admin/build/**',
              awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100,
              },
            },
            node_args: '--expose-gc --inspect=0.0.0.0:9229',
            max_memory_restart: '2G',
            env: {
              NODE_ENV: process.env.NODE_ENV,
            },
            env_production: {
              NODE_ENV: 'production',
            },
          },
        ],
};
