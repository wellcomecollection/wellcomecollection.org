import { NextApiRequest, NextApiResponse } from 'next';

async function fetchWorks(page) {
  try {
    const works = await fetch(
      `https://api.wellcomecollection.org/catalogue/v2/works?availabilities=online&pageSize=50&page=${page || 1}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then(resp => resp.json());
    return works;
  } catch {
    return undefined;
  }
}

const WorksApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { page } = req.query;

  const response = await fetchWorks(page);
  // We format the response to be compatible with Prismic's integration field
  // https://prismic.io/docs/integration#custom-api-format
  const transformedResponse = {
    results_size: 10000, // This is the most we can get from the catalogue API at present
    results: response.results.map(result => {
      const description = `${result.physicalDescription ? `${result.physicalDescription}: ` : ''} ${result.description ? result.description : ''}`;
      return {
        id: result.id,
        title: result.title,
        description,
        image_url: result.thumbnail?.url,
        blob: {
          id: result.id,
          title: result.title,
          physicalDescription: result.physicalDescription,
          description: result.description,
        },
      };
    }),
  };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (response.type === 'Error') {
    res.status(response.httpStatus);
  } else {
    res.status(200);
  }
  res.json(transformedResponse);
};

export default WorksApi;
