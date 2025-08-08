import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { volumesNavigationLabel } from '@weco/content/text/aria-labels';
import { getMultiVolumeLabel } from '@weco/content/utils/iiif/v3';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';

import { queryParamToArrayIndex } from '.';
import { Item, List } from './ViewerStructures';

const MultipleManifestList: FunctionComponent = () => {
  const { parentManifest, work, query, setIsMobileSidebarActive } =
    useItemViewerContext();
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
              {...toWorksItemLink({
                workId: work.id,
                props: {
                  canvas: 1,
                  query: query.query,
                  manifest: i + 1,
                },
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
