#!/usr/bin/env ts-node-script

import AWS from 'aws-sdk';
import fs from 'fs';
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
const secretsManager = new AWS.SecretsManager();
const ssm = new AWS.SSM();

const data = fs.readFileSync('prompt/login.json', 'utf8');

type Env = 'stage' | 'prod'

type ClientCredentials = {
  clientId: string
  clientSecret: string
}

type BearerToken = {
  access_token: string,
  scope: string,
  expires_in: number,
  token_type: 'Bearer'
}

async function getParameter(name: string): Promise<string> {
  const parameterResult = await ssm.getParameter({
    Name: name
  }).promise()

  if(parameterResult.Parameter && parameterResult.Parameter.Value) {
    return parameterResult.Parameter.Value
  } else {
    throw Error(`Parameter ${name} missing!`)
  }
}

async function getSecret<T>(path: string): Promise<T> {
  const secret = await secretsManager.getSecretValue({
    SecretId: path
  }).promise();

  if(secret.SecretString) {
    return JSON.parse(secret.SecretString) as T;
  } else {
    throw Error(`Secret ${path} missing!`);
  }
}

function buildTokenRequest(hostname: string, credentials: ClientCredentials): AxiosRequestConfig {
  const tokenEndpoint = `https://${hostname}/oauth/token`;
  const audience = `https://${hostname}/api/v2/`

  return {
    method: 'POST',
    url: tokenEndpoint,
    headers: {'content-type': 'application/json'},
    data: {
      grant_type: 'client_credentials',
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      audience: audience
    }
  };
}

async function requestApiToken(hostname: string, credentials: ClientCredentials): Promise<BearerToken> {
  const tokenRequest = buildTokenRequest(hostname, credentials);
  const axiosResult: AxiosResponse<BearerToken> = await axios.request(tokenRequest);

  return axiosResult.data
}

async function getApiToken(env: Env) {
  const hostnameParameterName = `identity-auth0_domain-${env}`;
  const credentialsLocation = `identity/${env}/buildkite/credentials`;

  const credentials = await getSecret<ClientCredentials>(credentialsLocation);
  const hostname = await getParameter(hostnameParameterName);
  const bearerToken = await requestApiToken(hostname, credentials);

  console.log(bearerToken);

  return 'done';
}

(async () => {
    const result = await getApiToken('stage');
    console.log(result);
})()

// get secrets
// get api key using client credentials flow from Auth0 API gateway
// update text prompts & login template in auth0 using api key
