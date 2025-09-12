import * as prismic from '@prismicio/client';
import userEvent from '@testing-library/user-event';
import styled from 'styled-components';

import {
  mockData,
  mockDataWithPrismicText,
} from '@weco/common/test/fixtures/components/compact-card';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { font } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import { GridCell, SizeMap } from '@weco/common/views/components/styled/Grid';

import CompactCard, { HasImageProps } from '.';

const getBaseTitleClass = number => {
  return font('wb', number);
};

const mockOnClick = jest.fn();

const grid2: SizeMap = {
  s: [2],
  m: [2],
  l: [2],
  xl: [2],
};
const grid10: SizeMap = {
  s: [10],
  m: [10],
  l: [10],
  xl: [10],
};
const grid12: SizeMap = {
  s: [12],
  m: [12],
  l: [12],
  xl: [12],
};

const ImageWrapper = styled(GridCell).attrs<HasImageProps>(props => {
  if (props.$hasImage) {
    return {
      $sizeMap: grid2,
    };
  }
  return {
    $sizeMap: grid12,
  };
})<HasImageProps>``;

const TextWrapper = styled(GridCell).attrs<HasImageProps>(props => {
  if (props.$hasImage) {
    return {
      $sizeMap: grid10,
    };
  }
  return {
    $sizeMap: grid12,
  };
})<HasImageProps>``;

const TitleWrapper = styled.div.attrs({
  className: font('wb', 4),
})``;

const extraClass = 'my_extra_extra_class';

describe('MediaObjectBase', () => {
  it('renders image', () => {
    const componentWithImage = renderWithTheme(
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
        onClick={mockOnClick}
        url="/blah"
        partDescription="Part"
      />
    );
    expect(componentWithImage.getByRole('img')).toBeTruthy();
  });

  it('calls mock callback function when clicking on component', async () => {
    const componentWithImage = renderWithTheme(
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
        onClick={mockOnClick}
        url="/blah"
        partDescription="Part"
      />
    );
    await userEvent.click(componentWithImage.getByRole('link'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  describe('Description', () => {
    it('renders description in a p tag if description is type text', () => {
      const componentWithImage = renderWithTheme(
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
          onClick={mockOnClick}
          url="/blah"
          partDescription="Part"
        />
      );
      expect(
        componentWithImage.container.outerHTML.includes(mockData.text)
      ).toBe(true);
    });

    it('only render one p tag if description is a PrismicHtmlBlock', async () => {
      const Description = (
        <PrismicHtmlBlock
          html={mockDataWithPrismicText.text as prismic.RichTextField}
        />
      );

      const component = renderWithTheme(
        <CompactCard
          title={mockData.title}
          description={Description}
          primaryLabels={[]}
          secondaryLabels={[]}
          partDescription="Part"
        />
      );
      expect(
        component.container.textContent!.includes(
          'Keep your nose and mouth covered, unless you’re exempt'
        )
      );
    });
  });

  it('adds additional classNames to space wrapper', () => {
    const componentWithImage = renderWithTheme(
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
        onClick={mockOnClick}
        url="/blah"
        partDescription="Part"
      />
    );
    expect(
      componentWithImage.container.outerHTML.includes(extraClass)
    ).toBeTruthy();
  });

  describe('Styles', () => {
    describe('Existing Grid styles', () => {
      it('renders the default grid styles image (3) and title (12) no Image', () => {
        const componentWithoutImage = renderWithTheme(
          <CompactCard
            title={mockData.title}
            description={mockData.text}
            primaryLabels={[]}
            secondaryLabels={[]}
            partDescription="Part"
          />
        );

        const componentHtml = componentWithoutImage.container.outerHTML;
        expect(componentHtml.match(getBaseTitleClass(3))).toBeTruthy();
      });
    });

    describe('Override styles', () => {
      it('overrides text, title and base styles of MediaObjectBase', () => {
        const component = renderWithTheme(
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
            ExtraInfo={null}
            primaryLabels={[]}
            secondaryLabels={[]}
            OverrideImageWrapper={ImageWrapper}
            OverrideTitleWrapper={TitleWrapper}
            OverrideTextWrapper={TextWrapper}
            partDescription="Part"
          />
        );
        const componentHtml = component.container.outerHTML;
        expect(componentHtml.match(getBaseTitleClass(4))).toBeTruthy();
      });
    });
  });
});
