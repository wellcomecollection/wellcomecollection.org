// @flow
import { type Node } from 'react';
import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { classNames, grid, font } from '@weco/common/utils/classnames';

type Props = {|
  headingText?: string,
  children: Node,
  withDivider?: boolean,
  isInArchive?: boolean,
|};

const WorkDetailsSection = ({
  headingText,
  children,
  withDivider = true,
  isInArchive,
}: Props) => {
  return (
    <>
      {withDivider && (
        <>
          <Divider extraClasses="divider--pumice divider--keyline" />
          <SpacingComponent />
        </>
      )}
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
                l: 4,
                xl: 4,
              })]: !isInArchive,
              [grid({
                s: 12,
                m: 12,
                l: 12,
                xl: 12,
              })]: isInArchive,
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
              [grid({
                s: 12,
                m: 12,
                l: 12,
                xl: 12,
              })]: isInArchive,
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
