import styled from 'styled-components';
import { useContext, FunctionComponent } from 'react';
import NextLink from 'next/link';
import { itemLink } from '@weco/common/services/catalogue/routes';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { volumesNavigationLabel } from '@weco/common/text/aria-labels';
import { getMultiVolumeLabel } from '../../utils/iiif/v3';
import PlainList from '@weco/common/views/components/styled/PlainList';

const Anchor = styled.a<{ isManifestIndex: boolean }>`
  ${props => props.isManifestIndex && `color: ${props.theme.color('yellow')};`};
`;

const MultipleManifestListPrototype: FunctionComponent = () => {
  const { parentManifest, work, lang, manifestIndex } =
    useContext(ItemViewerContext);
  return (
    <nav>
      <PlainList aria-label={volumesNavigationLabel}>
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
              legacyBehavior>
              <Anchor
                isManifestIndex={i === manifestIndex}
                aria-current={i === manifestIndex ? 'page' : undefined}
              >
                {(manifest?.label &&
                  getMultiVolumeLabel(manifest.label, work?.title || '')) ||
                  'Unknown'}
              </Anchor>
            </NextLink>
          </li>
        ))}
      </PlainList>
    </nav>
  );
};

export default MultipleManifestListPrototype;
