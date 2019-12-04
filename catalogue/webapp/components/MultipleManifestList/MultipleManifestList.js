// @flow
import { useState, useRef, useEffect } from 'react';
import NextLink from 'next/link';
import { type SearchParams } from '@weco/common/services/catalogue/search-params';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { itemUrl } from '@weco/common/services/catalogue/urls';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';

const HiddenContent = styled.div.attrs(props => ({
  className: classNames({
    [font('hnm', 5)]: true,
  }),
}))`
  min-width: 200px;
  max-width: 100%;
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  border: ${props => `1px solid ${props.theme.colors.marble}`};
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  background: ${props => `${props.theme.colors.white}`};
  color: ${props => `${props.theme.colors.black}`};
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
    color: ${props => props.theme.colors.green};
    text-decoration: none;
  }
  .icon__canvas {
    height: 1.3em;
  }
  .icon__shape {
    fill: currentColor;
  }
`;

type Props = {|
  buttonText: string,
  manifests: IIIFManifest[],
  params: SearchParams,
  workId: string,
  lang: string,
|};

const MultipleManifestList = ({
  buttonText,
  manifests,
  params,
  workId,
  lang,
}: Props) => {
  const [showHidden, setShowHidden] = useState(false);
  const wrapperRef = useRef(null);
  const downloadText = useRef(null);
  useEffect(() => {
    window.document.addEventListener('click', handleClickOutside, false);
    return () => {
      window.document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowHidden(false);
    }
  };
  useEffect(() => {
    const links =
      downloadText &&
      downloadText.current &&
      downloadText.current.getElementsByTagName('a');
    if (links) {
      for (const link of links) {
        link.setAttribute('tabindex', showHidden ? '0' : '-1');
      }
    }
  }, [showHidden]);
  return (
    <div
      ref={wrapperRef}
      className={classNames({
        'inline-block': true,
        relative: true,
      })}
    >
      <Button
        extraClasses={classNames({
          relative: true,
          'btn--primary-black': true,
        })}
        icon="chevron"
        iconPosition="end"
        fontFamily="hnl"
        text={buttonText}
        ariaConftrols="hiddenContent"
        ariaExpfanded={showHidden}
        clickHandler={() => {
          setShowHidden(!showHidden);
        }}
      />
      <HiddenContent id="hiddenContent" hidden={!showHidden}>
        <SpacingComponent>
          <ul className="no-margin no-padding plain-list">
            {manifests.map((manifest, i) => (
              <li key={manifest['@id']}>
                <NextLink
                  {...itemUrl({
                    ...params,
                    workId,
                    page: 1,
                    sierraId: (manifest['@id'].match(/iiif\/(.*)\/manifest/) ||
                      [])[1],
                    langCode: lang,
                    canvas: 0,
                  })}
                >
                  <a>{manifest.label}</a>
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
