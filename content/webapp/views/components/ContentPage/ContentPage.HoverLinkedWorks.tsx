import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { ContentApiLinkedWork } from '@weco/content/services/wellcome/content/types/api';
import RelatedWorksCard from '@weco/content/views/components/RelatedWorksCard';

type Props = {
  linkedWorks: ContentApiLinkedWork[];
};

const HoverLinkedWorks: FunctionComponent<Props> = ({ linkedWorks }: Props) => {
  const hasLinkedWorks = linkedWorks && linkedWorks.length > 0;

  const [portals, setPortals] = useState<NodeListOf<HTMLElement> | null>(null);

  useEffect(() => {
    const updatePortals = () => {
      window.requestAnimationFrame(() => {
        setPortals(document.querySelectorAll(`[data-portal-id]`));
      });
    };

    updatePortals();

    const observer = new MutationObserver(mutations => {
      const hasNewNodes = mutations.some(
        mutation =>
          mutation.type === 'childList' &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
      );

      if (hasNewNodes) {
        updatePortals();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [linkedWorks]);

  if (!hasLinkedWorks) return null;

  return (
    <>
      {linkedWorks.map(work => {
        const portalsForWork =
          portals && [...portals].filter(p => p.dataset.portalId === work.id);

        return (
          <Fragment key={work.id}>
            {portalsForWork?.map((p, i) => {
              return createPortal(
                <RelatedWorksCard
                  variant="hover"
                  work={work}
                  key={`${work.id}-${p.dataset.portalId}-${i}`}
                />,
                p
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
};

export default HoverLinkedWorks;
