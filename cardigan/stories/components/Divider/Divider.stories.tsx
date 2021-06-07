import Divider from '@weco/common/views/components/Divider/Divider';

const Template = args => <Divider {...args} />;
export const keyline = Template.bind({});
keyline.args = {
  extraClasses: `divider--keyline divider--black`,
};

export const stub = Template.bind({});
stub.args = {
  extraClasses: `divider--stub divider--black`,
};

export const thin = Template.bind({});
thin.args = {
  extraClasses: `divider--thin divider--black`,
};

export const dashed = Template.bind({});
dashed.args = {
  extraClasses: `divider--dashed`,
};
