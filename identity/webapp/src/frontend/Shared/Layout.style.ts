import styled from 'styled-components';

export const Container = styled.div`
  background-color: white;
  max-width: 782px;
  margin: 0 auto;

  @media screen and (min-width: 600px) {
    margin: 64px auto;
    border-radius: 10px;
    padding-top: 1em;
  }
`;

export const Wrapper = styled.div`
  max-width: 32em;
  margin: 0 auto;
  padding: 1em;
`;

export const Title = styled.h1.attrs({ className: 'font-wb font-size-2' })``;
