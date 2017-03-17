import {exec} from 'child_process';

export default function deployTag(tag) {
  return new Promise((resolve, reject) => {
    const deployStart = Date.now();
    exec(`./deploy.sh ${tag}`, (error, stdout, stderr) => {
      if (error) {
        reject({
          error,
          message: 'Airbag error.js: Application not deployed.'
        });
      }
      if (stderr) {
        reject({
          error: stderr,
          message: 'Terraform error.js: Application not deployed, there was a Terraform error.js.'
        });
      }
      if (!(error || stderr)) {
        const deployedIn = Date.now() - deployStart;
        resolve({
          message: `Deployed service: ${tag} of wellcomecollection.org to prod in ${deployedIn/1000} seconds`,
          deployedIn
        });
      }
    });
  });
}

