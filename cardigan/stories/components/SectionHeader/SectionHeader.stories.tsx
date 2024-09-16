import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { gridSize12 } from '@weco/common/views/components/Layout';
import Readme from '@weco/content/components/SectionHeader/README.md';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';

const Template = args => {
  const { gridSize, ...rest } = args;

  return (
    <ReadmeDecorator
      WrappedComponent={SectionHeader}
      args={{
        ...rest,
        gridSize: gridSize === '12' ? gridSize12() : undefined,
      }}
      Readme={Readme}
    />
  );
};
export const basic = Template.bind({});
basic.args = {
  title: 'You may have missed',
  gridSize: undefined,
};
basic.argTypes = {
  gridSize: {
    options: ['12', undefined],
    control: { type: 'radio' },
  },
};
basic.storyName = 'SectionHeader';
