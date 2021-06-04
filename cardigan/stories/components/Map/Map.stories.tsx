import Map from '@weco/common/views/components/Map/Map';

const Template = args => <Map {...args} />;
export const basic = Template.bind({});
basic.args = {
  title: 'Getting here',
  latitude: 51.526053,
  longitude: -0.1333271,
};
basic.storyName = 'Map';
