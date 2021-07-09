import Divider from '@weco/common/views/components/Divider/Divider';

const Template = args => <Divider {...args} />;
export const keyline = Template.bind({});
keyline.args = {
  color: 'black',
  isKeyline: true,
};

export const stub = Template.bind({});
stub.args = {
  color: 'black',
  isStub: true,
};

export const thin = Template.bind({});
thin.args = {
  color: 'black',
  isThin: true,
};
