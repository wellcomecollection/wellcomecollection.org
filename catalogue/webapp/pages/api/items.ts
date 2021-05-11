import fetch from 'isomorphic-unfetch';
import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

let apiKey;
if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1',
  });
}
const secretsManager = new AWS.SecretsManager();
secretsManager.getSecretValue(
  { SecretId: 'catalogue_api/items/prod/api_key' },
  (error, data) => {
    if (error) {
      console.log(error, error.stack);
    } else {
      apiKey = data['SecretString'];
    }
  }
);

const dummyItems = {
  id: 'mtt2grge',
  items: [
    {
      id: 'xwsu9wef',
      status: {
        id: 'available',
        label: 'Available',
        type: 'ItemStatus',
      },
    },
    {
      id: 'fkpbgf2k',
      status: {
        id: 'available',
        label: 'Available',
        type: 'ItemStatus',
      },
    },
  ],
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { id } = req.query;
  const items = apiKey
    ? await fetch(
        `https://api.wellcomecollection.org/catalogue/v2/works/${id}/items`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
        }
      ).then(resp => resp.json())
    : dummyItems;

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(items);
};
