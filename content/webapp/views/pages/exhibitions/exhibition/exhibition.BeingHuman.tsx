// We should aim to delete this as soon as possible
// https://github.com/wellcomecollection/wellcomecollection.org/issues/11732
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { arrow, download } from '@weco/common/icons';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import { isPast } from '@weco/common/utils/dates';
import { createScreenreaderLabel } from '@weco/common/utils/telephone-numbers';
import { createDefaultSerializer } from '@weco/common/views/components/HTMLSerializers';
import Icon from '@weco/common/views/components/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import { EventBasic } from '@weco/content/types/events';
import {
  AboutThisExhibitionContent,
  Exhibition as ExhibitionType,
} from '@weco/content/types/exhibitions';
import { Link } from '@weco/content/types/link';
import { Page as PageType } from '@weco/content/types/pages';
import Contributors from '@weco/content/views/components/Contributors';
import InfoBox from '@weco/content/views/components/InfoBox';
import SearchResults from '@weco/content/views/components/SearchResults';
import {
  ResourceLink,
  ResourceLinkIconWrapper,
  ResourcesItem,
  ResourcesList,
} from '@weco/content/views/components/styled/AccessResources';

import { getInfoItems } from './exhibition.helpers';

type Props = {
  exhibition: ExhibitionType;
  relatedContent: (ExhibitionType | EventBasic | PageType)[];
  aboutThisExhibitionContent: AboutThisExhibitionContent[];
  accessResourceLinks: (Link & { type: string })[];
  exhibitionFormat: string;
};

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

const ExhibitionBeingHuman: FunctionComponent<Props> = ({
  exhibition,
  relatedContent,
  aboutThisExhibitionContent,
  accessResourceLinks,
  exhibitionFormat,
}) => {
  const { inGallery = false } = useToggles();
  const htmlSerializer = createDefaultSerializer(inGallery);

  const hasResources = Boolean(
    exhibition.accessResourcesText ||
    exhibition.accessResourcesPdfs.length > 0 ||
    accessResourceLinks.length > 0
  );

  return (
    <>
      {hasResources && (
        <>
          <Space
            as="h2"
            $v={{ size: 'sm', properties: ['margin-bottom'] }}
            className={font('brand-bold', 1)}
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
                          <h3 className={font('sans-bold', 0)}>
                            Digital exhibition guide
                          </h3>
                        )}
                        {link.type === 'visual-story' && (
                          <h3 className={font('sans-bold', 0)}>Visual story</h3>
                        )}
                        <span className={font('sans', -2)}>{link.text}</span>
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
                        <span className={font('sans', -1)}>
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
              htmlSerializer={htmlSerializer}
            />
          )}
        </>
      )}

      {exhibition.contributors.length > 0 && (
        <Contributors contributors={exhibition.contributors} />
      )}

      {relatedContent.length > 0 && (
        <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
          <SearchResults
            variant="default"
            id="events-list"
            items={relatedContent}
            title={`${exhibitionFormat} events`}
          />
        </Space>
      )}

      {exhibition.end && !isPast(exhibition.end) && (
        <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
          <InfoBox title="Visit us" items={getInfoItems(exhibition)}>
            <p className={font('sans', -1)} style={{ margin: 0 }}>
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
            </p>
          </InfoBox>
        </Space>
      )}

      {aboutThisExhibitionContent.length > 0 && (
        <SearchResults
          variant="default"
          items={aboutThisExhibitionContent}
          title="Related stories"
        />
      )}
    </>
  );
};

export default ExhibitionBeingHuman;
