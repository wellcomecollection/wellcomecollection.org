import { font, classNames } from '@weco/common/utils/classnames';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import { FunctionComponent, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  title?: string;
  inlineHeading?: boolean;
  noSpacing?: boolean;
}>;

const WorkDetailsProperty: FunctionComponent<Props> = ({
  title,
  inlineHeading,
  noSpacing,
  children,
}: Props) => {
  return (
    <ConditionalWrapper
      condition={!noSpacing}
      wrapper={children => <SpacingComponent>{children}</SpacingComponent>}
    >
      <div
        className={`${font('intr', 5, { small: 3, medium: 3 })}${
          inlineHeading ? ' flex' : ''
        }`}
      >
        {title && (
          <Space
            as="h3"
            h={
              inlineHeading
                ? {
                    size: 's',
                    properties: ['margin-right'],
                  }
                : { size: 's', properties: [] }
            }
            className={classNames({
              [font('intb', 5, { small: 3, medium: 3 })]: true,
              'no-margin': !inlineHeading,
            })}
            style={{ marginBottom: 0 }}
          >
            {title}
          </Space>
        )}
        {children}
      </div>
    </ConditionalWrapper>
  );
};

export default WorkDetailsProperty;
