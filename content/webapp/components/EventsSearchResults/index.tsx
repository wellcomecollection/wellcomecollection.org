import { FunctionComponent } from 'react';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import { font } from '@weco/common/utils/classnames';
import PrismicImage, {
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';
import { getCrop } from '@weco/common/model/image';
import { EventDocument } from '@weco/content/services/wellcome/content/types/api';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import {
  DesktopLabel,
  Details,
  EventWrapper,
  EventsContainer,
  ImageWrapper,
  MobileLabel,
} from './EventsSearchResults.styles';

type Props = {
  events: EventDocument[];
  dynamicImageSizes?: BreakpointSizes;
  isDetailed?: boolean;
};

const EventsSearchResults: FunctionComponent<Props> = ({
  events,
  dynamicImageSizes,
  isDetailed,
}: Props) => {
  return (
    <EventsContainer $isDetailed={isDetailed}>
      {events.map(event => {
        const image = transformImage(event.image);
        const croppedImage = getCrop(image, isDetailed ? '16:9' : '32:15');

        return (
          <EventWrapper
            key={event.id}
            as="a"
            href={linkResolver({ id: event.id, type: 'events' })}
            $isDetailed={isDetailed}
          >
            {croppedImage && (
              <ImageWrapper $isDetailed={isDetailed}>
                <PrismicImage
                  image={{
                    // We intentionally omit the alt text on promos, so screen reader
                    // users don't have to listen to the alt text before hearing the
                    // title of the item in the list.
                    //
                    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                    ...croppedImage,
                    alt: '',
                  }}
                  sizes={dynamicImageSizes}
                  quality="low"
                />
                <MobileLabel $isDetailed={isDetailed}>
                  <LabelsList labels={[{ text: event.format.label }]} />
                </MobileLabel>
              </ImageWrapper>
            )}
            <Details $isDetailed={isDetailed}>
              {isDetailed && (
                <DesktopLabel>
                  <LabelsList labels={[{ text: event.format.label }]} />
                </DesktopLabel>
              )}

              <h3 className={font('wb', 4)}>{event.title}</h3>

              {/* {isDetailed &&
                (event.publicationDate || !!event.contributors.length) && (
                  <EventInformation>
                    {event.publicationDate && (
                      <EventInformationItem className="searchable-selector">
                        <HTMLDate date={new Date(event.publicationDate)} />
                      </EventInformationItem>
                    )}
                    {!!event.contributors.length && (
                      <>
                        <EventInformationItemSeparator>
                          {' | '}
                        </EventInformationItemSeparator>
                        <EventInformationItem>
                          {event.contributors.map(contributor => (
                            <span key={contributor.contributor?.id}>
                              {contributor.contributor?.label}
                            </span>
                          ))}
                        </EventInformationItem>
                      </>
                    )}
                  </EventInformation>
                )} */}
            </Details>
          </EventWrapper>
        );
      })}
    </EventsContainer>
  );
};

export default EventsSearchResults;
