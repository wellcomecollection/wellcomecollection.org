#!/usr/bin/env node
const exec = require('child_process').exec;
const program = require('commander');
const colors = require('colors');
const fetch = require('isomorphic-unfetch');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();

const services = {
  whats_on: {
    containerUrl: 'https://registry.hub.docker.com/v2/repositories/wellcome/wellcomecollection_whats_on_webapp'
  },
  events: {
    containerUrl: 'https://registry.hub.docker.com/v2/repositories/wellcome/wellcomecollection_events_webapp'
  },
  catalogue: {
    containerUrl: 'https://registry.hub.docker.com/v2/repositories/wellcome/catalogue_webapp'
  },
  eventbrite: {
    containerUrl: 'https://registry.hub.docker.com/v2/repositories/wellcome/wellcomecollection_eventbrite_webapp'
  }
};

program
  .version('1.0.0')
  .option('-a, --all', 'Deploy all the services')
  .option('-s, --service [serviceName]', 'Deploy a service')
  .parse(process.argv);

if (program.all) {
  const serviceNames = Object.keys(services);
  Promise.all(serviceNames.map(serviceName => {
    return deploy(serviceName);
  }));
} else if (program.service) {
  deploy(program.service);
} else {
  program.help();
  process.exit(1);
}

async function deploy(serviceName, options) {
  const service = services[serviceName];
  if (!service) {
    console.error(colors.red(
      `We can't find the service '${serviceName}'. \n` +
      `Please specify one of the following ${Object.keys(services).join(', ')}.`
    ));
    process.exit(1);
  }

  const dockerUrl = `${service.containerUrl}/tags/`;
  const dockerData = await fetch(dockerUrl).then(resp => resp.json());
  const dockerTags = dockerData.results.filter(tag => tag.name !== 'test');
  const latestTag = dockerTags[0].name;

  const githubUrl = `https://api.github.com/repos/wellcometrust/wellcomecollection.org/git/commits/${latestTag}`;
  const githubData = await fetch(githubUrl).then(resp => resp.json());
  const githubMessage = githubData.message;
  const githubMergeRegExp = /Merge pull request #(\d+) from wellcometrust\/(\w+)/gi;
  const pr = githubMergeRegExp.exec(githubMessage);
  const prLink = pr && `https://github.com/wellcometrust/wellcomecollection.org/pulls/${pr[1]}`;

  console.info('\n');
  const {shouldDeploy} = await prompt({
    type: 'confirm',
    name: 'shouldDeploy',
    message:
      (prLink
        ? `pr:      ${prLink}\n` : '') +
      `  tag:     ${serviceName}:${latestTag}\n` +
      `  message: ${githubMessage.replace(githubMergeRegExp, '').replace(/\n/g, '')}\n` +
      `  Deploy?`
  });

  if (shouldDeploy) {
    console.info(colors.green(`> Deploying ${serviceName}...`));
    const dir = exec(`./terraform_apply_service.sh ${serviceName} ${latestTag}`, (err, stdout, stderr) => {
      if (err) {
        console.error(colors.red(`> Terraform failed while deploying ${serviceName}`));
        console.info(stderr);
      }
    });

    dir.on('exit', function (code) {
      if (code === 0) {
        console.info(colors.green(`> Successfully deployed ${serviceName}`));
      }
    });
  }
}
