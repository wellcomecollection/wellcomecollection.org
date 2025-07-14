import styled from 'styled-components';

export const WorkLink = styled.a`
  text-decoration-style: dotted;
  text-underline-offset: 26%;
  text-decoration-thickness: 8%;

  &::before {
    content: '';
    display: inline-block;
    position: relative;
    background-size: contain;
    width: 1em;
    height: 1em;
    top: 0.15em;
    margin-right: 0.25rem;
    background-image: url('https://i.wellcomecollection.org/assets/icons/favicon-32x32.png');
  }
`;

export const WorkIcon = styled.img``;

const FeaturedWorkLink = ({ link, text }) => {
  return <WorkLink href={link}>{text}</WorkLink>;
};

export default FeaturedWorkLink;
