import CompactCard from './CompactCard';
import { mountWithTheme } from '../../../test/fixtures/enzyme-helpers';
import { mockData } from '../../../test/fixtures/components/compact-card';
import Image from '../Image/Image';
import * as ga from '../../../utils/ga';

const extraClass = 'my_extra_extra_class';

describe('CompactCard', () => {
  const componentWithImage = mountWithTheme(
    <CompactCard
      url={null}
      title={mockData.title}
      Image={<Image {...mockData.image.crops.square} />}
      partNumber={null}
      color={null}
      StatusIndicator={null}
      description={mockData.text}
      urlOverride={null}
      DateInfo={null}
      ExtraInfo={null}
      labels={{ labels: [] }}
      xOfY={{ x: null, y: null }}
      extraClasses={extraClass}
    />
  );

  it('should match snapshots', () => {
    expect(componentWithImage.html()).toMatchSnapshot();
  });

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
