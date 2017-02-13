import inquirer from 'inquirer';
import {listTags} from './docker';
import deployTag from './deploy';
import {error, success, info} from './console';

async function deploy() {
  const tags = await listTags();
  const tagInts = tags.filter(t => t !== 'latest').map(t => parseInt(t, 10));
  // Annoyingly `.sort` is mutational
  tagInts.sort((a, b) => b - a);
  const tagStrings = tagInts.map(String)


  const tagsQ = {
    type: 'list',
    name: 'tag',
    message: 'Which tag would you like to deploy:',
    choices: tagStrings
  };

  const {tag} = await inquirer.prompt(tagsQ);

  info(`Deploying build: ${tag} of wellcomecollection.org to prod…`);
  const deployInfo = await deployTag(tag);
  success(`Deployed service: ${tag} of wellcomecollection.org to prod in ${deployInfo.deployedIn/1000} seconds`);
}

try {
  deploy();
} catch(e) {
  error('Airbag exploded: Application not deployed.');
  error(e);
}
