import { themeValues } from '../config';

export const container = `
.container {
  margin: 0 auto;
  width: 100%;
  max-width: ${themeValues.sizes.xlarge}px;
  padding: 0 ${themeValues.containerPadding.small}px;

  ${themeValues.media('medium')(`
    padding: 0 ${themeValues.containerPadding.medium}px;
  `)}

  ${themeValues.media('large')(`
    padding: 0 ${themeValues.containerPadding.large}px;
  `)}


}

.container--scroll {
  ${themeValues.mediaBetween(
    'small',
    'medium'
  )(`
    max-width: none;
    width: auto;
    overflow: auto;
    padding: 0;

    &::-webkit-scrollbar {
      height: 18px;
      background: ${themeValues.color('white')};
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 0;
      border-style: solid;
      border-color: ${themeValues.color('white')};
      border-width: 0 ${themeValues.containerPadding.small}px 12px;
      background: ${themeValues.color('neutral.400')};

      @include respond-to('medium') {
        border-left-width: ${themeValues.containerPadding.medium}px;
        border-right-width: ${themeValues.gutter.medium}px;
      }

      @include respond-to('large') {
        border-left-width: ${themeValues.containerPadding.large}px;
        border-right-width: ${themeValues.gutter.large}px;
      }

      @include respond-to('xlarge') {
        border-left-width: calc(((100vw - ${
          themeValues.sizes.xlarge
        }px) / 2) + ${themeValues.containerPadding.large}px);
      }
    }
  `)}
}
`;
