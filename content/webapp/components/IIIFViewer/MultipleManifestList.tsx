import NextLink from 'next/link';
import { FunctionComponent, useContext } from 'react';

import {
  Item,
  List,
} from '@weco/content/components/IIIFViewer/ViewerStructures';
import { toLink as itemLink } from '@weco/content/components/ItemLink';
import ItemViewerContext from '@weco/content/components/ItemViewerContext';
import { volumesNavigationLabel } from '@weco/content/text/aria-labels';
import { getMultiVolumeLabel } from '@weco/content/utils/iiif/v3';

import { queryParamToArrayIndex } from '.';

const MultipleManifestList: FunctionComponent = () => {
  const { parentManifest, work, query, setIsMobileSidebarActive } =
    useContext(ItemViewerContext);
  const manifests = parentManifest?.canvases || [];

  return (
    <nav>
      <List aria-label={volumesNavigationLabel}>
        {manifests.map((manifest, i) => (
          <Item
            key={manifest.id}
            $isActive={i === queryParamToArrayIndex(query.manifest)}
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
                {(manifest.label &&
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
