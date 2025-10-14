import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import PopoutImage from '@weco/content/views/components/PopoutImage';

type LinkSpaceAttrs = {
  $url: string;
};

const LinkSpace = styled(Space).attrs<LinkSpaceAttrs>(props => ({
  as: 'a',
  href: props.$url,
  $v: { size: 'xl', properties: ['padding-top'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
}))<LinkSpaceAttrs>`
  display: block;

  &,
  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }

  &:hover h3,
  &:focus h3 {
    text-decoration: underline;
    text-decoration-color: ${props => props.theme.color('black')};
  }
`;

const Title = styled.h3.attrs({
  className: font('intb', 5),
})`
  margin: 0;
`;

const Meta = styled.p.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.600')};
  margin: 0;
  white-space: nowrap;
`;

export type TbcItem = {
  url: string;
  title: string;
  image?: {
    contentUrl: string;
    width: number;
    height: number;
    alt?: string;
  };
  labels: { text: string }[];
  meta?: string;
};

type Props = {
  item: TbcItem;
};

const TbcCard: FunctionComponent<Props> = ({ item }) => {
  const { url, title, image, labels, meta } = item;
  return (
    <LinkSpace $url={url}>
      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
        <PopoutImage
          image={{
            contentUrl: image?.contentUrl || '',
            width: image?.width || 0,
            height: image?.height || 0,
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            //
            // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
            alt: '',
          }}
          sizes={{
            xlarge: 1 / 6,
            large: 1 / 6,
            medium: 1 / 3,
            small: 1,
          }}
          quality="low"
        />
        <Space
          $h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
        >
          <Space
            $v={{ size: 's', properties: ['margin-bottom'] }}
            style={{ position: 'relative' }}
          >
            <Space
              $v={{
                size: 'm',
                properties: ['margin-top'],
                negative: true,
              }}
            >
              <LabelsList labels={labels} />
            </Space>
          </Space>
          <Title>{title}</Title>
          {meta && <Meta>{meta}</Meta>}
        </Space>
      </Space>
    </LinkSpace>
  );
};

export default TbcCard;
