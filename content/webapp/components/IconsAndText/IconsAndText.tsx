import { FunctionComponent } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { getCrop, ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
const Icons = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(5, minmax(0, 100px));
`;

type Props = {
  icons: ImageType[];
  text: string;
};

const IconsWithText: FunctionComponent<Props> = ({ icons, text }) => {
  return (
    <SpacingComponent>
      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
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
      </Space>
      <div>{text}</div>
    </SpacingComponent>
  );
};

export default IconsWithText;
