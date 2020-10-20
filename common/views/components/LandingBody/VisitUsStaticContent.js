import { classNames, font, grid } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';
import FindUs from '@weco/common/views/components/FindUs/FindUs';
import SpacingSection from '../SpacingSection/SpacingSection';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
import Space from '@weco/common/views/components/styled/Space';
import Layout8 from '../Layout8/Layout8';
import FooterOpeningTimes from '@weco/common/views/components/FooterOpeningTimes/FooterOpeningTimes';

type ContainerProps = {|
  children: any,
|};

const Container = ({ children }: ContainerProps) => (
  <SpacingSection>
    <SpacingComponent>
      <div
        className={classNames({
          'body-part': true,
        })}
      >
        <Layout8>{children}</Layout8>
      </div>
    </SpacingComponent>
  </SpacingSection>
);

const VisitUsStaticContent = () => (
  <OpeningTimesContext.Consumer>
    {openingTimes => (
      <Container>
        <div className="grid">
          <div
            className={classNames({
              [grid({ s: 12, l: 6, xl: 6 })]: true,
              [font('hnl', 4)]: true,
            })}
          >
            <FindUs />
          </div>
          <div
            className={classNames({
              [grid({ s: 12, l: 6, xl: 6 })]: true,
              [font('hnl', 4)]: true,
            })}
          >
            <div className="flex">
              <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
                <Icon name="clock" extraClasses={`float-l`} />
              </Space>
              <div
                className={classNames({
                  [font('hnl', 5)]: true,
                  'float-l': true,
                })}
              >
                <h2
                  className={classNames({
                    [font('hnm', 5)]: true,
                    'no-margin': true,
                  })}
                >{`Today's opening times`}</h2>
                {openingTimes && openingTimes?.collectionOpeningTimes && (
                  <FooterOpeningTimes
                    collectionOpeningTimes={openingTimes.collectionOpeningTimes}
                  />
                )}
                <Space
                  v={{
                    size: 's',
                    properties: ['margin-top'],
                  }}
                  className={`no-margin`}
                >
                  <a href="/opening-times">Opening times</a>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </Container>
    )}
  </OpeningTimesContext.Consumer>
);

export default VisitUsStaticContent;
