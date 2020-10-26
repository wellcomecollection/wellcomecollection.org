import CompactCard from './CompactCard';
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

const grid2 = grid({ s: 2, m: 2, l: 2, xl: 2 });
const grid3 = grid({ s: 3, m: 3, l: 3, xl: 3 });
const grid9 = grid({ s: 9, m: 9, l: 9, xl: 9 });
const grid10 = grid({ s: 10, m: 10, l: 10, xl: 10 });
const grid12 = grid({ s: 12, m: 12, l: 12, xl: 12 });

const ImageWrapper = styled.div.attrs(props => {
  if (props.hasImage) {
    return {
      className: grid2,
    };
  }
  return {
    className: grid12,
  };
})``;

const TextWrapper = styled.div.attrs(props => {
  if (props.hasImage) {
    return {
      className: grid10,
    };
  }
  return {
    className: grid12,
  };
})``;

const TitleWrapper = styled.div.attrs(props => ({
  className: classNames({
    'card-link__title': true,
    [font('wb', 4)]: true,
  }),
}))``;

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

  const componentWithoutImage = shallowWithTheme(
    <CompactCard
      url={null}
      title={mockData.title}
      Image={null}
      partNumber={null}
      color={null}
      StatusIndicator={null}
      description={mockData.text}
      urlOverride={null}
      DateInfo={null}
      ExtraInfo={null}
      labels={{ labels: [] }}
      xOfY={{ x: null, y: null }}
    />
  );

  it('should match snapshots', () => {
    expect(componentWithImage.html()).toMatchSnapshot();
  });
  it('should render image', () => {
    expect(componentWithImage.find('Image')).toBeTruthy();
  });
  describe('Description', () => {
    it('should render description in a p tag if description is type text', () => {
      expect(componentWithImage.find('p').contains(mockData.text)).toBeTruthy();
    });

    it('only render one p tag if description is a PrismicHtmlBlock', () => {
      const Description = (
        <PrismicHtmlBlock html={mockDataWithPrismicText.text} />
      );

      const component = mountWithTheme(
        <CompactCard
          url={null}
          title={mockData.title}
          Image={null}
          partNumber={null}
          color={null}
          StatusIndicator={null}
          description={Description}
          urlOverride={null}
          DateInfo={null}
          ExtraInfo={null}
          labels={{ labels: [] }}
          xOfY={{ x: null, y: null }}
        />
      );

      expect(component.find('p').length).toEqual(1);
    });
  });

  it('should add additional classNames to space wrapper', () => {
    expect(componentWithImage.html().match(extraClass)).toBeTruthy();
  });

  describe('Styles', () => {
    describe('Existing Grid styles', () => {
      it('should render the default grid styles image (3) and title (12) no Image', () => {
        const componentHtml = componentWithoutImage.html();
        expect(componentHtml.match(grid3)).toBeTruthy();
        expect(componentHtml.match(grid12)).toBeTruthy();
        expect(componentHtml.match(getBaseTitleClass(5))).toBeTruthy();
      });

      it('should render the default grid styles image (3) and title (9) if image Prop included', () => {
        const componentHtml = componentWithImage.html();
        expect(componentHtml.match(grid3)).toBeTruthy();
        expect(componentHtml.match(grid9)).toBeTruthy();
      });
    });

    describe('Override styles', () => {
      it('should override text, title and base styles of compact card', () => {
        const component = shallowWithTheme(
          <CompactCard
            url={null}
            title={mockData.title}
            Image={<Image {...mockData.image.crops.square} />}
            partNumber={null}
            color={null}
            StatusIndicator={null}
            description={null}
            urlOverride={null}
            DateInfo={null}
            ExtraInfo={null}
            labels={{ labels: [] }}
            xOfY={{ x: null, y: null }}
            OverrideImageWrapper={ImageWrapper}
            OverrideTitleWrapper={TitleWrapper}
            OverrideTextWrapper={TextWrapper}
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
