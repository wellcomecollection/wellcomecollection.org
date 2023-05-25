import { CustomType } from './types/CustomType';

const backgroundTexture: CustomType = {
  id: 'background-textures',
  label: 'Background texture',
  repeatable: true,
  status: true,
  json: {
    'Background texture': {
      image: {
        type: 'Image',
      },
      name: {
        type: 'Text',
        config: {
          label: 'name',
        },
      },
    },
  },
  format: 'custom',
};

export default backgroundTexture;
