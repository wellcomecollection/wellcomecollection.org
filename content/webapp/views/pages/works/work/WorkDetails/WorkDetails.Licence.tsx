import { ReactElement } from 'react';
import styled from 'styled-components';

import { LicenseData } from '@weco/common/utils/licenses';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import Space from '@weco/common/views/components/styled/Space';
import CopyButtons from '@weco/content/views/components/CopyButtons';
import { Note } from '@weco/content/services/wellcome/catalogue/types';
import { removeTrailingFullStop } from '@weco/content/utils/string';

import WorkDetailsText from './WorkDetails.Text';

const LicenceContents = styled.div`
  /*  Hack to remove the spacing between the title and the first paragraph */
  p:nth-child(2) {
    margin-top: 0;
  }
`;

type LicenceTextProps = {
  title: string;
  copy: ReactElement;
};
const LicenceText = ({ title, copy }: LicenceTextProps) => (
  <WorkDetailsText
    contents={
      <LicenceContents>
        <p>
          <strong>{title}</strong>
        </p>
        {copy}
      </LicenceContents>
    }
  />
);

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
        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          <WorkDetailsText
            title="Access conditions"
            noSpacing={true}
            text={accessConditionsTerms}
          />
        </Space>
      )}
      <Space $v={{ size: 'l', properties: ['margin-top'] }}>
        <CollapsibleContent
          id="licenseDetail"
          controlText={{ defaultText: 'Licence and re-use' }}
        >
          <>
            {digitalLocationLicense.humanReadableText && (
              <LicenceText
                title={digitalLocationLicense.label}
                copy={digitalLocationLicense.humanReadableText}
              />
            )}

            <LicenceText
              title="Credit"
              copy={
                <CopyButtons
                  variant="content"
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
              }
            />

            {locationOfWork && (
              <LicenceText
                title="Provider"
                copy={<p>{locationOfWork.contents}</p>}
              />
            )}
          </>
        </CollapsibleContent>
      </Space>
    </>
  );
};

export default WorkDetailsLicence;
