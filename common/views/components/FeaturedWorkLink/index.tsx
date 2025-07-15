import styled from 'styled-components';

export const WorkLink = styled.a`
  text-decoration-style: dotted;
  text-underline-offset: 26%;
  text-decoration-thickness: 8%;

  &::before {
    content: '';
    position: relative;

    background-image: url('https://i.wellcomecollection.org/assets/icons/favicon-32x32.png');
    background-repeat: no-repeat;
    background-size: 1em;
    background-position: center;
    padding-right: 1.25em;
  }
`;

const FeaturedWorkLink = ({ link, text }) => {
  return <WorkLink href={link}>{text}</WorkLink>;
};

export default FeaturedWorkLink;
