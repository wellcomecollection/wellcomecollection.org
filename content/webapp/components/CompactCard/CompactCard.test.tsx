import CompactCard from './CompactCard';
import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';
import { mockData } from '@weco/common/test/fixtures/components/compact-card';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import * as ga from '@weco/common/utils/ga';

const extraClass = 'my_extra_extra_class';

describe('CompactCard', () => {
  const componentWithImage = mountWithTheme(
    <CompactCard
      title={mockData.title}
      Image={
        <PrismicImage
          image={{ ...mockData.image }}
          sizes={{
            xlarge: 1 / 6,
            large: 1 / 6,
            medium: 1 / 5,
            small: 1 / 4,
          }}
          quality="low"
        />
      }
      description={mockData.text}
      primaryLabels={[]}
      secondaryLabels={[]}
      extraClasses={extraClass}
    />
  );

  it('should expect trackGaEvent to be called ', () => {
    const spyOnTrackEvent = jest.spyOn(ga, 'trackGaEvent');
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
