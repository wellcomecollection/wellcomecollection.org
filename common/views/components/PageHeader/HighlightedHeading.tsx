import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';

const Heading = styled(Space)`
  display: block;
  background-color: ${props => props.theme.color('white')};

  @supports (box-decoration-break: clone) {
    display: inline;
    line-height: calc(1.1em + 12px);
    box-decoration-break: clone;
  }
`;

type Props = {
  text: string;
};

const HighlightedHeading: FunctionComponent<Props> = ({ text }: Props) => {
  return (
    <h1 className={font('wb', 2)}>
      <Heading
        v={{
          size: 's',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
      >
        {text}
      </Heading>
    </h1>
  );
};

export default HighlightedHeading;
