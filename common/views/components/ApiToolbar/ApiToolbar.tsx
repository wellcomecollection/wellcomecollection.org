import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import { ParsedUrlQuery } from 'querystring';
import cookies from 'next-cookies';
import useIsomorphicLayoutEffect from '../../../hooks/useIsomorphicLayoutEffect';
import { Work, Location } from '../../../model/catalogue';
import { looksLikePrismicId } from '../../../services/prismic';

type Prop = {
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

function getRouteProps(path: string) {
  switch (path) {
    case '/work':
      return async (query: ParsedUrlQuery): Promise<Prop[]> => {
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
        ].filter(Boolean) as Prop[];

        return links;
      };

    default:
      return async (query: ParsedUrlQuery): Promise<Prop[]> => {
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

const ApiToolbar: FunctionComponent = () => {
  const cookieName = 'apiToolbarMini';
  const router = useRouter();
  const [props, setProps] = useState<Prop[]>([]);
  const [mini, setMini] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    setMini(cookies({})[cookieName] === 'true');
  }, []);

  useEffect(() => {
    const fn = getRouteProps(router.route);
    if (fn) {
      fn(router.query).then(setProps);
    }
  }, [router.route, router.query]);

  const propValue = (prop: Prop) => {
    return `${prop.label}${prop.value ? ` : ${prop.value}` : ''}`;
  };

  return (
    <div
      className={`bg-purple font-white flex ${mini && 'inline-block'}`}
      style={{
        zIndex: 100,
      }}
    >
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
              {props.map(prop => (
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
          setMini(!mini);
          document.cookie = `${cookieName}=${!mini}; path=/`;
        }}
        style={{ padding: '10px' }}
      >
        {!mini && <>🤏</>}
        {mini && <>👐</>}
      </button>
    </div>
  );
};

export default ApiToolbar;
