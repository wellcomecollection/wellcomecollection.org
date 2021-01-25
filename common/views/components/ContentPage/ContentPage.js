// @flow
import { Children, Fragment, createContext } from 'react';
import Contributors from '../Contributors/Contributors';
// $FlowFixMe (tsx)
import Layout8 from '../Layout8/Layout8';
// $FlowFixMe (tsx)
import Layout12 from '../Layout12/Layout12';
import SeriesNavigation from '../SeriesNavigation/SeriesNavigation';
import PageHeader from '../PageHeader/PageHeader';
import Outro from '../Outro/Outro';
import { classNames } from '../../../utils/classnames';
import type { Node, Element, ElementProps } from 'react';
// $FlowFixMe (tsx)
import Body from '../Body/Body';
import SpacingSection from '../SpacingSection/SpacingSection';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
// $FlowFixMe(tsx)
import CompactCard from '../CompactCard/CompactCard';
import Image from '../Image/Image';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
// $FlowFixMe (tsx)
import { WeAreGoodToGo } from '@weco/common/views/components/CovidIcons/CovidIcons';
import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';
// $FlowFixMe (tsx)
import BannerCard from '../BannerCard/BannerCard';
/*eslint-disable */
export const PageBackgroundContext = createContext<'cream' | 'white'>('white');

// TODO: use Element<typeof Component>
type Props = {|
  id: string,
  isCreamy?: boolean,
  Header: Element<typeof PageHeader>,
  Body: Element<typeof Body>,
  // This is used for content type specific components e.g. InfoBox
  children?: ?Node,
  contributorProps?: ElementProps<typeof Contributors>,
  Siblings?: Element<typeof SeriesNavigation>[],
  outroProps?: ?ElementProps<typeof Outro>,
  seasons?: any, // TODO
|};

// FIXME: obviously we can't carry on like this!
const ShameWhatWeDoHack = () => (
  <Layout8>
    <Space v={{ size: 'l', properties: ['margin-top'] }}>
      <div className="border-bottom-width-1 border-color-pumice"></div>
    </Space>
    <CompactCard
      url="/user-panel"
      title="Join our user panel"
      primaryLabels={[]}
      secondaryLabels={[]}
      description="Get involved in shaping better website and gallery experiences for everyone. We’re looking for people to take part in online and in-person interviews, usability tests, surveys and more."
      urlOverride={null}
      partNumber={null}
      color={null}
      Image={
        <Image
          contentUrl={`https://images.prismic.io/wellcomecollection/65334f9d-50d0-433f-a4ac-a780eef352e3_user_research_square.jpg?auto=compress,format`}
          width={3200}
          height={3200}
          alt={''}
          tasl={null}
        />
      }
      DateInfo={null}
      StatusIndicator={null}
      ExtraInfo={null}
      xOfY={{ x: 1, y: 1 }}
    />
  </Layout8>
);

const ContentPage = ({
  id,
  isCreamy = false,
  Header,
  Body,
  children,
  contributorProps,
  Siblings = [],
  outroProps,
  seasons = [],
}: Props) => {
  // We don't want to add a spacing unit if there's nothing to render
  // in the body (we don't render the 'standfirst' here anymore).
  function shouldRenderBody() {
    if (
      Body.props.body.length === 1 &&
      Body.props.body[0].type === 'standfirst'
    )
      return false;
    if (Body.props.body.length > 0) return true;
  }

  return (
    <PageBackgroundContext.Provider value={isCreamy ? 'cream' : 'white'}>
      <article data-wio-id={id}>
        <SpacingSection>{Header}</SpacingSection>
        <div
          className={classNames({
            'bg-cream': isCreamy,
          })}
        >
          {shouldRenderBody() && (
            <SpacingSection>
              <div className="basic-page">
                <Fragment>{Body}</Fragment>
                {id === prismicPageIds.whatWeDo && <ShameWhatWeDoHack />}
              </div>
            </SpacingSection>
          )}

          {children && (
            <SpacingSection>
              {Children.map(children, (child, i) => (
                <Fragment>
                  {child && (
                    <SpacingComponent>
                      <Layout8>{child}</Layout8>
                    </SpacingComponent>
                  )}
                </Fragment>
              ))}
            </SpacingSection>
          )}

          {contributorProps && contributorProps.contributors.length > 0 && (
            <SpacingSection>
              <Layout8>
                <Contributors {...contributorProps} />
              </Layout8>
            </SpacingSection>
          )}

          {Siblings.length > 0 && (
            <SpacingSection>
              {Children.map(Siblings, (child, i) => (
                <Fragment>
                  {child && (
                    <SpacingComponent>
                      <Layout8>{child}</Layout8>
                    </SpacingComponent>
                  )}
                </Fragment>
              ))}
            </SpacingSection>
          )}

          {outroProps && (
            <SpacingSection>
              <Layout8>
                <Outro {...outroProps} />
              </Layout8>
            </SpacingSection>
          )}

          {id === prismicPageIds.covidWelcomeBack && (
            <Layout8>
              <div style={{ width: '100px' }}>
                <WeAreGoodToGo />
              </div>
            </Layout8>
          )}

          {seasons.length > 0 &&
            seasons.map(season => (
              <SpacingSection key={season.id}>
                <Layout12>
                  <BannerCard item={season} />
                </Layout12>
              </SpacingSection>
            ))}
        </div>
      </article>
    </PageBackgroundContext.Provider>
  );
};

export default ContentPage;
