import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { classNames, grid, font } from '@weco/common/utils/classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  headingText?: string;
  isInArchive?: boolean;
}>;

const WorkDetailsSection: FunctionComponent<Props> = ({
  headingText,
  children,
  isInArchive,
}: Props) => {
  return (
    <>
      {!isInArchive && (
        <>
          <Divider color={`pumice`} isKeyline={true} />
          <SpacingComponent />
        </>
      )}
      <SpacingSection>
        <div
          className={classNames({
            grid: !isInArchive,
          })}
        >
          <div
            className={classNames({
              [grid({
                s: 12,
                m: 12,
                l: 4,
                xl: 4,
              })]: !isInArchive,
            })}
          >
            {headingText && (
              <h2
                className={classNames({
                  [font('wb', 4)]: true,
                  'work-details-heading': true,
                })}
              >
                {headingText}
              </h2>
            )}
          </div>

          <div
            className={classNames({
              [grid({
                s: 12,
                m: 12,
                l: 8,
                xl: 7,
              })]: !isInArchive,
            })}
          >
            {children}
          </div>
        </div>
      </SpacingSection>
    </>
  );
};

export default WorkDetailsSection;
