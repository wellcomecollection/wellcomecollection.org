import styled from 'styled-components';
import { useContext, FunctionComponent } from 'react';
import NextLink from 'next/link';
import { itemLink } from '@weco/common/services/catalogue/routes';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { volumesNavigationLabel } from '@weco/common/text/aria-labels';

const Anchor = styled.a<{ isManifestIndex: boolean }>`
  ${props => props.isManifestIndex && `color: ${props.theme.color('yellow')};`};
`;

const MultipleManifestListPrototype: FunctionComponent = () => {
  const { parentManifest, work, lang, manifestIndex } =
    useContext(ItemViewerContext);
  return (
    <ul
      className="no-margin no-padding plain-list"
      role="navigation"
      aria-label={volumesNavigationLabel}
    >
      {parentManifest?.items.map((manifest, i) => (
        <li key={manifest.id}>
          <NextLink
            {...itemLink({
              workId: work.id,
              langCode: lang,
              manifest: i + 1,
              canvas: 1,
            })}
            passHref={true}
          >
            <Anchor
              isManifestIndex={i === manifestIndex}
              aria-current={i === manifestIndex ? 'page' : undefined}
            >
              {/* FIXME: en[1] here (also) feels mega-flakey */}
              {manifest?.label?.en?.[1] || 'Unknown'}
            </Anchor>
          </NextLink>
        </li>
      ))}
    </ul>
  );
};

export default MultipleManifestListPrototype;
