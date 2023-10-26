import { FunctionComponent, useContext } from 'react';
import { font } from '@weco/common/utils/classnames';
import { toLink as worksLink } from '../WorksLink';
import { toLink as imagesLink } from '../ImagesLink';
import {
  getDigitalLocationInfo,
  getDigitalLocationOfType,
  getDownloadOptionsFromImageUrl,
  getHoldings,
  getItemsWithPhysicalLocation,
} from '../../utils/works';
import Space from '@weco/common/views/components/styled/Space';
import WorkDetailsSection from './WorkDetails.Section';
import WorkDetailsText from './WorkDetails.Text';
import WorkDetailsList from './WorkDetails.List';
import WorkDetailsTags from './WorkDetails.Tags';
import WhereToFindIt from './WorkDetails.WhereToFind';
import WorkDetailsHoldings from './WorkDetails.Holdings';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import { toLink as itemLink } from '../ItemLink';
import { toLink as conceptLink } from '../ConceptLink';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import { DigitalLocation } from '@weco/common/model/catalogue';
import {
  Work,
  toWorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import useTransformedManifest from '../../hooks/useTransformedManifest';
import useTransformedIIIFImage from '../../hooks/useTransformedIIIFImage';
import OnlineResources from './WorkDetails.OnlineResources';
import { themeValues } from '@weco/common/views/themes/config';
import { formatDuration } from '@weco/common/utils/format-date';
import { CopyUrl } from '@weco/content/components/CopyButtons';
import WorkDetailsAvailableOnline from './WorkDetails.AvailableOnline';
import IsArchiveContext from '@weco/content/components/IsArchiveContext/IsArchiveContext';

type Props = {
  work: Work;
  shouldShowItemLink: boolean;
};

const WorkDetails: FunctionComponent<Props> = ({
  work,
  shouldShowItemLink,
}: Props) => {
  const isArchive = useContext(IsArchiveContext);
  const transformedIIIFImage = useTransformedIIIFImage(toWorkBasic(work));
  const transformedIIIFManifest = useTransformedManifest(work);
  const {
    video,
    downloadEnabled,
    downloadOptions: manifestDownloadOptions,
    audio,
  } = { ...transformedIIIFManifest };

  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );

  // Works can have a DigitalLocation of type iiif-presentation and/or iiif-image.
  // For a iiif-presentation DigitalLocation we get the download options from the manifest to which it points.
  // For a iiif-image DigitalLocation we create the download options
  // from a combination of the DigitalLocation and the iiif-image json to which it points.
  // The json provides the image width and height used in the link text.
  // Since this isn't vital to rendering the links, the useTransformedIIIFImage hook
  // gets this data client side.
  const iiifImageLocationUrl = iiifImageLocation?.url;
  const iiifImageDownloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl({
        url: iiifImageLocationUrl,
        width: transformedIIIFImage?.width,
        height: transformedIIIFImage?.height,
      })
    : [];

  // Determine digital location. If the work has a iiif-presentation location and a iiif-image location
  // we use the former
  const digitalLocation: DigitalLocation | undefined =
    iiifPresentationLocation || iiifImageLocation;
  const digitalLocationInfo =
    digitalLocation && getDigitalLocationInfo(digitalLocation);

  // 'About this work' data
  const duration = work.duration && formatDuration(work.duration);

  // 'Identifiers' data
  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

  const issnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'issn';
  });

  const accessionNumberIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'wellcome-accession-number';
  });

  const hasIdentifiers =
    isbnIdentifiers.length > 0 ||
    issnIdentifiers.length > 0 ||
    accessionNumberIdentifiers.length > 0;

  const seriesPartOfs = work.partOf.filter(p => !p.id);

  const physicalItems = getItemsWithPhysicalLocation(work.items ?? []);

  const locationOfWork = work.notes.find(
    note => note.noteType.id === 'location-of-original'
  );
  const arrangementNote = work.notes.filter(
    note => note.noteType.id === 'arrangement-note'
  );
  const biographicalNote = work.notes.filter(
    note => note.noteType.id === 'biographical-note'
  );
  const relatedMaterial = work.notes.filter(
    note => note.noteType.id === 'related-material'
  );
  const acquisitionNote = work.notes.filter(
    note => note.noteType.id === 'acquisition-note'
  );

  const orderedNotes = [
    ...arrangementNote,
    ...acquisitionNote,
    ...biographicalNote,
    ...relatedMaterial,
  ];

  const remainingNotes = work.notes.filter(note => {
    return ![...orderedNotes, locationOfWork].some(n => n === note);
  });

  function determineDownloadVisibility(downloadEnabled: boolean | undefined) {
    if (digitalLocationInfo?.accessCondition === 'open-with-advisory') {
      return false;
    } else {
      return downloadEnabled !== undefined ? downloadEnabled : true;
    }
  }

  const holdings = getHoldings(work);

  const showAvailableOnlineSection =
    digitalLocation &&
    (shouldShowItemLink || (audio?.sounds || []).length > 0 || video);

  const renderContent = () => (
    <>
      {showAvailableOnlineSection && (
        <WorkDetailsAvailableOnline
          work={work}
          downloadOptions={[
            ...(manifestDownloadOptions || []),
            ...iiifImageDownloadOptions,
          ]}
          showDownloadOptions={determineDownloadVisibility(downloadEnabled)}
          itemUrl={itemLink({ workId: work.id, source: 'work', props: {} })}
          shouldShowItemLink={shouldShowItemLink}
          digitalLocationInfo={digitalLocationInfo}
          digitalLocation={digitalLocation}
          locationOfWork={locationOfWork}
        />
      )}

      <OnlineResources work={work} />

      {work.images && work.images.length > 0 && (
        <WorkDetailsSection headingText="Selected images from this work">
          <ButtonSolidLink
            dataGtmTrigger="view_selected_images"
            colors={themeValues.buttonColors.greenTransparentGreen}
            text={
              work.images.length > 1
                ? `View ${work.images.length} images`
                : 'View 1 image'
            }
            link={imagesLink(
              {
                query: work.id,
              },
              'work_details/images'
            )}
          />
        </WorkDetailsSection>
      )}

      <WorkDetailsSection headingText="About this work">
        {/*
          Note: although alternative titles sometimes contain angle brackets, it's
          normally used to denote a period of time, not HTML tags.

          e.g. Florida Historical Society quarterly, Apr. 1908-<July 1909>
        */}
        {work.alternativeTitles.length > 0 && (
          <WorkDetailsText
            title="Also known as"
            text={work.alternativeTitles}
          />
        )}

        {work.description && (
          <WorkDetailsText
            title="Description"
            html={work.description}
            allowDangerousRawHtml={true}
          />
        )}

        {/*
          Note: although production event labels sometimes contain angle brackets, it's
          normally used to denote a period of time, not HTML tags.

          e.g. London : County Council, 1900-<1983>
        */}
        {work.production.length > 0 && (
          <WorkDetailsText
            title="Publication/Creation"
            text={work.production.map(productionEvent => productionEvent.label)}
          />
        )}
        {work.currentFrequency && (
          <WorkDetailsText
            title="Current frequency"
            text={work.currentFrequency}
          />
        )}
        {work.formerFrequency.length > 0 && (
          <WorkDetailsText
            title="Former frequency"
            text={work.formerFrequency}
          />
        )}
        {work.designation.length > 0 && (
          <WorkDetailsText title="Designation" text={work.designation} />
        )}
        {work.physicalDescription && (
          <WorkDetailsText
            title="Physical description"
            html={work.physicalDescription}
            allowDangerousRawHtml={true}
          />
        )}
        {seriesPartOfs.length > 0 && (
          // Only show partOfs with no id here.
          // A partOf object with an id will be represented in
          // the archive hierarchy.
          // partOfs with no id are Series Links.
          <WorkDetailsTags
            title="Series"
            tags={seriesPartOfs.map(partOf => ({
              textParts: [partOf.title],
              linkAttributes: worksLink(
                {
                  'partOf.title': partOf.title,
                },
                'work_details/partOf'
              ),
            }))}
          />
        )}
        {work.contributors.length > 0 && (
          <WorkDetailsTags
            title="Contributors"
            tags={work.contributors.map(contributor => {
              const textParts = [
                contributor.agent.label,
                ...contributor.roles.map(role => role.label),
              ];
              /*
              If this is an identified contributor, link to the concepts prototype
              page instead.
              */
              return contributor.agent.id
                ? {
                    textParts,
                    linkAttributes: conceptLink(
                      { conceptId: contributor.agent.id },
                      'work_details/contributors'
                    ),
                  }
                : {
                    textParts,
                    linkAttributes: worksLink(
                      {
                        'contributors.agent.label': [contributor.agent.label],
                      },
                      'work_details/contributors'
                    ),
                  };
            })}
            separator=""
          />
        )}

        {orderedNotes.map(note => (
          <WorkDetailsText
            key={note.noteType.label}
            title={note.noteType.label}
            html={note.contents}
            allowDangerousRawHtml={true}
          />
        ))}

        {/*
          Note: although angle brackets are sometimes used in the lettering field,
          it's usually to denote missing or unclear text, not HTML.

          e.g. Patient <...>, sup<erior> mesenteric a<rtery>
          */}
        {work.lettering && (
          <WorkDetailsText title="Lettering" text={work.lettering} />
        )}

        {work.edition && (
          <WorkDetailsText title="Edition" text={work.edition} />
        )}

        {duration && <WorkDetailsText title="Duration" text={duration} />}

        {remainingNotes.map(note => (
          <WorkDetailsText
            key={note.noteType.label}
            title={note.noteType.label}
            html={note.contents}
            allowDangerousRawHtml={true}
          />
        ))}
        {/*
         A genre may be simple or compound.

         A simple genre contains just one concept in its concepts list,
         whereas a compound genre may contain many.

         In both cases, the first concept is the "important" one that
         should be used to link to a concepts page.

         Compound genres behave more like contributors than subjects.
         The additional information imparted by the subsequent concepts
         are more relevant to Genre as it relates to the Work in question
         than the Genre as its own thing.
         */}
        {work.genres.length > 0 && (
          <WorkDetailsTags
            title="Type/Technique"
            tags={work.genres.map(genre => {
              return {
                textParts: genre.concepts.map(c => c.label),

                linkAttributes: conceptLink(
                  { conceptId: genre.concepts[0].id as string },
                  'work_details/genres'
                ),
              };
            })}
          />
        )}

        {work.languages.length > 0 && (
          <WorkDetailsTags
            title="Languages"
            tags={work.languages.map(lang => {
              return {
                textParts: [lang.label],
                linkAttributes: worksLink(
                  {
                    languages: [lang.id],
                  },
                  'work_details/languages'
                ),
              };
            })}
          />
        )}
      </WorkDetailsSection>
      {work.subjects.length > 0 && (
        <WorkDetailsSection headingText="Subjects">
          <WorkDetailsTags
            tags={work.subjects.map(s => {
              /*
              If this is an identified subject, link to the concepts prototype
              page instead.
              */
              return s.id
                ? {
                    textParts: [s.concepts[0].label].concat(
                      s.concepts.slice(1).map(c => c.label)
                    ),
                    linkAttributes: conceptLink(
                      { conceptId: s.id },
                      'work_details/subjects'
                    ),
                  }
                : {
                    textParts: s.concepts.map(c => c.label),
                    linkAttributes: worksLink(
                      {
                        'subjects.label': [s.label],
                      },
                      'work_details/subjects'
                    ),
                  };
            })}
          />
        </WorkDetailsSection>
      )}

      {holdings && <WorkDetailsHoldings holdings={holdings} />}

      {(locationOfWork || physicalItems.length > 0) && (
        <WhereToFindIt
          work={work}
          locationOfWork={locationOfWork}
          physicalItems={physicalItems}
        />
      )}

      <WorkDetailsSection headingText="Permanent link">
        <div className={font('intr', 5)}>
          <CopyUrl url={`https://wellcomecollection.org/works/${work.id}`} />
        </div>
      </WorkDetailsSection>

      {hasIdentifiers && (
        <WorkDetailsSection headingText="Identifiers">
          {isbnIdentifiers.length > 0 && (
            <WorkDetailsList
              title="ISBN"
              list={isbnIdentifiers.map(id => id.value)}
            />
          )}
          {issnIdentifiers.length > 0 && (
            <WorkDetailsList
              title="ISSN"
              list={issnIdentifiers.map(id => id.value)}
            />
          )}
          {accessionNumberIdentifiers.length > 0 && (
            <WorkDetailsList
              title="Accession number"
              list={accessionNumberIdentifiers.map(id => id.value)}
            />
          )}
        </WorkDetailsSection>
      )}
    </>
  );

  return isArchive ? (
    <Space h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}>
      {renderContent()}
    </Space>
  ) : (
    <Layout10>{renderContent()}</Layout10>
  );
};

export default WorkDetails;
