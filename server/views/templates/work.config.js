import mockJson from '../../test/mocks/wellcomecollection-api.json';

export const name = 'work';
export const handle = 'work-template';
export const status = 'wip';

export const context = {
  work: Object.assign({}, mockJson, {license: 'CC-BY-NC', imgLink: 'https://wellcomecollection-miro-images.imgix.net/V0047000/V0047696.jpg'}) // temp license and img data until we know how this is coming from the API
};
