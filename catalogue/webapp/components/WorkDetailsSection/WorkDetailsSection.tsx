import Divider from '@weco/common/views/components/Divider/Divider';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { classNames, grid, font } from '@weco/common/utils/classnames';
import { FunctionComponent, PropsWithChildren, useContext } from 'react';
import IsArchiveContext from '../IsArchiveContext/IsArchiveContext';

type Props = PropsWithChildren<{
  headingText?: string;
  omitDivider: boolean;
}>;

const WorkDetailsSection: FunctionComponent<Props> = ({
  headingText,
  omitDivider = false,
  children,
}: Props) => {
  const isArchive = useContext(IsArchiveContext);

  return (
    <>
      {!isArchive && !omitDivider && (
        <>
          <Divider color={`pumice`} isKeyline={true} />
          <SpacingComponent />
        </>
      )}
      <SpacingSection>
        <div
          className={classNames({
            grid: !isArchive,
          })}
        >
          <div
            className={classNames({
              [grid({
                s: 12,
                m: 12,
                l: 4,
                xl: 4,
              })]: !isArchive,
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
              })]: !isArchive,
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
