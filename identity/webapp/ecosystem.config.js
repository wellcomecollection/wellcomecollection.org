module.exports = {
  apps:
    process.env.NODE_ENV === 'production'
      ? [
          {
            name: 'server',
            script: 'src/index.ts',
            interpreter: 'ts-node-transpile-only',
            // See https://github.com/Unitech/pm2/issues/3503
            node_args: ['--require=tsconfig-paths/register'],
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
            script: 'ts-node',
            args: 'src/index.ts',
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
