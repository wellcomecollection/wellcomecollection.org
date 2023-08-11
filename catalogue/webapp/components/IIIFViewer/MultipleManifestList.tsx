import { useContext, FunctionComponent } from 'react';
import NextLink from 'next/link';
import { toLink as itemLink } from '../ItemLink';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { volumesNavigationLabel } from '@weco/common/text/aria-labels';
import {
  getMultiVolumeLabel,
  getCollectionManifests,
} from '@weco/catalogue/utils/iiif/v3';
import { queryParamToArrayIndex } from '.';
import {
  List,
  Item,
} from '@weco/catalogue/components/IIIFViewer/ViewerStructures';

const MultipleManifestList: FunctionComponent = () => {
  const { parentManifest, work, query, setIsMobileSidebarActive } =
    useContext(ItemViewerContext);
  const manifests = parentManifest
    ? getCollectionManifests(parentManifest)
    : [];

  return (
    <nav>
      <List aria-label={volumesNavigationLabel}>
        {manifests.map((manifest, i) => (
          <Item
            key={manifest.id}
            isActive={i === queryParamToArrayIndex(query.manifest)}
          >
            <NextLink
              replace={true}
              {...itemLink({
                workId: work.id,
                props: {
                  canvas: 1,
                  query: query.query,
                  manifest: i + 1,
                },
                source: 'manifests_navigation',
              })}
              passHref={true}
              legacyBehavior
            >
              <a
                data-gtm-trigger="volumes_nav_link"
                aria-current={
                  i === queryParamToArrayIndex(query.manifest)
                    ? 'page'
                    : undefined
                }
                onClick={() => {
                  setIsMobileSidebarActive(false);
                }}
              >
                {(manifest?.label &&
                  getMultiVolumeLabel(manifest.label, work?.title || '')) ||
                  'Unknown'}
              </a>
            </NextLink>
          </Item>
        ))}
      </List>
    </nav>
  );
};

export default MultipleManifestList;
