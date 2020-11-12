import styled from 'styled-components';
import Space from '../styled/Space';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { classNames } from '@weco/common/utils/classnames';
import { UiImageType } from '../../../model/image';

const Outer = styled('div').attrs({
  className: classNames({
    'bg-cream relative h-center': true,
  }),
})`
  height: 70vh;
  max-height: 100vw;
  max-width: 600px;
  transform: rotate(-2deg);
`;

const Inner = styled('div').attrs({
  className: classNames({
    absolute: true,
  }),
})`
  bottom: 0;
  width: 66vw;
  left: 50%;
  transform: translateX(-50%) rotate(2deg) translateY(-5vw);

  ${props => props.theme.media.large`
    transform: translateX(-50%) rotate(2deg) translateY(-50px);
  `}
`;

type Props = {
  image: UiImageType;
};

const BookImage: FunctionComponent<Props> = ({
  image,
}: Props): ReactElement<Props> => {
  return (
    <Space v={{ size: 'xl', properties: ['margin-top', 'padding-top'] }}>
      <Outer>
        <Inner>
          <UiImage
            extraClasses="margin-h-auto width-auto max-height-70vh"
            {...image}
          />
        </Inner>
      </Outer>
    </Space>
  );
};

export default BookImage;
