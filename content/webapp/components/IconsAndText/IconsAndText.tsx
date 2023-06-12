import { FunctionComponent } from 'react';
import styled from 'styled-components';
// import Space from '@weco/common/views/components/styled/Space';
import { getCrop, ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';

const IconsAndTextWrap = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;

  ${props => props.theme.media('medium')`
    flex-wrap: nowrap;
    flex-direction: row-reverse;
  `}
`;

const Icons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  flex: 0 0 60%;

  ${props => props.theme.media('medium')`
    flex: 1;
  `}

  > * {
    flex: 0 0 calc(33% - 10px);
  }
`;

const Text = styled.div`
  flex-basis: 100%;

  ${props => props.theme.media('medium')`
    flex: 1;
  `}
`;

type Props = {
  icons: ImageType[];
  text: string;
};

const IconsWithText: FunctionComponent<Props> = ({ icons, text }) => {
  return (
    <IconsAndTextWrap>
      <Icons>
        {icons.map((icon, index) => {
          const squareCrop = getCrop(icon, 'square');
          if (!squareCrop) return null;

          return (
            <div key={index}>
              <PrismicImage
                image={squareCrop}
                sizes={{
                  xlarge: 1 / 10,
                  large: 1 / 10,
                  medium: 1 / 10,
                  small: 1 / 10,
                }}
                quality="low"
              />
            </div>
          );
        })}
      </Icons>
      <Text>{text}</Text>
    </IconsAndTextWrap>
  );
};

export default IconsWithText;
