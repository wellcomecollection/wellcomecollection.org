import { useContext, FunctionComponent } from 'react';
import NextLink from 'next/link';
import { itemLink } from '@weco/common/services/catalogue/routes';
import ItemViewerContext from '@weco/common/views/components/ItemViewerContext/ItemViewerContext';
import { classNames } from '@weco/common/utils/classnames';
import { volumesNavigationLabel } from '@weco/common/text/arial-labels';

const MultipleManifestListPrototype: FunctionComponent = () => {
  const { parentManifest, work, lang, manifestIndex } =
    useContext(ItemViewerContext);
  return (
    <ul
      className="no-margin no-padding plain-list"
      role="navigation"
      aria-label={volumesNavigationLabel}
    >
      {parentManifest?.manifests.map((manifest, i) => (
        <li key={manifest['@id']}>
          <NextLink
            {...itemLink({
              workId: work.id,
              langCode: lang,
              manifest: i + 1,
              canvas: 1,
            })}
          >
            <a
              className={classNames({
                'font-yellow': i === manifestIndex,
              })}
              aria-current={i === manifestIndex ? 'page' : undefined}
            >
              {manifest.label}
            </a>
          </NextLink>
        </li>
      ))}
    </ul>
  );
};

export default MultipleManifestListPrototype;
