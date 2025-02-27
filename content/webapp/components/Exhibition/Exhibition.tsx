import * as prismic from '@prismicio/client';
import NextLink from 'next/link';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { a11y } from '@weco/common/data/microcopy';
import {
  a11Y,
  a11YVisual,
  accessibility,
  britishSignLanguageTranslation,
  calendar,
  clock,
  IconSvg,
  location,
  ticket,
} from '@weco/common/icons';
import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font, grid } from '@weco/common/utils/classnames';
import { isFuture, isPast } from '@weco/common/utils/dates';
import { formatDate } from '@weco/common/utils/format-date';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import Accordion from '@weco/content/components/Accordion/Accordion';
import Body from '@weco/content/components/Body/Body';
import BslLeafletVideo from '@weco/content/components/BslLeafletVideo';
import Contact from '@weco/content/components/Contact/Contact';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import Contributors from '@weco/content/components/Contributors/Contributors';
import DateRange from '@weco/content/components/DateRange/DateRange';
import InfoBox from '@weco/content/components/InfoBox/InfoBox';
import SearchResults from '@weco/content/components/SearchResults/SearchResults';
import StatusIndicator from '@weco/content/components/StatusIndicator/StatusIndicator';
import { LabelField } from '@weco/content/model/label-field';
import { fetchExhibitionRelatedContentClientSide } from '@weco/content/services/prismic/fetch/exhibitions';
import { EventBasic } from '@weco/content/types/events';
import {
  ExhibitionAbout,
  Exhibition as ExhibitionType,
} from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';
import { Page as PageType } from '@weco/content/types/pages';
import {
  getFeaturedMedia,
  getHeroPicture,
} from '@weco/content/utils/page-header';

type ExhibitionItem = LabelField & {
  icon?: IconSvg;
};

function getUpcomingExhibitionObject(
  exhibition: ExhibitionType
): ExhibitionItem | undefined {
  return isFuture(exhibition.start)
    ? {
        description: [
          {
            type: 'paragraph',
            text: `Opening on ${formatDate(exhibition.start)}`,
            spans: [],
          },
        ],
        icon: calendar,
      }
    : undefined;
}

function getadmissionObject(): ExhibitionItem {
  return {
    description: [
      {
        type: 'paragraph',
        text: 'Free admission',
        spans: [],
      },
    ],
    icon: ticket,
  };
}

function getTodaysHoursObject(): ExhibitionItem {
  const todaysHoursText = 'Galleries open Tuesday–Sunday, Opening times';

  const link: prismic.RTLinkNode = {
    type: 'hyperlink',
    start: todaysHoursText.length - 'Opening times'.length,
    end: todaysHoursText.length,
    data: {
      link_type: 'Web',
      url: `/visit-us/${prismicPageIds.openingTimes}`,
    },
  };

  return {
    description: [
      {
        type: 'paragraph',
        text: todaysHoursText,
        spans: [link],
      },
    ],
    icon: clock,
  };
}

function getPlaceObject(
  exhibition: ExhibitionType
): ExhibitionItem | undefined {
  return (
    exhibition.place && {
      description: [
        {
          type: 'paragraph',
          text: `${exhibition.place.title}, level ${exhibition.place.level}`,
          spans: [],
        },
      ],
      icon: location,
    }
  );
}

const accessibilityItems: ExhibitionItem[] = [
  {
    description: [
      {
        type: 'paragraph',
        text: a11y.stepFreeAccess,
        spans: [],
      },
    ],
    icon: a11Y,
  },
  {
    description: [
      {
        type: 'paragraph',
        text: a11y.largePrintGuides,
        spans: [],
      },
    ],
    icon: a11YVisual,
  },
  {
    description: [
      {
        type: 'paragraph',
        text: a11y.bsl,
        spans: [],
      },
    ],
    icon: britishSignLanguageTranslation,
  },
  {
    description: [
      {
        type: 'paragraph',
        text: a11y.accessResources,
        spans: [],
      },
    ],
    icon: accessibility,
  },
];

export function getInfoItems(exhibition: ExhibitionType): ExhibitionItem[] {
  return [
    getUpcomingExhibitionObject(exhibition),
    getadmissionObject(),
    getTodaysHoursObject(),
    getPlaceObject(exhibition),
    ...accessibilityItems,
  ].filter(isNotUndefined);
}

export const AccessibilityServices = styled.p.attrs({
  className: font('intr', 5),
})`
  margin: 0;
`;

type Props = {
  exhibition: ExhibitionType;
  pages: PageType[];
  accessResourceLinks: (Link & { type: string })[];
  exhibitionTexts: ExhibitionTextsDocument[];
  exhibitionHighlightTours: ExhibitionHighlightToursDocument[];
};

const Exhibition: FunctionComponent<Props> = ({
  exhibition,
  pages,
  accessResourceLinks,
  exhibitionTexts,
  exhibitionHighlightTours,
}) => {
  type ExhibitionOf = (ExhibitionType | EventBasic)[];

  const [exhibitionOfs, setExhibitionOfs] = useState<ExhibitionOf>([]);
  const [exhibitionAbouts, setExhibitionAbouts] = useState<ExhibitionAbout[]>(
    []
  );
  const [isModalActive, setIsModalActive] = useState(false);

  const visualStoryLink = accessResourceLinks.find(
    link => link.type === 'visual-story'
  );

  const hasExhibitionTexts = exhibitionTexts.length > 0;
  const hasExhibitionHighlightTours = exhibitionHighlightTours.length > 0;

  // Theoretically, there could be multiple ExhibitionTexts and ExhibitionHighlightTours
  // attached to an exhibition, but in reality there is only one, so we just take the first
  // and create links to them.
  const exhibitionTextLink =
    hasExhibitionTexts && linkResolver(exhibitionTexts[0]);
  const bslTourLink =
    hasExhibitionHighlightTours &&
    linkResolver({
      ...exhibitionHighlightTours[0],
      highlightTourType: 'bsl',
    });
  const audioTourLink =
    hasExhibitionHighlightTours &&
    linkResolver({
      ...exhibitionHighlightTours[0],
      highlightTourType: 'audio',
    });

  // This contains all the possible content for the access section accordion
  // We then filter out content that isn't relevant, i.e. if there isn't a highlight tour attached to the exhibition
  const possibleExhibitionAccessContent = [
    {
      summary: 'Digital highlights tour',
      content: (
        <ul>
          <li>
            Find out more about the exhibition with our digital highlights tour,
            available in short audio clips with audio description and
            transcripts, or as BSL videos. It can be accessed on your own
            device, via handheld devices with tactile buttons, or on an iPad
            which you can borrow
          </li>
          {bslTourLink && (
            <li>
              <NextLink href={bslTourLink}>Watch BSL video tour</NextLink>
            </li>
          )}
          {audioTourLink && (
            <li>
              <NextLink href={audioTourLink}>
                Listen to audio tour with audio description
              </NextLink>
            </li>
          )}
        </ul>
      ),
    },
    {
      summary: 'BSL, transcripts and induction loops',
      content: (
        <ul>
          <li>Audiovisual content is available in BSL in the gallery</li>
          <li>
            Live BSL tours are available. See our exhibition events above for
            more information or contact us in advance to request a tour
          </li>
          {bslTourLink && (
            <li>
              <NextLink href={bslTourLink}>
                Watch BSL videos of the digital highlights tour on your own
                device
              </NextLink>
            </li>
          )}

          <li>
            <span id="transcript-link-text">
              Transcripts of all audiovisual content are available
            </span>{' '}
            in the gallery
            {exhibitionTextLink && (
              <>
                {` and `}
                <NextLink
                  id="transcript-link"
                  aria-labelledby="transcript-link-text transcript-link"
                  href={exhibitionTextLink}
                >
                  online
                </NextLink>
              </>
            )}
          </li>

          <li>All videos are subtitled</li>
          <li>
            There are fixed induction loops in the building and portable
            induction loops available to borrow
          </li>
        </ul>
      ),
    },
    {
      summary: 'Audio description and visual access',
      content: (
        <ul>
          {audioTourLink && (
            <li>
              <NextLink href={audioTourLink}>
                The digital highlights tour is available with audio description
              </NextLink>
            </li>
          )}
          {exhibitionTextLink && (
            <li>
              <NextLink href={exhibitionTextLink}>
                Access all the text from the exhibition on your own device
              </NextLink>
            </li>
          )}
          <li>
            A large-print guide and magnifiers are available in the gallery
          </li>
          <li>There is a tactile line on the gallery floor</li>
          <li>
            There are brighter and more even lighting conditions across the
            gallery during our Lights Up sessions.{' '}
            {exhibitionOfs.length > 0 && (
              <NextLink href="#events-list">
                See our exhibition events for more information and availability
              </NextLink>
            )}
          </li>
        </ul>
      ),
    },
    {
      summary: 'Wheelchair and physical access',
      content: (
        <ul>
          <li>Step-free access is available to all floors of the building</li>
          <li>
            We have a Changing Places toilet on level 0 and accessible toilets
            on all floors
          </li>
        </ul>
      ),
    },
    {
      summary: 'Sensory access',
      content: (
        <ul>
          <li>
            {visualStoryLink ? (
              <>
                <NextLink href={visualStoryLink?.url}>
                  A visual story with a sensory map is available online
                </NextLink>{' '}
                and
              </>
            ) : (
              'A visual story with a sensory map is available '
            )}{' '}
            in the building at the start of the exhibition
          </li>
          <li>
            You can borrow tinted glasses, tinted visors, ear defenders and
            weighted lap pads. Please speak to a member of staff in the building
          </li>
          <li>
            Weekday mornings and Thursday evenings are usually the quietest
            times to visit
          </li>
          <li>
            Additional support is available during our Relaxed Openings.{' '}
            {exhibitionOfs.length > 0 && (
              <NextLink href="#events-list">
                See our exhibition events for more information and availability
              </NextLink>
            )}
          </li>
        </ul>
      ),
    },
  ];

  const accordionContent = possibleExhibitionAccessContent.filter(section => {
    // If there is no digital highlights tour attached to the exhibition, we want to remove
    // the section about the digital highlights tour
    return !(
      section.summary === 'Digital highlights tour' &&
      !hasExhibitionHighlightTours
    );
  });

  useEffect(() => {
    const ids = exhibition.relatedIds;

    fetchExhibitionRelatedContentClientSide(ids).then(relatedContent => {
      if (isNotUndefined(relatedContent)) {
        setExhibitionOfs(relatedContent.exhibitionOfs);
        setExhibitionAbouts(relatedContent.exhibitionAbouts);
      }
    });
  }, []);

  const breadcrumbs = {
    items: [
      {
        url: '/exhibitions',
        text: 'Exhibitions',
      },
      {
        url: linkResolver(exhibition),
        text: exhibition.title,
        isHidden: true,
      },
    ],
  };

  const DateInfo = exhibition.end ? (
    <DateRange start={exhibition.start} end={exhibition.end} />
  ) : (
    <HTMLDate date={exhibition.start} />
  );

  // This is for content that we don't have the crops for in Prismic
  const maybeHeroPicture = getHeroPicture(exhibition);
  const maybeFeaturedMedia = !maybeHeroPicture
    ? getFeaturedMedia(exhibition)
    : undefined;

  const Header = (
    <>
      <PageHeader
        breadcrumbs={breadcrumbs}
        labels={{ labels: exhibition.labels }}
        title={exhibition.title}
        ContentTypeInfo={
          <Fragment>
            {!exhibition.isPermanent && (
              <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
                {DateInfo}
              </Space>
            )}
            <StatusIndicator
              start={exhibition.start}
              end={exhibition.end || new Date()}
              statusOverride={exhibition.statusOverride}
            />
          </Fragment>
        }
        FeaturedMedia={maybeFeaturedMedia}
        HeroPicture={maybeHeroPicture}
        isFree={true}
        isContentTypeInfoBeforeMedia={true}
      />
      {exhibition.bslLeafletVideo && (
        <BslLeafletVideo
          video={exhibition.bslLeafletVideo}
          isModalActive={isModalActive}
          setIsModalActive={setIsModalActive}
        />
      )}
    </>
  );

  const exhibitionFormat =
    !exhibition.format || exhibition.format?.title === 'Permanent exhibition'
      ? 'Exhibition'
      : exhibition.format.title;

  return (
    <ContentPage
      id={exhibition.id}
      Header={Header}
      Body={
        <Body
          untransformedBody={exhibition.untransformedBody}
          pageId={exhibition.id}
        />
      }
      seasons={exhibition.seasons}
      // We hide contributors as we show them further up the page
      hideContributors={true}
    >
      <>
        {exhibition.end && !isPast(exhibition.end) && (
          <InfoBox title="Visit us" items={getInfoItems(exhibition)}>
            <AccessibilityServices>
              For more information, please visit our{' '}
              <a href={`/visit-us/${prismicPageIds.access}`}>Accessibility</a>{' '}
              page. If you have any queries about accessibility, please email us
              at{' '}
              <a href="mailto:access@wellcomecollection.org">
                access@wellcomecollection.org
              </a>{' '}
              or call{' '}
              {/*
                  This is to ensure phone numbers are read in a sensible way by
                  screen readers.
                */}
              <span className="visually-hidden">
                {createScreenreaderLabel('020 7611 2222')}
              </span>
              <span aria-hidden="true">020&nbsp;7611&nbsp;2222.</span>
            </AccessibilityServices>
          </InfoBox>
        )}

        {(exhibitionOfs.length > 0 || pages.length > 0) && (
          <Space
            $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
          >
            <SearchResults
              id="events-list"
              items={[...exhibitionOfs, ...pages]}
              title={`In this ${exhibitionFormat.toLowerCase()}`}
            />
          </Space>
        )}

        {exhibition.end && !isPast(exhibition.end) && (
          <>
            <div className="grid">
              <div className={grid({ s: 12 })}>
                <Space
                  as="h2"
                  className={font('wb', 3)}
                  $v={{
                    size: 'l',
                    properties: ['margin-top', 'margin-bottom'],
                  }}
                >
                  Access resources
                </Space>
              </div>
            </div>

            {visualStoryLink && (
              <>
                <h3 className={font('intb', 4)}>Plan your visit</h3>
                <NextLink href={visualStoryLink.url}>
                  Exhibition visual story
                </NextLink>{' '}
                <Space as="p" $v={{ size: 'm', properties: ['margin-top'] }}>
                  This visual story provides images and information to help you
                  plan and prepare for your visit to the exhibition.
                </Space>
              </>
            )}

            <h3 className={font('intb', 4)}>{`When you're here`}</h3>
            <p>
              Resources designed to support your visit are available online and
              in the gallery.
            </p>
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <Accordion id="access-resources" items={accordionContent} />
            </Space>
            <Space
              as="h3"
              className={font('intb', 4)}
              $v={{ size: 'l', properties: ['margin-bottom'] }}
            >
              Access information and queries
            </Space>
            <Contact
              link={{
                text: 'Visit our accessibility page ',
                url: '/visit-us/accessibility',
              }}
              phone="020 7611 2222"
              email="access@wellcomecollection.org"
            />
          </>
        )}

        {exhibitionAbouts.length > 0 && (
          <Space
            $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
          >
            <SearchResults items={exhibitionAbouts} title="Related stories" />
          </Space>
        )}

        {exhibition.contributors.length > 0 && (
          <Contributors contributors={exhibition.contributors} />
        )}
      </>
    </ContentPage>
  );
};
export default Exhibition;
