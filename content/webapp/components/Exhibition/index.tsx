import * as prismic from '@prismicio/client';
import NextLink from 'next/link';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { a11y } from '@weco/common/data/microcopy';
import {
  a11YVisual,
  accessibility,
  accessible,
  arrow,
  bslSquare,
  calendar,
  clock,
  download,
  IconSvg,
  location,
  ticket,
} from '@weco/common/icons';
import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import { isFuture, isPast } from '@weco/common/utils/dates';
import { formatDate } from '@weco/common/utils/format-date';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getBreadcrumbItems } from '@weco/common/views/components/Breadcrumb';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import Icon from '@weco/common/views/components/Icon';
import PageHeader from '@weco/common/views/components/PageHeader';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import Accordion from '@weco/content/components/Accordion';
import Body from '@weco/content/components/Body';
import BslLeafletVideo from '@weco/content/components/BslLeafletVideo';
import Contact from '@weco/content/components/Contact';
import ContentPage from '@weco/content/components/ContentPage';
import Contributors from '@weco/content/components/Contributors';
import DateRange from '@weco/content/components/DateRange';
import { defaultSerializer } from '@weco/content/components/HTMLSerializers';
import InfoBox from '@weco/content/components/InfoBox';
import SearchResults from '@weco/content/components/SearchResults';
import StatusIndicator from '@weco/content/components/StatusIndicator';
import {
  ResourceLink,
  ResourceLinkIconWrapper,
  ResourcesItem,
  ResourcesList,
} from '@weco/content/components/styled/AccessResources';
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

function getBorderColor({
  type,
  i,
}: {
  type?: string;
  i: number;
}): PaletteColor {
  if (type === 'visual-story') {
    return 'accent.turquoise';
  } else if (type === 'exhibition-guide') {
    return 'accent.salmon';
  } else if (i % 2 === 0) {
    return 'accent.blue';
  } else {
    return 'accent.purple';
  }
}

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
function getAccessibilityItems(): ExhibitionItem[] {
  const accessibilityItems: {
    description: prismic.RichTextField;
    icon: IconSvg;
  }[] = [
    {
      description: [
        {
          type: 'paragraph',
          text: a11y.stepFreeAccess,
          spans: [],
        },
      ],
      icon: accessible,
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
      icon: bslSquare,
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

  return accessibilityItems.filter(item => {
    if (item.description[0] && 'text' in item.description[0]) {
      return item.description[0]?.text !== a11y.largePrintGuides;
    } else {
      return true;
    }
  });
}

export function getInfoItems(exhibition: ExhibitionType): ExhibitionItem[] {
  return [
    getUpcomingExhibitionObject(exhibition),
    getadmissionObject(),
    getTodaysHoursObject(),
    getPlaceObject(exhibition),
    ...getAccessibilityItems(),
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
      gtmHook: 'digital_highlights_tour',
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
      gtmHook: 'bsl_transcripts_and_induction_loops',
      summary: 'BSL, transcripts and induction loops',
      content: (
        <ul>
          <li>BSL content is available in the gallery</li>
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
      gtmHook: 'audio_description_and_visual_access',
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
        </ul>
      ),
    },
    {
      gtmHook: 'wheelchair_and_physical_access',
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
      gtmHook: 'sensory_access',
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

  const extraBreadcrumbs = [
    {
      url: '/exhibitions',
      text: 'Exhibitions',
    },
    {
      url: linkResolver(exhibition),
      text: exhibition.title,
      isHidden: true,
    },
  ];

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

  const hasResources = Boolean(
    exhibition.accessResourcesText ||
      exhibition.accessResourcesPdfs.length > 0 ||
      accessResourceLinks.length > 0
  );

  const Header = (
    <>
      <PageHeader
        breadcrumbs={getBreadcrumbItems('whats-on', extraBreadcrumbs)}
        labels={{ labels: exhibition.labels }}
        title={exhibition.title}
        fullWidth={true}
        ContentTypeInfo={
          <>
            {!exhibition.isPermanent && (
              <Space
                $v={{ size: 'xs', properties: ['margin-bottom'] }}
                style={{ display: 'flex', flexWrap: 'wrap' }}
              >
                <Space $h={{ size: 'm', properties: ['margin-right'] }}>
                  {DateInfo}
                </Space>
                <StatusIndicator
                  start={exhibition.start}
                  end={exhibition.end || new Date()}
                  statusOverride={exhibition.statusOverride}
                  isLarge={true}
                />
              </Space>
            )}
          </>
        }
        FeaturedMedia={maybeFeaturedMedia}
        HeroPicture={maybeHeroPicture}
        isFree={true}
        isContentTypeInfoBeforeMedia={true}
        includeAccessibilityProvision={true}
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
      {exhibition.uid !== 'being-human' ? (
        <>
          {exhibition.end && !isPast(exhibition.end) && (
            <InfoBox title="Visit us" items={getInfoItems(exhibition)} />
          )}

          {(exhibitionOfs.length > 0 || pages.length > 0) && (
            <Space
              $v={{ size: 'xl', properties: ['margin-top', 'margin-bottom'] }}
            >
              <SearchResults
                id="events-list"
                items={[...exhibitionOfs, ...pages]}
                title={`${exhibitionFormat} events`}
              />
            </Space>
          )}

          {exhibition.end && !isPast(exhibition.end) && (
            <>
              <Grid>
                <GridCell $sizeMap={{ s: [12] }}>
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
                </GridCell>
              </Grid>

              {visualStoryLink && (
                <>
                  <h3 className={font('intb', 4)}>Plan your visit</h3>
                  <NextLink href={visualStoryLink.url}>
                    Exhibition visual story
                  </NextLink>{' '}
                  <Space as="p" $v={{ size: 'm', properties: ['margin-top'] }}>
                    This visual story provides images and information to help
                    you plan and prepare for your visit to the exhibition.
                  </Space>
                </>
              )}

              <h3 className={font('intb', 4)}>{`When you're here`}</h3>
              <p>
                Resources designed to support your visit are available online
                and in the gallery.
              </p>
              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <Accordion id="access-resources" items={accordionContent} />
              </Space>
              <Space
                as="h3"
                className={font('intb', 4)}
                $v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                Access information, tours and queries
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
      ) : (
        <>
          {hasResources && (
            <>
              <Space
                as="h2"
                $v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('wb', 3)}
              >{`${exhibitionFormat} access content`}</Space>
              {(accessResourceLinks.length > 0 ||
                exhibition.accessResourcesPdfs.length > 0) && (
                <Space $v={{ size: 'xl', properties: ['padding-bottom'] }}>
                  <ResourcesList>
                    {accessResourceLinks.map((link, i) => {
                      const borderColor = getBorderColor({
                        type: link.type,
                        i,
                      });
                      return (
                        <ResourcesItem key={link.url}>
                          <ResourceLink
                            key={i}
                            href={link.url}
                            $borderColor={borderColor}
                          >
                            {link.type === 'exhibition-guide' && (
                              <h3 className={font('intb', 4)}>
                                Digital exhibition guide
                              </h3>
                            )}
                            {link.type === 'visual-story' && (
                              <h3 className={font('intb', 4)}>Visual story</h3>
                            )}
                            <span className={font('intr', 6)}>{link.text}</span>
                            <ResourceLinkIconWrapper>
                              <Icon icon={arrow} />
                            </ResourceLinkIconWrapper>
                          </ResourceLink>
                        </ResourcesItem>
                      );
                    })}
                    {exhibition.accessResourcesPdfs.map((pdf, i) => {
                      const borderColor = getBorderColor({
                        type: undefined,
                        i,
                      });
                      return (
                        <ResourcesItem key={pdf.url}>
                          <ResourceLink
                            key={i}
                            href={pdf.url}
                            $borderColor={borderColor}
                            $underlineText={true}
                          >
                            <span className={font('intr', 5)}>
                              {`${pdf.text} PDF`} {`(${pdf.size}kb)`}
                            </span>
                            <ResourceLinkIconWrapper>
                              <Icon icon={download} />
                            </ResourceLinkIconWrapper>
                          </ResourceLink>
                        </ResourcesItem>
                      );
                    })}
                  </ResourcesList>
                </Space>
              )}
              {exhibition.accessResourcesText && (
                <PrismicHtmlBlock
                  html={exhibition.accessResourcesText}
                  htmlSerializer={defaultSerializer}
                />
              )}
            </>
          )}

          {exhibition.contributors.length > 0 && (
            <Contributors contributors={exhibition.contributors} />
          )}

          {(exhibitionOfs.length > 0 || pages.length > 0) && (
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <SearchResults
                id="events-list"
                items={[...exhibitionOfs, ...pages]}
                title={`${exhibitionFormat} events`}
              />
            </Space>
          )}

          {exhibition.end && !isPast(exhibition.end) && (
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              <InfoBox title="Visit us" items={getInfoItems(exhibition)}>
                <AccessibilityServices>
                  For more information, please visit our{' '}
                  <a href={`/visit-us/${prismicPageIds.access}`}>
                    Accessibility
                  </a>{' '}
                  page. If you have any queries about accessibility, please
                  email us at{' '}
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
            </Space>
          )}

          {exhibitionAbouts.length > 0 && (
            <SearchResults items={exhibitionAbouts} title="Related stories" />
          )}
        </>
      )}
    </ContentPage>
  );
};
export default Exhibition;
