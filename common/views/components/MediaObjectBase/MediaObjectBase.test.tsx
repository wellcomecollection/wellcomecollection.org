import MediaObjectBase, { HasImageProps } from './MediaObjectBase';
import {
  shallowWithTheme,
  mountWithTheme,
} from '../../../test/fixtures/enzyme-helpers';
import {
  mockData,
  mockDataWithPrismicText,
} from '../../../test/fixtures/components/compact-card';
import Image from '../Image/Image';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import styled from 'styled-components';
import { grid, classNames, font } from '../../../utils/classnames';

const getBaseTitleClass = number => {
  return `card-link__title font-wb font-size-${number}`;
};

const mockOnClick = jest.fn();

const grid2 = grid({ s: 2, m: 2, l: 2, xl: 2 });
const grid3 = grid({ s: 3, m: 3, l: 3, xl: 3 });
const grid9 = grid({ s: 9, m: 9, l: 9, xl: 9 });
const grid10 = grid({ s: 10, m: 10, l: 10, xl: 10 });
const grid12 = grid({ s: 12, m: 12, l: 12, xl: 12 });

const ImageWrapper = styled.div.attrs<HasImageProps>(props => {
  if (props.hasImage) {
    return {
      className: grid2,
    };
  }
  return {
    className: grid12,
  };
})<HasImageProps>``;

const TextWrapper = styled.div.attrs<HasImageProps>(props => {
  if (props.hasImage) {
    return {
      className: grid10,
    };
  }
  return {
    className: grid12,
  };
})<HasImageProps>``;

const TitleWrapper = styled.div.attrs({
  className: classNames({
    'card-link__title': true,
    [font('wb', 4)]: true,
  }),
})``;

const extraClass = 'my_extra_extra_class';

describe('MediaObjectBase', () => {
  const componentWithImage = mountWithTheme(
    <MediaObjectBase
      title={mockData.title}
      Image={<Image {...mockData.image.crops.square} />}
      description={mockData.text}
      primaryLabels={[]}
      secondaryLabels={[]}
      extraClasses={extraClass}
      onClick={mockOnClick}
      partDescription="Part"
    />
  );

  const componentWithoutImage = shallowWithTheme(
    <MediaObjectBase
      title={mockData.title}
      description={mockData.text}
      primaryLabels={[]}
      secondaryLabels={[]}
      partDescription="Part"
    />
  );

  it('renders image', () => {
    expect(componentWithImage.find('Image')).toBeTruthy();
  });

  it('calls mock callback function when clicking on component', () => {
    componentWithImage.simulate('click');
    expect(mockOnClick).toBeCalledTimes(1);
  });

  describe('Description', () => {
    it('renders description in a p tag if description is type text', () => {
      expect(componentWithImage.find('p').contains(mockData.text)).toBeTruthy();
    });

    it('only render one p tag if description is a PrismicHtmlBlock', () => {
      const Description = (
        <PrismicHtmlBlock html={mockDataWithPrismicText.text} />
      );

      const component = mountWithTheme(
        <MediaObjectBase
          title={mockData.title}
          description={Description}
          primaryLabels={[]}
          secondaryLabels={[]}
          partDescription="Part"
        />
      );

      expect(component.find('p').length).toEqual(1);
    });
  });

  it('adds additional classNames to space wrapper', () => {
    expect(componentWithImage.html().match(extraClass)).toBeTruthy();
  });

  describe('Styles', () => {
    describe('Existing Grid styles', () => {
      it('renders the default grid styles image (3) and title (12) no Image', () => {
        const componentHtml = componentWithoutImage.html();
        expect(componentHtml.match(grid3)).toBeTruthy();
        expect(componentHtml.match(grid12)).toBeTruthy();
        expect(componentHtml.match(getBaseTitleClass(3))).toBeTruthy();
      });

      it('renders the default grid styles image (3) and title (9) if image Prop included', () => {
        const componentHtml = componentWithImage.html();
        expect(componentHtml.match(grid3)).toBeTruthy();
        expect(componentHtml.match(grid9)).toBeTruthy();
      });
    });

    describe('Override styles', () => {
      it('overrides text, title and base styles of MediaObjectBase', () => {
        const component = shallowWithTheme(
          <MediaObjectBase
            title={mockData.title}
            Image={<Image {...mockData.image.crops.square} />}
            ExtraInfo={null}
            primaryLabels={[]}
            secondaryLabels={[]}
            OverrideImageWrapper={ImageWrapper}
            OverrideTitleWrapper={TitleWrapper}
            OverrideTextWrapper={TextWrapper}
            partDescription="Part"
          />
        );
        const componentHtml = component.html();
        expect(componentHtml.match(grid2)).toBeTruthy();
        expect(componentHtml.match(grid10)).toBeTruthy();
        expect(componentHtml.match(getBaseTitleClass(4))).toBeTruthy();
      });
    });
  });
});
