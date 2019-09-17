// @flow
import Button from '../Buttons/Button/Button';
import { grid, font, classNames } from '../../../utils/classnames';
import RepeatingLs from '../RepeatingLs/RepeatingLs';
import Space from '../styled/Space';
import Layout from '../Layout/Layout';
import styled from 'styled-components';

const NewsletterButtonContainer = styled(Space)`
  width: 100%;
  height: 100%;
  min-height: 120px;
  align-items: center;

  ${props => props.theme.media.medium`
    min-height: none;
    justify-content: center;
    align-items: flex-end;
  `}
`;

const NewsletterPromo = () => (
  <div className="row bg-teal">
    <Layout gridSizes={{ s: 12, m: 12, l: 12, xl: 12 }}>
      <div
        className={classNames({
          grid: true,
        })}
      >
        <div
          className={classNames({
            [grid({ s: 12, m: 6, l: 6, xl: 6 })]: true,
          })}
        >
          <Space
            v={{ size: 'xl', properties: ['padding-top', 'padding-bottom'] }}
            h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
          >
            <Space
              as="h2"
              v={{ size: 's', properties: ['margin-bottom'] }}
              className={classNames({
                'h1 font-white': true,
              })}
            >
              Be the first to know
            </Space>
            <p
              className={classNames({
                [font('hnl', 4)]: true,
                'font-white no-margin': true,
              })}
            >
              Stay connected with email updates from Wellcome Collection.
            </p>
          </Space>
        </div>
        <div
          className={classNames({
            [grid({ s: 12, m: 6, l: 4, shiftL: 2, xl: 3, shiftXl: 3 })]: true,
          })}
        >
          <NewsletterButtonContainer
            v={{ size: 'm', properties: ['padding-top', 'padding-bottom'] }}
            h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
            className={classNames({
              'flex relative': true,
            })}
          >
            <RepeatingLs background={'teal'} foreground={'purple'} size={48} />

            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <Button
                type="secondary"
                extraClasses="btn--primary relative"
                url="/newsletter"
                text="Sign up here"
              />
            </Space>
          </NewsletterButtonContainer>
        </div>
      </div>
    </Layout>
  </div>
);

export default NewsletterPromo;
