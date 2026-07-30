import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import { volumesNavigationLabel } from '@weco/content/text/aria-labels';
import { getMultiVolumeLabel } from '@weco/content/utils/iiif/v3';
import { toWorksItemLink } from '@weco/content/views/components/ItemLink';
import { queryParamToArrayIndex } from '@weco/content/views/pages/works/work/work.helpers';

import { Item, List } from './ViewerStructures';

const MultipleManifestList: FunctionComponent = () => {
  const { parentManifest, work, query, setIsMobileSidebarActive } =
    useItemViewerContext();
  const manifests = parentManifest?.canvases || [];

  return (
    <nav>
      <List aria-label={volumesNavigationLabel}>
        {manifests.map((manifest, i) => {
          const isActiveManifest = i === queryParamToArrayIndex(query.manifest);
          return (
            <Item key={manifest.id} $isActive={isActiveManifest}>
              <NextLink
                data-gtm-trigger="volumes_nav_link"
                {...toWorksItemLink({
                  workId: work.id,
                  props: {
                    canvas: 1,
                    query: query.query,
                    manifest: i + 1,
                  },
                })}
                aria-current={isActiveManifest ? 'page' : undefined}
                onClick={() => {
                  setIsMobileSidebarActive(false);
                }}
                replace
              >
                {(manifest.label &&
                  getMultiVolumeLabel(manifest.label, work?.title || '')) ||
                  'Unknown'}
              </NextLink>
            </Item>
          );
        })}
      </List>
    </nav>
  );
};

export default MultipleManifestList;
