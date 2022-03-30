import CompactCard from './CompactCard';
import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import { mockData } from '@weco/common/test/fixtures/components/compact-card';
import Image from '@weco/common/views/components/Image/Image';
import * as ga from '@weco/common/utils/ga';

const extraClass = 'my_extra_extra_class';

describe('CompactCard', () => {
  const componentWithImage = mountWithTheme(
    <CompactCard
      title={mockData.title}
      Image={<Image {...mockData.image} />}
      description={mockData.text}
      primaryLabels={[]}
      secondaryLabels={[]}
      extraClasses={extraClass}
    />
  );

  it('should expect ga trackEvent tobe called ', () => {
    const spyOnTrackEvent = jest.spyOn(ga, 'trackEvent');
    componentWithImage.simulate('click');
    expect(spyOnTrackEvent).toBeCalled();
    expect(spyOnTrackEvent).toHaveBeenCalledTimes(1);
    expect(spyOnTrackEvent).toBeCalledWith({
      action: 'follow link',
      category: 'CompactCard',
      label: 'mock title',
    });
  });
});
