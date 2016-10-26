module.exports = (ctx, next) => {
  ctx.render = (relPath, templateData) => {
    return new Promise((resolve, reject) => {
      ctx.viewEnv.render(`${relPath}.njk`, templateData, (err, res) => {
        if (err) {
          reject(err);
        } else {
          ctx.body = res;
          resolve(res);
        }
      });

    })
  };

  return next();
}
