import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ParsedUrlQuery } from 'querystring';
import cookies from '@weco/common/data/cookies';
import { getCookie, setCookie } from 'cookies-next';
import useIsomorphicLayoutEffect from '../../../hooks/useIsomorphicLayoutEffect';
import {
  Work,
  Location,
  Image,
  Contributor,
  License,
} from '../../../model/catalogue';
import { looksLikePrismicId } from '../../../services/prismic';

export type ApiToolbarLink = {
  id: string;
  label: string;
  value?: string;
  link?: string;
};
const includes = [
  'identifiers',
  'images',
  'items',
  'subjects',
  'genres',
  'contributors',
  'production',
  'notes',
  'parts',
  'partOf',
  'precededBy',
  'succeededBy',
  'holdings',
];

const ToolbarContainer = styled.div`
  background-color: ${props => props.theme.color('accent.purple')};
  z-index: 100;
`;

/** tzitzit is a tool used by the Digital Editorial team to create TASL
 * strings for Prismic. https://github.com/wellcomecollection/tzitzit
 *
 * This creates a link to a tzitzit which is pre-filled with the catalogue
 * metadata for this image.  They may not want to use it directly
 * (e.g. they may tidy up the title), but it should save them some copy/pasting
 * from the catalogue.
 *
 */

function setTzitzitParams({
  title,
  sourceLink,
  licence,
  contributors,
}: {
  title: string;
  sourceLink: string;
  licence: License | undefined;
  contributors: Contributor[] | undefined;
}): ApiToolbarLink | undefined {
  const licenceId = licence?.id.toUpperCase();

  // We should not be using in copyright images in Stories
  if (licenceId === 'INC') return;

  const params = new URLSearchParams();
  params.set('title', title);
  params.set('sourceName', 'Wellcome Collection');
  params.set('sourceLink', sourceLink);
  if (licenceId) params.set('licence', licenceId);
  if (contributors && contributors.length > 0)
    params.set('author', contributors[0].agent.label);

  return {
    id: 'tzitzit',
    label: 'tzitzit',
    link: `https://s3-eu-west-1.amazonaws.com/tzitzit.wellcomecollection.org/index.html?${params.toString()}`,
  };
}

async function createTzitzitImageLink(
  imageId: string
): Promise<ApiToolbarLink | undefined> {
  const apiUrl = `https://api.wellcomecollection.org/catalogue/v2/images/${imageId}?include=source.contributors`;
  const image: Image = await fetch(apiUrl).then(res => res.json());

  return setTzitzitParams({
    title: image.source.title,
    sourceLink: window.location.toString(),
    licence: image.locations[0].license,
    contributors: image.source.contributors,
  });
}

async function createTzitzitWorkLink(
  workId: string
): Promise<ApiToolbarLink | undefined> {
  const apiUrl = `https://api.wellcomecollection.org/catalogue/v2/works/${workId}?include=items,contributors`;
  const work: Work = await fetch(apiUrl).then(res => res.json());

  // Look at digital item locations only
  const digitalLocation = work.items
    ?.map(item =>
      item.locations.find(location => location.type === 'DigitalLocation')
    )
    .find(i => i);

  return setTzitzitParams({
    title: work.title,
    sourceLink: window.location.toString(),
    licence:
      digitalLocation?.type === 'DigitalLocation'
        ? digitalLocation.license
        : undefined,
    contributors: work.contributors,
  });
}

function getAnchorLinkUrls() {
  // This function currently only extracts the ids from h2, h3, and h4 tags
  const getAllHeadingIds = [...document.querySelectorAll('h2, h3, h4')].map(
    item => item.id
  );
  // This function extracts any apiToolbar ids with the view to extracting the data-toolbar values
  // This can be used across the codebase (where apiToolbar id is used) but at the moment is only used in audio & BSL guides
  // Please note: an audio/BSL guide must contain and audio or video file with an accompanying title or no id will exist
  // and no link will be created
  const extractedAudioBSLAttributes = [
    ...document.querySelectorAll('#apiToolbar'),
  ].map(el => el.getAttribute('data-toolbar-anchor'));

  // Remove empty ids and then append them to the current url with # to
  // create the anchor link
  // e.g. weco.org/guides/exhibitions/YvUALRAAACMA2h8V/captions-and-transcripts#anchor-id
  const extractedHeadingIdURLs = getAllHeadingIds
    .filter(Boolean)
    .map(id => `${document.URL}#${id}`);
  const extractedAudioBSLURLs = extractedAudioBSLAttributes
    .filter(Boolean)
    .map(id => `${document.URL}#${id}`);
  const csvAsSingleColumn =
    extractedHeadingIdURLs.join('\n') + extractedAudioBSLURLs.join('\n');
  // Push the list of urls to the clipboard
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(csvAsSingleColumn).then(() => {
      alert('All anchor links on this page have been copied to clipboard!');
    });
  return alert(
    'The Clipboard API is not available. No anchor links have been copied.'
  );
}

function getRouteProps(path: string) {
  switch (path) {
    case '/work':
      return async (query: ParsedUrlQuery): Promise<ApiToolbarLink[]> => {
        const { id } = query;
        const apiUrl = `https://api.wellcomecollection.org/catalogue/v2/works/${id}?include=${includes}`;
        const work: Work = await fetch(apiUrl).then(res => res.json());

        const apiLink = {
          id: 'json',
          label: 'JSON',
          link: apiUrl,
        };

        const iiifItem = work.items
          ?.reduce((acc, item) => {
            return acc.concat(item.locations);
          }, [] as Location[])
          ?.find(location => location.locationType.id.startsWith('iiif'));

        const iiifLink = iiifItem &&
          iiifItem.type === 'DigitalLocation' && {
            id: 'iiif',
            label: 'IIIF',
            link: iiifItem.url,
          };

        const links = [
          apiLink,
          iiifLink,
          ...work.identifiers.map(id => ({
            id: id.value,
            label: id.identifierType.label,
            value: id.value,
          })),
        ].filter(Boolean) as ApiToolbarLink[];

        return links;
      };

    case '/image':
      return async (query: ParsedUrlQuery): Promise<ApiToolbarLink[]> => {
        const { id } = query;

        const tzitzitLink = await createTzitzitImageLink(id as string);

        return tzitzitLink ? [tzitzitLink] : [];
      };

    case '/item':
      return async (query: ParsedUrlQuery): Promise<ApiToolbarLink[]> => {
        const { workId } = query;

        const tzitzitLink = await createTzitzitWorkLink(workId as string);

        return tzitzitLink ? [tzitzitLink] : [];
      };
    default:
      return async (query: ParsedUrlQuery): Promise<ApiToolbarLink[]> => {
        const { id } = query;

        // On some Prismic pages, the ID will be in the query data, e.g. /events/YeViLhAAAJMQM7IY
        // will have the query {"id": "YeViLhAAAJMQM7IY"}
        //
        // If it looks like a Prismic ID, we can guess how to get to the page in Prismic.
        // This isn't perfect -- there may be cases where the link doesn't work (e.g. if it's
        // not actually a Prismic ID, or the page is unpublished) -- but hopefully something
        // that works 95% of the time is still useful.
        if (looksLikePrismicId(id)) {
          const prismicLink = {
            id: 'prismic',
            label: 'Prismic',
            link: `https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/${id}/`,
          };

          return [prismicLink];
        } else {
          return [];
        }
      };
  }
}

type Props = {
  extraLinks?: ApiToolbarLink[];
};

const ApiToolbar: FC<Props> = ({ extraLinks = [] }) => {
  const router = useRouter();
  const [links, setLinks] = useState<ApiToolbarLink[]>([]);
  const [mini, setMini] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    setMini(getCookie(cookies.apiToolbarMini) === true);
  }, []);

  useEffect(() => {
    const fn = getRouteProps(router.route);
    if (fn) {
      fn(router.query).then(setLinks);
    }
  }, [router.route, router.query]);

  const propValue = (prop: ApiToolbarLink) => {
    return `${prop.label}${prop.value ? ` : ${prop.value}` : ''}`;
  };

  return (
    <ToolbarContainer className={`font-white flex ${mini && 'inline-block'}`}>
      <div
        className="flex flex--v-center"
        style={{
          flexGrow: 1,
        }}
      >
        {!mini && (
          <>
            <span
              className="h3"
              style={{
                marginLeft: '10px',
              }}
            >
              API toolbar
            </span>
            <ul className="flex plain-list no-margin font-size-5">
              {extraLinks.concat(links).map(prop => (
                <li
                  key={prop.id}
                  style={{
                    paddingRight: '10px',
                    paddingLeft: '10px',
                    borderLeft: '1px solid #bcbab5',
                  }}
                >
                  {prop.link && <a href={prop.link}>{propValue(prop)}</a>}
                  {!prop.link && propValue(prop)}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <button
        className="plain-button"
        type="button"
        onClick={() => {
          getAnchorLinkUrls();
        }}
        style={{ padding: '10px' }}
      >
        <>⚓️</>
      </button>

      <button
        className="plain-button"
        type="button"
        onClick={() => {
          setMini(!mini);
          setCookie(cookies.apiToolbarMini, !mini, { path: '/' });
        }}
        style={{ padding: '10px' }}
      >
        {!mini && <>🤏</>}
        {mini && <>👐</>}
      </button>
    </ToolbarContainer>
  );
};

export default ApiToolbar;
