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

type IconsAndText = {
  icons: ImageType[];
  text: string;
};

type Props = {
  items: IconsAndText[];
};

const IconsWithText: FunctionComponent<Props> = ({ items }) => {
  return (
    <div>
      {items.map((item, index) => (
        <SpacingComponent key={index}>
          <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
            <Icons>
              {item.icons.map((icon, index) => {
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
          <div>{item.text}</div>
        </SpacingComponent>
      ))}
    </div>
  );
};

export default IconsWithText;
