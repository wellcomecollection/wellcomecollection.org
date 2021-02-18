import { useState, useRef, useEffect, FunctionComponent } from 'react';
import NextLink from 'next/link';
import { IIIFManifest } from '@weco/common/model/iiif';
import { itemLink } from '@weco/common/services/catalogue/routes';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import { ShameButton } from '@weco/common/views/components/ViewerTopBar/ViewerTopBar';
import { volumesNavigationLabel } from '@weco/common/text/arial-labels';

const HiddenContent = styled.div.attrs(() => ({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
}))`
  min-width: 200px;
  max-width: 100%;
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  border: ${props => `1px solid ${props.theme.color('marble')}`};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  background: ${props => `${props.theme.color('white')}`};
  color: ${props => `${props.theme.color('black')}`};
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
  padding: ${props => `${props.theme.spacingUnit * 3}px`};
  position: absolute;
  top: calc(100% + ${props => `${props.theme.spacingUnit * 2}px`});
  right: 0;
  display: ${props => (props.hidden ? 'none' : 'block')};

  .current {
    text-decoration: underline;
  }
  li + li {
    margin-top: ${props => `${props.theme.spacingUnit * 2}px`};
  }
  a {
    color: ${props => props.theme.color('green')};
    text-decoration: none;
  }
  .icon__canvas {
    height: 1.3em;
  }
  .icon__shape {
    fill: currentColor;
  }
`;

type Props = {
  buttonText: string;
  manifests: IIIFManifest[];
  workId: string;
  lang: string;
};

const MultipleManifestList: FunctionComponent<Props> = ({
  buttonText,
  manifests,
  workId,
  lang,
  manifestIndex,
}: Props) => {
  const [showHidden, setShowHidden] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current?.contains(event.target)) {
      setShowHidden(false);
    }
  };
  useEffect(() => {
    window.document.addEventListener('click', handleClickOutside, false);
    return () => {
      window.document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const hiddenContentId = 'MultipleManifestListHiddenContent';
  return (
    <div
      ref={wrapperRef}
      role="navigation"
      aria-label={volumesNavigationLabel}
      className={classNames({
        'inline-block': true,
        relative: true,
      })}
    >
      <ShameButton
        isDark
        aria-controls={hiddenContentId}
        aria-expanded={showHidden}
        onClick={() => {
          setShowHidden(!showHidden);
        }}
      >
        <span data-testid="current-manifest" className={`btn__text`}>
          {buttonText}
        </span>
        <Icon name="chevron" />
      </ShameButton>
      <HiddenContent id={hiddenContentId} hidden={!showHidden}>
        <SpacingComponent>
          <ul className="no-margin no-padding plain-list">
            {manifests.map((manifest, i) => (
              <li key={manifest['@id']}>
                <NextLink
                  {...itemLink({
                    workId,
                    langCode: lang,
                    manifest: i + 1,
                  })}
                >
                  <a aria-current={i === manifestIndex ? 'page' : undefined}>
                    {manifest.label}
                  </a>
                </NextLink>
              </li>
            ))}
          </ul>
        </SpacingComponent>
      </HiddenContent>
    </div>
  );
};

export default MultipleManifestList;
