import * as prismic from '@prismicio/client';
import styled from 'styled-components';

import { arrowSmall, web } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import CaptionedImage from '@weco/content/views/components/CaptionedImage';
import MoreLink from '@weco/content/views/components/MoreLink';
import SectionHeader from '@weco/content/views/components/SectionHeader';

const ContentContainer = styled(Space)`
  display: flex;
  flex-direction: column;

  ${props => props.theme.media('medium')`
    flex-direction: row;
  `}
`;

const CopySection = styled.div`
  flex: 1 1 50%;
  order: 1;
  margin-right: 0;

  ${props => props.theme.media('medium')`
    margin-right: 2rem;
  `}
`;

const ImageSection = styled.div`
  flex: 1 1 50%;
  order: 0;
  margin-bottom: 2rem;

  ${props => props.theme.media('medium')`
    order: 2;
    margin-bottom: 0;
  `}
`;

const SupportText = styled(Space).attrs({
  className: font('intr', 5),
  $v: { size: 'l', properties: ['margin-top'] },
})`
  display: flex;

  p {
    margin-bottom: 0;
    margin-left: 10px;
  }
`;

type SharedProps = {
  title?: string;
  description?: string;
  image?: ImageType;
};

type DefaultProps = SharedProps & {
  variant: 'default';
  callToAction?: {
    text: string;
    url: string;
  };
  supportText?: prismic.RichTextField;
};

type TwoLinksProps = SharedProps & {
  variant: 'twoLinks';
  links: {
    firstLink?: {
      text: string;
      url: string;
    };
    secondLink?: {
      text: string;
      url: string;
    };
  };
};

const LinkWithArrow = ({ text, url }) => {
  return (
    <a href={url} style={{ display: 'flex', marginBottom: '1rem' }}>
      {text}
      <span
        style={{
          display: 'inline-flex',
          alignSelf: 'center',
          marginLeft: '4px',
        }}
      >
        <Icon icon={arrowSmall} />
      </span>
    </a>
  );
};

export type Props = DefaultProps | TwoLinksProps;

const FullWidthBanner = (props: Props) => {
  const { variant } = props;
  const isDefaultVariant = variant === 'default';
  const isTwoLinksVariant = variant === 'twoLinks';

  return (
    <div
      data-component="full-width-banner"
      style={{
        backgroundColor: themeValues.color(
          isDefaultVariant ? 'accent.lightBlue' : 'accent.lightPurple'
        ),
      }}
    >
      <ContaineredLayout gridSizes={gridSize12()}>
        <ContentContainer
          $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        >
          <CopySection>
            {props.title && <SectionHeader title={props.title}></SectionHeader>}
            {props.description && <p>{props.description}</p>}

            {isDefaultVariant && (
              <>
                {props.callToAction && (
                  <MoreLink
                    name={props.callToAction.text}
                    url={props.callToAction.url}
                  />
                )}

                {props.supportText && (
                  <SupportText>
                    <Icon icon={web} />

                    <PrismicHtmlBlock html={props.supportText} />
                  </SupportText>
                )}
              </>
            )}

            {isTwoLinksVariant &&
              (props.links.firstLink || props.links.secondLink) && (
                <PlainList>
                  {props.links.firstLink && (
                    <li>
                      <LinkWithArrow
                        text={props.links.firstLink.text}
                        url={props.links.firstLink.url}
                      />
                    </li>
                  )}
                  {props.links.secondLink && (
                    <li>
                      <LinkWithArrow
                        text={props.links.secondLink.text}
                        url={props.links.secondLink.url}
                      />
                    </li>
                  )}
                </PlainList>
              )}
          </CopySection>

          {props.image && (
            <ImageSection>
              <CaptionedImage
                image={props.image}
                hasRoundedCorners={false}
                caption={[]}
              />
            </ImageSection>
          )}
        </ContentContainer>
      </ContaineredLayout>
    </div>
  );
};

export default FullWidthBanner;
