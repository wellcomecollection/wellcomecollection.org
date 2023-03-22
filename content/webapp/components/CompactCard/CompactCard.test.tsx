import CompactCard from './CompactCard';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import userEvent from '@testing-library/user-event';
import { mockData } from '@weco/common/test/fixtures/components/compact-card';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import * as ga from '@weco/common/utils/ga';

const extraClass = 'my_extra_extra_class';

describe('CompactCard', () => {
  it('should expect trackGaEvent to be called ', async () => {
    const spyOnTrackEvent = jest.spyOn(ga, 'trackGaEvent');

    const { getByRole } = renderWithTheme(
      <CompactCard
        title={mockData.title}
        url="/blah"
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

    const link = getByRole('link');

    await userEvent.click(link);

    expect(spyOnTrackEvent).toBeCalled();
    expect(spyOnTrackEvent).toHaveBeenCalledTimes(1);
    expect(spyOnTrackEvent).toBeCalledWith({
      action: 'follow link',
      category: 'CompactCard',
      label: 'mock title',
    });
  });
});
