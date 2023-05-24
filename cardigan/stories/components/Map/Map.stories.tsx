import Map from '@weco/content/components/Map/Map';

// TODO fix snapshots
const Template = args => <Map {...args} />;
export const basic = Template.bind({});
basic.args = {
  title: 'Getting here',
  latitude: 51.526053,
  longitude: -0.1333271,
};
basic.storyName = 'Map';
basic.parameters = {
  chromatic: {
    viewports: [375, 1200],
  },
};
