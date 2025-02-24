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
  arrow,
  britishSignLanguageTranslation,
  calendar,
  clock,
  download,
  IconSvg,
  location,
  ticket,
} from '@weco/common/icons';
import { useToggles } from '@weco/common/server-data/Context';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font, grid } from '@weco/common/utils/classnames';
import { isFuture, isPast } from '@weco/common/utils/dates';
import { formatDate } from '@weco/common/utils/format-date';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import Icon from '@weco/common/views/components/Icon/Icon';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import Accordion from '@weco/content/components/Accordion/Accordion';
import Body from '@weco/content/components/Body/Body';
import Contact from '@weco/content/components/Contact/Contact';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import Contributors from '@weco/content/components/Contributors/Contributors';
import DateRange from '@weco/content/components/DateRange/DateRange';
import { defaultSerializer } from '@weco/content/components/HTMLSerializers/HTMLSerializers';
import InfoBox from '@weco/content/components/InfoBox/InfoBox';
import SearchResults from '@weco/content/components/SearchResults/SearchResults';
import StatusIndicator from '@weco/content/components/StatusIndicator/StatusIndicator';
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
function getAccessibilityItems(
  exhibitionAccessContent: boolean | undefined
): ExhibitionItem[] {
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
  if (exhibitionAccessContent) {
    return accessibilityItems.filter(item => {
      if (item.description[0] && 'text' in item.description[0]) {
        return item.description[0]?.text !== a11y.largePrintGuides;
      } else {
        return true;
      }
    });
  } else {
    return accessibilityItems.filter(item => {
      if (item.description[0] && 'text' in item.description[0]) {
        return (
          item.description[0]?.text !== a11y.bsl &&
          item.description[0]?.text !== a11y.accessResources
        );
      } else {
        return true;
      }
    });
  }
}

export function getInfoItems(
  exhibition: ExhibitionType,
  exhibitionAccessContent?: boolean
): ExhibitionItem[] {
  return [
    getUpcomingExhibitionObject(exhibition),
    getadmissionObject(),
    getTodaysHoursObject(),
    getPlaceObject(exhibition),
    ...getAccessibilityItems(exhibitionAccessContent),
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
};

const Exhibition: FunctionComponent<Props> = ({
  exhibition,
  pages,
  accessResourceLinks,
}) => {
  type ExhibitionOf = (ExhibitionType | EventBasic)[];

  const { exhibitionAccessContent } = useToggles();
  const [exhibitionOfs, setExhibitionOfs] = useState<ExhibitionOf>([]);
  const [exhibitionAbouts, setExhibitionAbouts] = useState<ExhibitionAbout[]>(
    []
  );

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

  const hasResources = Boolean(
    exhibition.accessResourcesText ||
      exhibition.accessResourcesPdfs.length > 0 ||
      accessResourceLinks.length > 0
  );

  const Header = (
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
      {hasResources && !exhibitionAccessContent && (
        <>
          <h2
            className={font('wb', 3)}
          >{`${exhibitionFormat} access content`}</h2>
          {(accessResourceLinks.length > 0 ||
            exhibition.accessResourcesPdfs.length > 0) && (
            <Space $v={{ size: 'l', properties: ['padding-bottom'] }}>
              <ResourcesList>
                {accessResourceLinks.map((link, i) => {
                  const borderColor = getBorderColor({ type: link.type, i });
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
                  const borderColor = getBorderColor({ type: undefined, i });
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
          {/* TODO improve styling of download links - defaultSerializer */}
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
        <SearchResults
          items={[...exhibitionOfs, ...pages]}
          title={`In this ${exhibitionFormat.toLowerCase()}`}
        />
      )}

      {exhibition.end && !isPast(exhibition.end) && (
        <InfoBox
          title="Visit us"
          items={getInfoItems(exhibition, exhibitionAccessContent)}
        >
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
      {exhibitionAbouts.length > 0 && (
        <SearchResults items={exhibitionAbouts} title="Related stories" />
      )}
      {exhibitionAccessContent && (
        <>
          <div className="grid">
            <div className={grid({ s: 12 })}>
              <Space
                as="h2"
                className={font('wb', 3)}
                $v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                Access resources
              </Space>
            </div>
          </div>
          <h3>Plan your visit</h3>
          <p>
            <a href="/">Exhibition visual story</a> This visual story provides
            images and information to help you plan and prepare for your visit
            to the exhibition.
          </p>
          <h3>{`When you're here`}</h3>
          <p>
            Resources designed to support your visit are available online and in
            the gallery.
          </p>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            {/* TODO get all the proper links */}
            {/* TODO clarify behaviour of accordion? */}
            <Accordion
              id="access-resources"
              items={[
                {
                  summary: 'Digital highlights tour',
                  content: (
                    <ul>
                      {/* TODO links */}
                      <li>
                        Find out more about the exhibition with our digital
                        highlights tour, available in short audio clips with
                        audio description and transcripts, or as BSL videos.It
                        can be accessed on your own device, via handheld devices
                        with tactile buttons, or on an iPad which you can borrow
                      </li>
                      <li>
                        <NextLink href="/">Watch BSL video tour</NextLink>
                      </li>
                      <li>
                        <NextLink href="/">
                          Listen to audio tour with audio description
                        </NextLink>
                      </li>
                    </ul>
                  ),
                },
                {
                  summary: 'BSL, transcripts and induction loops',
                  content: (
                    <ul>
                      {/* TODO links */}
                      <li>
                        Audiovisual content is available in BSL in the gallery
                      </li>
                      <li>
                        Live BSL tours are available. See our exhibition events
                        above for more information or contact us in advance to
                        request a tour
                      </li>
                      <li>
                        <NextLink href="/">
                          Watch BSL videos of the digital highlights tour on
                          your own device
                        </NextLink>
                      </li>
                      <li>
                        Transcripts of all audiovisual content are available in
                        the gallery and <NextLink href="/">online</NextLink>
                        {/* TODO labelled-by to give better link text */}
                      </li>
                      <li>All videos are subtitled</li>
                      <li>
                        There are fixed induction loops in the building and
                        portable induction loops available to borrow
                      </li>
                    </ul>
                  ),
                },
                {
                  summary: 'Audio description and visual access',
                  content: (
                    <ul>
                      {/* TODO links */}
                      <li>
                        <NextLink href="/">
                          The digital highlights tour is available with audio
                          description
                        </NextLink>
                      </li>
                      <li>
                        <NextLink href="/">
                          Access all the text from the exhibition on your own
                          device
                        </NextLink>
                      </li>
                      <li>
                        A large-print guide and magnifiers are available in the
                        gallery
                      </li>
                      <li>There is a tactile line on the gallery floor</li>
                      <li>
                        There are brighter and more even lighting conditions
                        across the gallery during our Lights Up sessions.{' '}
                        {/* TODO wording correct? why above? */}
                        {/* TODO should it link to filtered search? */}
                        <NextLink href="/">
                          For more information, find our exhibition events
                          above.
                        </NextLink>
                      </li>
                    </ul>
                  ),
                },
                {
                  summary: 'Wheelchair and physical access',
                  content: (
                    <ul>
                      Step-free access is available to all floors of the
                      building We have a Changing Places toilet on level 0 and
                      accessible toilets on all floors
                    </ul>
                  ),
                },
                {
                  summary: 'Sensory access',
                  content: (
                    <ul>
                      {/* TODO links */}
                      <NextLink href="/">
                        A visual story with a sensory map is available online
                      </NextLink>{' '}
                      and in the building at the start of the exhibition You can
                      borrow tinted glasses, tinted visors, ear defenders and
                      weighted lap pads. Please speak to a member of staff in
                      the building Weekday mornings and Thursday evenings are
                      usually the quietest times to visit Additional support is
                      available during our Relaxed Openings.{' '}
                      {/* TODO is this wording correct */}
                      {/* should it link to filtered search? */}
                      <NextLink href="/">
                        For more information, find our exhibition events above.
                      </NextLink>
                    </ul>
                  ),
                },
              ]}
            />
          </Space>
          <Space
            as="h3"
            className={font('intb', 3)}
            $v={{ size: 'l', properties: ['margin-bottom'] }}
          >
            Access information and queries
          </Space>
          <Contact
            title="Visitor experience"
            link={{
              text: 'Visit our accessibility page ',
              url: '/visit-us/accessibility',
            }}
            phone="020 7611 2222"
            email="access@wellcomecollection.org"
          />
        </>
      )}
    </ContentPage>
  );
};
export default Exhibition;
