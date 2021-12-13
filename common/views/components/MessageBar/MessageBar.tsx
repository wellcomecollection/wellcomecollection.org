import { ReactNode, ComponentType, FunctionComponent } from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import AlignFont from '../styled/AlignFont';
import Space, { SpaceComponentProps } from '../styled/Space';

const ColouredTag: ComponentType<SpaceComponentProps> = styled(Space).attrs({
  className: classNames({
    caps: true,
    'inline-block': true,
    'bg-charcoal': true,
    'font-white': true,
    [font('hnb', 6)]: true,
  }),
})`
  padding: 0.2em 0.5em;
`;

type Props = {
  tagText?: string;
  children: ReactNode;
};

const MessageBar: FunctionComponent<Props> = ({ tagText, children }: Props) => (
  <Space
    v={{
      size: 'm',
      properties: ['padding-top', 'padding-bottom'],
    }}
    className={classNames({
      [font('hnr', 6)]: true,
    })}
  >
    {tagText && (
      <ColouredTag
        as="span"
        h={{
          size: 's',
          properties: ['margin-right'],
        }}
      >
        <AlignFont>{tagText}</AlignFont>
      </ColouredTag>
    )}
    {children}
  </Space>
);
export default MessageBar;
