import { LicenseData } from '@weco/common/utils/licenses';
import { removeTrailingFullStop } from '@weco/content/utils/string';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import Space from '@weco/common/views/components/styled/Space';
import { CopyContent } from '@weco/content/components/CopyButtons';
import WorkDetailsText from './WorkDetails.Text';
import { Note } from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  digitalLocationLicense: LicenseData;
  workId: string;
  workTitle: string;
  accessConditionsTerms?: string;
  credit?: string;
  locationOfWork?: Note;
};
const WorkDetailsLicence = ({
  digitalLocationLicense,
  workId,
  workTitle,
  accessConditionsTerms,
  credit,
  locationOfWork,
}: Props) => {
  return (
    <>
      {accessConditionsTerms && (
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          <WorkDetailsText
            title="Access conditions"
            noSpacing={true}
            text={accessConditionsTerms}
          />
        </Space>
      )}
      <Space v={{ size: 'l', properties: ['margin-top'] }}>
        <CollapsibleContent
          id="licenseDetail"
          controlText={{ defaultText: 'Licence and re-use' }}
        >
          <>
            {digitalLocationLicense.humanReadableText && (
              <WorkDetailsText
                contents={
                  <>
                    <p>
                      <strong>{digitalLocationLicense.label}</strong>
                    </p>
                    {digitalLocationLicense.humanReadableText}
                  </>
                }
              />
            )}

            <WorkDetailsText
              contents={
                <>
                  <p>
                    <strong>Credit</strong>
                  </p>
                  <CopyContent
                    CTA="Copy credit information"
                    content={`${removeTrailingFullStop(workTitle)}. ${
                      credit ? `${credit}. ` : ''
                    }${
                      digitalLocationLicense.label
                    }. Source: Wellcome Collection. https://wellcomecollection.org/works/${workId}`}
                    displayedContent={
                      <p>
                        {/* Regex removes trailing full-stops.  */}
                        {removeTrailingFullStop(workTitle)}.{' '}
                        {credit && <>{credit}. </>}
                        {digitalLocationLicense.label}. Source: Wellcome
                        Collection.
                      </p>
                    }
                  />
                </>
              }
            />

            {locationOfWork && (
              <WorkDetailsText
                contents={
                  <>
                    <p>
                      <strong>Provider</strong>
                    </p>
                    <p>{locationOfWork.contents}</p>
                  </>
                }
              />
            )}
          </>
        </CollapsibleContent>
      </Space>
    </>
  );
};

export default WorkDetailsLicence;
