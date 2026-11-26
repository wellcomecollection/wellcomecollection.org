import { NextApiRequest, NextApiResponse } from 'next';

import { getWorks } from '@weco/content/services/wellcome/catalogue/works';

// Serves the works picker in Prismic, in the shape its integration field expects:
// https://prismic.io/docs/integration#custom-api-format
const WorksApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const page = Number(req.query.page) || 1;

  const works = await getWorks({
    params: { availabilities: ['online'], page },
    pageSize: 50,
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (works.type === 'Error') {
    res.status(works.httpStatus).json({ results_size: 0, results: [] });
    return;
  }

  res.status(200).json({
    results_size: 10000, // This is the most we can get from the catalogue API at present
    results: works.results.map(work => {
      const description = `${work.physicalDescription ? `${work.physicalDescription}: ` : ''} ${work.description ?? ''}`;
      return {
        id: work.id,
        title: work.title,
        description,
        image_url: work.thumbnail?.url,
        blob: {
          id: work.id,
          title: work.title,
          physicalDescription: work.physicalDescription,
          description: work.description,
        },
      };
    }),
  });
};

export default WorksApi;
