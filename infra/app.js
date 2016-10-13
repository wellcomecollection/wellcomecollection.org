const AWS = require('aws-sdk');
const inquirer = require('inquirer');
const exec = require('child_process').exec;

async function getBuckets() {
  const s3 = new AWS.S3({
    sslEnabled: true,
    region: 'eu-west-1'
  });

  const buckets = await s3.listBuckets().promise().then(resp => resp.Buckets);
  const bucketChoices = buckets.map(bucket => bucket.Name);

  const bucketQ = {
    type: 'list',
    name: 'bucket',
    message: 'Which bucket holds your builds:',
    choices: bucketChoices
  };

  const {bucket} = await inquirer.prompt(bucketQ);
  
  const prefix = 'builds/master/';
  const buildNumbers = await s3.listObjectsV2({
    Bucket: bucket,
    Prefix: prefix
  }).promise().then(resp => resp.Contents
    .map(obj =>
      // Could use regex, but it's less clear'
      parseInt(obj.Key
        .replace(prefix, '')
        .replace('.tar', ''))
    ) 
    .filter(key => !isNaN(key)) // <= removes the root object
    .sort((a, b) => b - a)
  );

  const buildNumbersQ = {
    type: 'list',
    name: 'buildNumber',
    message: 'Which build would you like:',
    choices: buildNumbers.map(String)
  };

  const {buildNumber} = await inquirer.prompt(buildNumbersQ);

  const deployStart = Date.now();
  console.info(`Deploying build: ${buildNumber} of wellcomecollection.org to prod...`);
  
  exec(`./deploy.sh ${bucket} ${buildNumber}`, (err, stdout) => {
    if (err) {
      console.error('There was an error deploying, please make sure you check that the AWS setup is not mangled.');
    }
    else {
      const deployedIn = Date.now() - deployStart;
      console.info(`Deployed build: ${buildNumber} of wellcomecollection.org to prod in ${deployedIn/100} seconds`);
    }
  });
}

getBuckets();
