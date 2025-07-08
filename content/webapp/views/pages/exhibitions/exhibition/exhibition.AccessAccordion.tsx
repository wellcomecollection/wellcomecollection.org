import NextLink from 'next/link';

import {
  ExhibitionHighlightToursDocument,
  ExhibitionTextsDocument,
} from '@weco/common/prismicio-types';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import Accordion from '@weco/content/views/components/Accordion';
import { Link } from '@weco/content/types/link';

const ExhibitionAccessAccordion = ({
  exhibitionTexts,
  exhibitionHighlightTours,
  visualStoryLink,
}: {
  exhibitionTexts: ExhibitionTextsDocument[];
  exhibitionHighlightTours: ExhibitionHighlightToursDocument[];
  visualStoryLink?: Link & { type: string };
}) => {
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

  // If there is no digital highlights tour attached to the exhibition, we want to remove
  // the section about the digital highlights tour
  const accordionContent = possibleExhibitionAccessContent.filter(section => {
    return !(
      section.summary === 'Digital highlights tour' &&
      !hasExhibitionHighlightTours
    );
  });

  return <Accordion id="access-resources" items={accordionContent} />;
};

export default ExhibitionAccessAccordion;
