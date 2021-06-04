import OnThisPageAnchors from '@weco/common/views/components/OnThisPageAnchors/OnThisPageAnchors';
./../common/views/components/OnThisPageAnchors/README.md';

const Template = args => <OnThisPageAnchors {...args} />;
export const basic = Template.bind({});
basic.args = {
  links: [
    { text: 'Getting here', url: '#getting-here' },
    {
      text: 'Getting around the building',
      url: '#getting-around-the-building',
    },
    {
      text: 'Accessible exhibitions and events',
      url: '#accessible-exhibitions-and-events',
    },
    {
      text: 'Visual access',
      url: '#visual-access',
    },
    {
      text: 'Auditory access',
      url: '#auditory-access',
    },
    {
      text: 'Wheelchair and physical access',
      url: '#wheelchair-and-physical-access',
    },
    {
      text: 'Sensory access',
      url: '#sensory-access',
    },
  ]
};
basic.storyName = 'OnThisPageAnchors';
