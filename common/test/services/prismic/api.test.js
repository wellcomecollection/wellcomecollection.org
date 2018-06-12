import util from 'util';
import Prismic from 'prismic-javascript';
const apiUri = 'https://wellcomecollection.prismic.io/api/v2';

test('Experiments', async () => {
  const api = await Prismic.getApi(apiUri);
  const currentExperiment = api.currentExperiment();
  const doc = await api.getByID('Ww_grCEAAGpwlPul', {ref: 'WxAqYCEAAIillfBs~WxAffyAAACiw0Nox'});
  console.info(doc.data.title);
  console.log(util.inspect(currentExperiment, false, null));
});
