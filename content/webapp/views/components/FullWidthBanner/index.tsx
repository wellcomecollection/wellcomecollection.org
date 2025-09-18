import * as prismic from '@prismicio/client';

import { arrowSmall } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';
import CaptionedImage from '@weco/content/views/components/CaptionedImage';
import MoreLink from '@weco/content/views/components/MoreLink';
import SectionHeader from '@weco/content/views/components/SectionHeader';

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
        <Space
          style={{ display: 'flex' }}
          $v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
        >
          <div style={{ flex: '1 1 50%' }}>
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
                  <Space
                    className={font('intm', 5)}
                    $v={{ size: 'l', properties: ['margin-top'] }}
                    dangerouslySetInnerHTML={{
                      __html: prismic.asHTML(props.supportText),
                    }}
                  />
                )}
              </>
            )}

            {variant === 'twoLinks' &&
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
          </div>

          {props.image && (
            <div style={{ flex: '1 1 50%' }}>
              <CaptionedImage
                image={props.image}
                hasRoundedCorners={false}
                caption={[]}
              />
            </div>
          )}
        </Space>
      </ContaineredLayout>
    </div>
  );
};

export default FullWidthBanner;
