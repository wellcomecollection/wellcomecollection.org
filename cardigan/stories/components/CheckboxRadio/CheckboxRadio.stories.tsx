import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';

const Template = args => <CheckboxRadio {...args} />;
export const checkbox = Template.bind({});
checkbox.args = {
  id: 1,
  type: 'checkbox',
  text: 'Manuscripts',
};
checkbox.parameters = { chromatic: { viewports: [375, 1200] } };

export const radio = Template.bind({});
radio.args = {
  id: 2,
  type: 'radio',
  text: 'Manuscripts',
};
radio.parameters = { chromatic: { viewports: [375, 1200] } };
