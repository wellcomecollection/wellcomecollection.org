import Space from '../styled/Space';
import styled from 'styled-components';

const Heading = styled(Space)`
  display: block;

  @supports (box-decoration-break: clone) {
    display: inline;
    line-height: calc(1.1em + 12px);
    box-decoration-break: clone;
  }
`;

type Props = {|
  text: string,
|};

const HighlightedHeading = ({ text }: Props) => {
  return (
    <h1 className="h1">
      <Heading
        v={{
          size: 's',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
        className={`bg-white`}
      >
        {text}
      </Heading>
    </h1>
  );
};

export default HighlightedHeading;
