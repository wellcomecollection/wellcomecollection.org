// import License from '@weco/catalogue/components/License/License';
// import { getLicenseInfo } from '@weco/common/utils/licenses';

// const Template = args => <License {...args} />;
const Template = args => <p {...args} />;
export const basic = Template.bind({});
// basic.args = {
//   license: getLicenseInfo('CC-0'),
// };
basic.storyName = 'License';

// TODO: add these as controls
// [
//   'CC-0',
//   'CC-BY',
//   'CC-BY-NC',
//   'CC-BY-NC-ND',
//   'PDM',
//   'CC-BY-ND',
//   'CC-BY-SA',
//   'CC-BY-NC-SA',
//   'OGL',
//   'OPL',
//   'INC',
// ],
