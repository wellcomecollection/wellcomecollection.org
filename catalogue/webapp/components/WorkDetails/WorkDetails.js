// @flow
import moment from 'moment';
import { type IIIFManifest } from '@weco/common/model/iiif';
import { type Work } from '@weco/common/model/work';
import { font, grid, classNames } from '@weco/common/utils/classnames';
import { downloadUrl } from '@weco/common/services/catalogue/urls';
import { worksLink } from '@weco/common/services/catalogue/routes';
import {
  getDownloadOptionsFromImageUrl,
  getDigitalLocationOfType,
  getWorkIdentifiersWith,
  getEncoreLink,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import {
  getDownloadOptionsFromManifest,
  getIIIFPresentationCredit,
} from '@weco/common/utils/iiif';
import NextLink from 'next/link';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import Icon from '@weco/common/views/components/Icon/Icon';
import CopyUrl from '@weco/common/views/components/CopyUrl/CopyUrl';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import Download from '../Download/Download';
import WorkDetailsSection from '../WorkDetailsSection/WorkDetailsSection';
import WorkDetailsText from '../WorkDetailsText/WorkDetailsText';
import WorkDetailsList from '../WorkDetailsList/WorkDetailsList';
import WorkDetailsLinks from '../WorkDetailsLinks/WorkDetailsLinks';
import WorkDetailsTags from '../WorkDetailsTags/WorkDetailsTags';
import WorkItemsStatus from '../WorkItemsStatus/WorkItemsStatus';
import type { DigitalLocation } from '@weco/common/utils/works';

type Props = {|
  work: Work,
  iiifPresentationManifest: ?IIIFManifest,
  childManifestsCount: number,
  imageCount: number,
|};

const WorkDetails = ({
  work,
  iiifPresentationManifest,
  childManifestsCount,
  imageCount,
}: Props) => {
  // Determin digital location
  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const digitalLocation: ?DigitalLocation =
    iiifPresentationLocation || iiifImageLocation;

  // 'Available online' data
  const license =
    digitalLocation && getAugmentedLicenseInfo(digitalLocation.license);

  // iiif-presentation locations don't have credit info in the work API currently, so we try and get it from the manifest
  const credit =
    (digitalLocation && digitalLocation.credit) ||
    (iiifPresentationManifest &&
      getIIIFPresentationCredit(iiifPresentationManifest));

  const iiifImageLocationUrl = iiifImageLocation && iiifImageLocation.url;
  const iiifImageDownloadOptions = iiifImageLocationUrl
    ? getDownloadOptionsFromImageUrl(iiifImageLocationUrl)
    : [];
  const iiifPresentationDownloadOptions = iiifPresentationManifest
    ? getDownloadOptionsFromManifest(iiifPresentationManifest)
    : [];

  const downloadOptions = [
    ...iiifImageDownloadOptions,
    ...iiifPresentationDownloadOptions,
  ];

  // 'About this work' data
  const duration =
    work.duration && moment.utc(work.duration).format('HH:mm:ss');

  // 'Indentifiers' data
  const isbnIdentifiers = work.identifiers.filter(id => {
    return id.identifierType.id === 'isbn';
  });

  const sierraIdFromPresentationManifestUrl = // TODO replace with function created elsewhere
    iiifPresentationLocation &&
    (iiifPresentationLocation.url.match(/iiif\/(.*)\/manifest/) || [])[1];

  const sierraWorkIds = getWorkIdentifiersWith(work, {
    identifierId: 'sierra-system-number',
  });

  const sierraWorkId = sierraWorkIds.length >= 1 ? sierraWorkIds[0] : null;

  // We do not wish to display a link to the old library site if the new site
  // provides a digital representation of that work
  const shouldDisplayEncoreLink = !(
    sierraIdFromPresentationManifestUrl === sierraWorkId
  );
  const encoreLink =
    shouldDisplayEncoreLink && sierraWorkId && getEncoreLink(sierraWorkId);

  const locationOfWork = work.notes.find(
    note => note.noteType.id === 'location-of-original'
  );

  const WhereToFindIt = () => (
    <WorkDetailsSection headingText="Where to find it">
      {locationOfWork && (
        <WorkDetailsText
          title={locationOfWork.noteType.label}
          text={locationOfWork.contents}
        />
      )}

      {encoreLink && (
        <WorkDetailsText
          text={[`<a href="${encoreLink}">Wellcome library</a>`]}
        />
      )}

      <TogglesContext.Consumer>
        {({ stacksRequestService }) =>
          stacksRequestService && (
            <div className={`${font('hnl', 5)}`}>
              <WorkItemsStatus work={work} />
            </div>
          )
        }
      </TogglesContext.Consumer>
    </WorkDetailsSection>
  );

  return (
    <Space
      v={{
        size: 'xl',
        properties: ['padding-top', 'padding-bottom'],
      }}
      className={classNames({
        row: true,
      })}
    >
      <Layout12>
        {digitalLocation && (
          <WorkDetailsSection headingText="Available online">
            <p>
              Contains:{' '}
              {childManifestsCount > 0
                ? `${childManifestsCount} volumes`
                : imageCount > 0
                ? `${imageCount} ${imageCount === 1 ? 'image' : 'images'}`
                : ''}
            </p>

            <Download work={work} downloadOptions={downloadOptions} />
            {!(downloadOptions.length > 0) &&
              sierraIdFromPresentationManifestUrl &&
              childManifestsCount === 0 && (
                <SpacingSection>
                  <div
                    className={classNames({
                      grid: true,
                    })}
                  >
                    <div
                      className={classNames({
                        [grid({
                          s: 12,
                          m: 12,
                          l: 10,
                          xl: 10,
                        })]: true,
                      })}
                    >
                      <NextLink
                        {...downloadUrl({
                          workId: work.id,
                          sierraId: sierraIdFromPresentationManifestUrl,
                        })}
                      >
                        <a>Download options</a>
                      </NextLink>
                    </div>
                  </div>
                </SpacingSection>
              )}

            {license && (
              <div key={license.url}>
                {license.humanReadableText.length > 0 && (
                  <WorkDetailsText
                    title="License information"
                    text={license.humanReadableText}
                  />
                )}
                <WorkDetailsText
                  title="Credit"
                  text={[
                    `${work.title.replace(/\.$/g, '')}.${' '}
                ${
                  credit
                    ? `Credit: <a href="https://wellcomecollection.org/works/${work.id}">${credit}</a>. `
                    : ` `
                }
              ${
                license.url
                  ? `<a href="${license.url}">${license.label}</a>`
                  : license.label
              }`,
                  ]}
                />
              </div>
            )}
          </WorkDetailsSection>
        )}
        {!digitalLocation && (locationOfWork || encoreLink) && (
          <WhereToFindIt />
        )}
        <WorkDetailsSection headingText="About this work">
          {work.alternativeTitles.length > 0 && (
            <WorkDetailsText
              title="Also known as"
              text={work.alternativeTitles}
            />
          )}

          {work.description && (
            <WorkDetailsText title="Description" text={[work.description]} />
          )}

          {work.contributors.length > 0 && (
            <WorkDetailsTags
              title="Contributors"
              tags={work.contributors.map(contributor => ({
                textParts: [contributor.agent.label],
                linkAttributes: worksLink({
                  query: `"${contributor.agent.label}"`,
                }),
              }))}
            />
          )}

          {work.lettering && (
            <WorkDetailsText title="Lettering" text={[work.lettering]} />
          )}

          {work.production.length > 0 && (
            <WorkDetailsText
              title="Publication/Creation"
              text={work.production.map(
                productionEvent => productionEvent.label
              )}
            />
          )}

          {work.edition && (
            <WorkDetailsText title="Edition" text={[work.edition]} />
          )}

          {work.physicalDescription && (
            <WorkDetailsText
              title="Physical description"
              text={[work.physicalDescription]}
            />
          )}

          {duration && <WorkDetailsText title="Duration" text={[duration]} />}

          {work.notes
            .filter(note => note.noteType.id !== 'location-of-original')
            .map(note => (
              <WorkDetailsText
                key={note.noteType.label}
                title={note.noteType.label}
                text={note.contents}
              />
            ))}

          {work.genres.length > 0 && (
            <WorkDetailsTags
              title="Type/Technique"
              tags={work.genres.map(g => {
                return {
                  textParts: g.concepts.map(c => c.label),
                  linkAttributes: worksLink({
                    query: `"${g.label}"`,
                  }),
                };
              })}
            />
          )}

          {work.language && (
            <WorkDetailsLinks
              title="Language"
              links={[work.language && work.language.label]}
            />
          )}
        </WorkDetailsSection>
        {work.subjects.length > 0 && (
          <WorkDetailsSection headingText="Subjects">
            <WorkDetailsTags
              title={null}
              tags={work.subjects.map(s => {
                return {
                  textParts: s.concepts.map(c => c.label),
                  linkAttributes: worksLink({
                    query: `"${s.label}"`,
                  }),
                };
              })}
            />
          </WorkDetailsSection>
        )}
        {digitalLocation && (locationOfWork || encoreLink) && <WhereToFindIt />}
        <WorkDetailsSection headingText="Identifiers">
          {isbnIdentifiers.length > 0 && (
            <WorkDetailsList
              title="ISBN"
              list={isbnIdentifiers.map(id => id.value)}
            />
          )}
          <SpacingComponent>
            <div className={`${font('hnl', 5)}`}>
              <CopyUrl
                id={work.id}
                url={`https://wellcomecollection.org/works/${work.id}`}
              />
            </div>
          </SpacingComponent>
          {work.citeAs && (
            <WorkDetailsText title="Reference number" text={[work.citeAs]} />
          )}
        </WorkDetailsSection>
        <WorkDetailsSection>
          <div className="flex flex--v-center">
            <Icon name="underConstruction" extraClasses="margin-right-s2" />
            <p className={`${font('hnl', 5)} no-margin`}>
              We’re improving the information on this page.{' '}
              <a href="/works/progress">Find out more</a>.
            </p>
          </div>
        </WorkDetailsSection>
      </Layout12>
    </Space>
  );
};

export default WorkDetails;
