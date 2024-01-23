import NextLink from 'next/link';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import WorkDetailsSection from './WorkDetails.Section';
import IIIFClickthrough from '@weco/content/components/IIIFClickthrough/IIIFClickthrough';
import Space from '@weco/common/views/components/styled/Space';
import VideoPlayer from '@weco/content/components/VideoPlayer/VideoPlayer';
import AudioList from '@weco/content/components/AudioList/AudioList';
import Button from '@weco/common/views/components/Buttons';
import Download from '@weco/content/components/Download/Download';
import WorkDetailsLicence from './WorkDetails.Licence';
import DownloadList from './WorkDetails.DownloadList';
import { eye } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { LinkProps } from '@weco/common/model/link-props';
import { DownloadOption } from '@weco/content/types/manifest';
import useTransformedManifest from '@weco/content/hooks/useTransformedManifest';
import { Note, Work } from '@weco/content/services/wellcome/catalogue/types';
import { DigitalLocationInfo } from '@weco/content/utils/works';
import { DigitalLocation } from '@weco/common/model/catalogue';
import { useToggles } from '@weco/common/server-data/Context';

type Props = {
  work: Work;
  downloadOptions: DownloadOption[];
  showDownloadOptions: boolean;
  itemUrl: LinkProps;
  shouldShowItemLink: boolean;
  digitalLocation: DigitalLocation;
  digitalLocationInfo?: DigitalLocationInfo;
  locationOfWork?: Note;
};

const WorkDetailsAvailableOnline = ({
  work,
  downloadOptions,
  showDownloadOptions,
  itemUrl,
  shouldShowItemLink,
  digitalLocationInfo,
  digitalLocation,
  locationOfWork,
}: Props) => {
  const { showBornDigital } = useToggles();
  const transformedIIIFManifest = useTransformedManifest(work);
  const {
    video,
    collectionManifestsCount,
    canvasCount,
    audio,
    clickThroughService,
    tokenService,
    structures,
    bornDigitalStatus,
  } = { ...transformedIIIFManifest };
  return (
    <WorkDetailsSection headingText="Available online">
      <ConditionalWrapper
        condition={Boolean(tokenService && !shouldShowItemLink)}
        wrapper={children =>
          itemUrl && (
            <IIIFClickthrough
              clickThroughService={clickThroughService}
              tokenService={tokenService}
            >
              {children}
            </IIIFClickthrough>
          )
        }
      >
        {showBornDigital &&
          (bornDigitalStatus === 'mixedBornDigital' ||
            bornDigitalStatus === 'allBornDigital') &&
          structures && <DownloadList structures={structures} />}

        {video && (
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <VideoPlayer
              video={video}
              // Note: because we can't prevent people from downloading videos if
              // they're available online, any videos where we want to prevent
              // download are restricted in Sierra.
              //
              // This means that any videos which can be viewed can also be downloaded.
              //
              // See discussion in https://wellcome.slack.com/archives/C8X9YKM5X/p1641833044030400
              showDownloadOptions={true}
            />
          </Space>
        )}
        {audio?.sounds && audio.sounds.length > 0 && (
          <AudioList
            items={audio?.sounds || []}
            thumbnail={audio?.thumbnail}
            transcript={audio?.transcript}
            workTitle={work.title}
          />
        )}
        {shouldShowItemLink && (
          <>
            {work.thumbnail && (
              <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
                <ConditionalWrapper
                  condition={Boolean(itemUrl)}
                  wrapper={children =>
                    itemUrl && (
                      <NextLink
                        style={{
                          display: 'inline-block',
                        }}
                        href={itemUrl.href}
                        as={itemUrl.as}
                      >
                        {children}
                      </NextLink>
                    )
                  }
                >
                  <img
                    style={{
                      width: 'auto',
                      height: 'auto',
                      display: 'block',
                    }}
                    alt={`view ${work.title}`}
                    src={work.thumbnail.url}
                  />
                </ConditionalWrapper>
              </Space>
            )}
            <div style={{ display: 'flex' }}>
              {itemUrl && (
                <Space
                  as="span"
                  $h={{ size: 'm', properties: ['margin-right'] }}
                >
                  <Button
                    variant="ButtonSolidLink"
                    icon={eye}
                    text="View"
                    link={{ ...itemUrl }}
                  />
                </Space>
              )}
              {showDownloadOptions && (
                <Download
                  ariaControlsId="itemDownloads"
                  downloadOptions={downloadOptions}
                />
              )}
            </div>
            {(Boolean(
              collectionManifestsCount && collectionManifestsCount > 0
            ) ||
              Boolean(canvasCount && canvasCount > 0)) && (
              <Space $v={{ size: 'm', properties: ['margin-top'] }}>
                <p className={`${font('lr', 6)}`} style={{ marginBottom: 0 }}>
                  Contains:{' '}
                  {collectionManifestsCount && collectionManifestsCount > 0
                    ? `${collectionManifestsCount} ${
                        collectionManifestsCount === 1 ? 'volume' : 'volumes'
                      }`
                    : canvasCount && canvasCount > 0
                    ? `${canvasCount} ${canvasCount === 1 ? 'image' : 'images'}`
                    : ''}
                </p>
              </Space>
            )}
          </>
        )}
      </ConditionalWrapper>

      {digitalLocationInfo?.license && (
        <WorkDetailsLicence
          digitalLocationLicense={digitalLocationInfo.license}
          accessConditionsTerms={digitalLocation?.accessConditions[0]?.terms}
          credit={digitalLocation?.credit}
          locationOfWork={locationOfWork}
          workId={work.id}
          workTitle={work.title}
        />
      )}
    </WorkDetailsSection>
  );
};

export default WorkDetailsAvailableOnline;
