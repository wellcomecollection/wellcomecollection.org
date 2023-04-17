import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import cookies from '@weco/common/data/cookies';
import { getCookie, setCookie } from 'cookies-next';
import useIsomorphicLayoutEffect from '../../../hooks/useIsomorphicLayoutEffect';
import { Contributor, License } from '../../../model/catalogue';

export type ApiToolbarLink = {
  id: string;
  label: string;
  value?: string;
  link?: string;
};

const ToolbarContainer = styled.div<{ mini: boolean }>`
  display: ${props => (props.mini ? 'inline-block' : 'flex')};
  background-color: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
  z-index: 100;
`;

const LinkList = styled.ul.attrs({
  className: 'font-size-5',
})`
  display: flex;
  list-style: none;
  margin: 0;
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

export function setTzitzitParams({
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

  // We should not be using in copyright images in Stories.
  // TODO: Double check this is our policy with the Editorial team.
  if (licenceId === 'INC')
    return {
      id: 'tzitzit',
      label: '(no tzitzit, this image is in copyright)',
    };

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

export function createPrismicLink(prismicId: string): ApiToolbarLink {
  return {
    id: 'prismic',
    label: 'Edit in Prismic',
    link: `https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/${prismicId}/`,
  };
}

function getAnchorLinkUrls() {
  // This function currently only extracts the ids from h2, h3, and h4 tags
  const getAllHeadingIds = [...document.querySelectorAll('h2, h3, h4')].map(
    item => item.id
  );
  // This function extracts any data-toolbar-anchor divs with the view to extracting the id values
  // This can be used across the codebase (where data-toolbar-anchor is used) but at the moment is only used in audio & BSL guides
  // Please note: an audio/BSL guide must contain and audio or video file with an accompanying title or no id will exist
  // and no link will be created
  const extractedAudioBSLAttributes = [
    ...document.querySelectorAll('div[data-toolbar-anchor="apiToolbar"]'),
  ].map(item => item.id);

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

type Props = {
  links?: ApiToolbarLink[];
};

const ApiToolbar: FunctionComponent<Props> = ({ links = [] }) => {
  const [mini, setMini] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    setMini(getCookie(cookies.apiToolbarMini) === true);
  }, []);

  const propValue = (prop: ApiToolbarLink) => {
    return `${prop.label}${prop.value ? ` : ${prop.value}` : ''}`;
  };

  return (
    <ToolbarContainer mini={mini}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
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
            <LinkList>
              {links.map(prop => (
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
            </LinkList>
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
