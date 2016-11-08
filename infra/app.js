import inquirer from 'inquirer';
import {exec} from 'child_process';
import {listTags} from './docker';

async function deploy() {
  const tags = await listTags();

  const tagsQ = {
    type: 'list',
    name: 'tag',
    message: 'Which tag would you like to deploy:',
    choices: tags.sort((a, b) => b - a).filter(t => t !== 'latest')
  };

  const {tag} = await inquirer.prompt(tagsQ);

  const deployStart = Date.now();
  console.info(`Deploying build: ${tag} of wellcomecollection.org to prod…`);

  exec(`./deploy.sh ${tag}`, (err, stdout, stderr) => {
    if (err) {
      console.info('\n');
      console.error('\x1b[33m', 'Airbag error: Application not deployed.', '\x1b[0m');
      console.error(err);
    }
    if (stderr) {
      console.info('\n');
      console.error('\x1b[33m', 'Terraform error: Application not deployed, there was a Terraform error.', '\x1b[0m');
      console.error(stderr);
    }
    if (!(err || stderr)) {
      const deployedIn = Date.now() - deployStart;
      console.info('\x1b[32m', `Deployed build: ${tag} of wellcomecollection.org to prod in ${deployedIn/100} seconds`, '\x1b[0m');
    }
  });
}

deploy();
