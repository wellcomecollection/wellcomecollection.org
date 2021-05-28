import { themeValues } from './config';
import { respondTo, respondBetween, visuallyHidden, clearfix } from './mixins';
export const utilityClasses = `

${[1, 2, 3, 4, 5]
  .map(width => {
    return `
    .border-width-${width} {
      border-width: ${width}px;
      border-style: solid;
    }

    ${['top', 'right', 'bottom', 'left']
      .map(direction => {
        return `
        .border-${direction}-width-${width} {
          border-${direction}-width: ${width}px;
          border-${direction}-style: solid;
        }
      `;
      })
      .join(' ')}
  `;
  })
  .join(' ')}

${Object.entries(themeValues.colors)
  .map(([key, value]) => {
    return `
  .font-${key} {
    color: ${value.base};

    .icon__shape {
      fill: ${value.base};
    }
  }
  .font-hover-${key}:hover,
  .font-hover-${key}:focus {
    color: ${value.base};
  }
  .bg-${key} {
    background: ${value.base};
  }

  .bg-hover-${key} {
    &:hover,
    &:focus {
      background: ${value.base};
    }
  }

  .border-color-${key} {
    border-color: ${value.base};
  }

  .border-hover-color-${key}:hover,
  .border-hover-color-${key}:focus {
    border-color: ${value.base};
  }
  `;
  })
  .join(' ')}

.transition-bg {
  transition: background ${themeValues.transitionProperties};
}

.caps {
  text-transform: uppercase;
}

.is-hidden {
  display: none !important;
}

.is-hidden-s {
  ${respondBetween(
    'small',
    'medium',
    `
    display: none !important;
  `
  )}
}

.is-hidden-m {
  ${respondBetween(
    'medium',
    'large',
    `
    display: none !important;
  `
  )}
}

.is-hidden-l {
  ${respondBetween(
    'large',
    'xlarge',
    `
    display: none !important;
  `
  )}
}

.is-hidden-xl {
  ${respondTo(
    'xlarge',
    `
    display: none !important;
  `
  )}
}

.line-height-1.line-height-1 {
  line-height: 1;
}

.touch-scroll {
  -webkit-overflow-scrolling: touch;
}

.v-align-middle {
  vertical-align: middle;
}

.v-center {
  top: 50%;
  transform: translateY(-50%);
}

.flex {
  display: flex;
}

.flex-l-up {
  ${respondTo(
    'large',
    `
    display: flex;
  `
  )}
}

.flex--column {
  flex-direction: column;
}

.flex-inline {
  display: inline-flex;
}

.flex--v-start {
  align-items: flex-start;
}

.flex--v-end {
  align-items: flex-end;
}

.flex--v-center {
  align-items: center;
}

.flex--h-baseline {
  align-items: baseline;
}

.flex--wrap {
  flex-wrap: wrap;
}

.flex--h-center {
  justify-content: center;
}

.flex--h-space-between {
  justify-content: space-between;
}

.flex-end {
  justify-content: flex-end;
}

.flex-1 {
  flex: 1;
}

.pointer {
  cursor: pointer;
}

.pointer-events-none {
  pointer-events: none;
}

.pointer-events-all {
  pointer-events: all;
}

.plain-button {
  appearance: none;
  font-family: inherit;
  letter-spacing: inherit;
  background: ${themeValues.color('transparent')};
  border: 0;
  text-align: left;
}

.plain-link,
.plain-link:link,
.plain-link:visited {
  text-decoration: none;
  border: none;

  .body-text & {
    text-decoration: none;
    border: none;
  }
}

.underline-on-hover:hover,
:link:hover .underline-on-hover {
  text-decoration: underline;
}

.text-align-right {
  text-align: right;
}

.text-align-center {
  text-align: center;
}

.no-visible-focus {
  &,
  &:focus {
    outline: 0;
  }
}

.plain-list {
  list-style: none;
}

.block {
  display: block;
}

.flex-ie-block {
  display: block; // IE

  @supports(display: flex) { // IE ignores @supports
    display: flex;
  }
}

.inline {
  display: inline;
}

.inline-block {
  display: inline-block;
}

.nowrap {
  white-space: nowrap;
}

.float-r {
  float: right;
}

.float-l {
  float: left;
}

.rotate-r-8 {
  transform: rotate(8deg);
}

.h-center {
  margin-left: auto;
  margin-right: auto;
}

.text--truncate {
  max-height: 80px;
  overflow: hidden;

  &:after {
    position: absolute;
    top: 45px;
    content: '';
    display: block;
    width: 100%;
    height: 35px;
    background: linear-gradient(rgba(255, 255, 255 , 0.001), ${themeValues.color(
      'white'
    )}); // Safari doesn't like transparent (shows as grey), so giving a value very close to transparent.
  }
}

.flush-container-left {
  position: absolute;
  left: ${themeValues.containerPadding.small}px;

  ${respondTo(
    'medium',
    `
    left: ${themeValues.containerPadding.medium}px;
  `
  )}


  ${respondTo(
    'large',
    `
    left: ${themeValues.containerPadding.large}px;
  `
  )}

  ${respondTo(
    'xlarge',
    `
    left: calc(((100vw - ${themeValues.sizes.xlarge}px) / 2) + ${themeValues.containerPadding.xlarge}px)
  `
  )}
}

.flush-container-right {
  position: absolute;
  right: ${themeValues.containerPadding.small}px;

  ${respondTo(
    'medium',
    `
    right: ${themeValues.containerPadding.medium}px;
  `
  )}


  ${respondTo(
    'large',
    `
    right: ${themeValues.containerPadding.large}px;
  `
  )}

  ${respondTo(
    'xlarge',
    `
    right: calc(((100vw - ${themeValues.sizes.xlarge}px) / 2) + ${themeValues.containerPadding.xlarge}px)
  `
  )}
}


.no-margin {
  margin: 0 !important;
}

.no-margin-s.no-margin-s {
  ${respondBetween(
    'small',
    'medium',
    `
    margin: 0;
  `
  )}
}

.no-margin-m.no-margin-m {
  ${respondBetween(
    'medium',
    'large',
    `
    margin: 0;
  `
  )}
}

.no-margin-l.no-margin-l {
  ${respondTo(
    'large',
    `
    margin: 0;
  `
  )}
}

.no-padding {
  padding: 0;
}


.no-padding-s.no-padding-s {
  ${respondBetween(
    'small',
    'medium',
    `
    padding: 0;
  `
  )}
}

.no-padding-m.no-padding-m {
  ${respondBetween(
    'medium',
    'large',
    `
    padding: 0;
  `
  )}
}

.no-padding-l.no-padding-l {
  ${respondTo(
    'large',
    `
    padding: 0;
  `
  )}
}



.margin-h-auto {
  margin-left: auto;
  margin-right: auto;
}

.margin-top-auto {
  margin-top: auto;
}

.bg-transparent-black {
  background: ${themeValues.color('transparent-black')};
}

.bg-transparent-black--hover {
  transition: background 0.7s ease;

  &[href]:hover,
  &[href]:focus {
    background: ${themeValues.color('black')};
  }
}

.promo-link {
  height: 100%;
  color: ${themeValues.color('black')};

  &:hover .promo-link__title,
  &:focus .promo-link__title {
    text-decoration: underline;
    text-decoration-color: ${themeValues.color('green')};
  }
}

.promo-link__title {
  transition: color 400ms ease;
}

.rounded-corners {
  border-radius: ${themeValues.borderRadiusUnit}px;
}

.rounded-diagonal {
  border-top-left-radius: ${themeValues.borderRadiusUnit}px;
  border-bottom-right-radius: ${themeValues.borderRadiusUnit}px;
}
.rounded-top {
  border-top-left-radius: ${themeValues.borderRadiusUnit}px;
  border-top-right-radius: ${themeValues.borderRadiusUnit}px;
}

.rounded-bottom {
  border-bottom-left-radius: ${themeValues.borderRadiusUnit}px;
  border-bottom-right-radius: ${themeValues.borderRadiusUnit}px;
}

.round {
  border-radius: 50%;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.full-width {
  width: 100%;
}

.full-height {
  height: 100%;
}

.full-max-width {
  max-width: 100%;
}

// Images
.width-inherit {
  width: inherit;
}

.image-max-height-restricted {
  max-height: 90vh;
  max-width: 100%;
  width: auto;
  margin: 0 auto;
}

// For when we get HTML out of systems like Prismic
.first-para-no-margin p:first-of-type {
  margin: 0;
}

// This removes the element from the flow, as well as it's visibility
.visually-hidden {
  ${visuallyHidden};
}

.opacity-0 {
  opacity: 0;
}

.hidden {
  visibility: hidden;
}

.overflow-hidden {
  overflow: hidden;
}

.cursor-zoom-in {
  cursor: zoom-in;
}

// Used mainly for images
.max-height-70vh {
  max-height: 70vh;
}

.width-auto {
  width: auto;
  max-width: 100%;
}


.clearfix {
  ${clearfix}
}

// TODO: use this for e.g. Promo hover behaviour too
.card-link {
  text-decoration: none;

  &:hover,
  &:focus {
    .card-link__title {
      text-decoration: underline;
      text-decoration-color: ${themeValues.color('green')};
    }
  }
}

.empty-filler:before {
  content: "\\200b";
}
.shadow {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
}
`;
