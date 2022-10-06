import styled from 'styled-components';
import Divider from '@weco/common/views/components/Divider/Divider';

const Container = styled.div<{ backgroundColor: 'white' | 'black' }>`
  padding: 2rem 0;
  ${props =>
    props.backgroundColor &&
    `background-color: ${props.theme.color(props.backgroundColor)}`};
`;

const Wrapper = styled.div`
  margin: 0 2rem;
`;

const Template = args => {
  const { backgroundColor, ...rest } = args;
  return (
    <Container backgroundColor={backgroundColor}>
      <Wrapper>
        <Divider {...rest} />
      </Wrapper>
    </Container>
  );
};

export const basic = Template.bind({});
basic.args = {
  backgroundColor: 'white',
};

export const stub = Template.bind({});
stub.args = {
  color: 'black',
  isStub: true,
  backgroundColor: 'white',
};

basic.argTypes = {
  backgroundColor: {
    control: { type: 'select' },
    options: ['black', 'white'],
  },
};
