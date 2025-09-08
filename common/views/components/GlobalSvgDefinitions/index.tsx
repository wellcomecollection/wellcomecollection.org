import React from 'react';

/**
 * GlobalSvgDefinitions contains reusable SVG filter definitions that can be referenced
 * by CSS filter properties throughout the application.
 *
 * This component should be included once at the app level to ensure SVG definitions
 * are available globally without duplication.
 */
const GlobalSvgDefinitions: React.FC = () => {
  return (
    <svg
      data-component="global-svg-definitions"
      style={{ position: 'absolute', visibility: 'hidden' }}
      width="0"
      height="0"
      aria-hidden="true"
    >
      <defs>
        {/* Border radius mask filter for images with object-fit */}
        {/* Adapted from https://stackoverflow.com/questions/49567069/image-rounded-corners-issue-with-object-fit-contain/76106794#76106794 */}
        <filter id="border-radius-mask">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 -50"
            result="mask"
          />
          <feComposite in="SourceGraphic" in2="mask" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

export default GlobalSvgDefinitions;
