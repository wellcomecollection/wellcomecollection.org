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

  exec(`./deploy.sh ${tag}`, (err, stdout) => {
    if (err) {
      console.error('There was an error deploying, please make sure you check that the AWS setup is not mangled.');
    }
    else {
      const deployedIn = Date.now() - deployStart;
      console.info(`Deployed build: ${buildNumber} of wellcomecollection.org to prod in ${deployedIn/100} seconds`);
    }
  });
}

deploy();
