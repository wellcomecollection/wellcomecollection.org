// $Flow
import {Fragment, Component} from 'react';
import Router from 'next/router';
import NextLink from 'next/link';
import {font, spacing, classNames} from '@weco/common/utils/classnames';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import MetaUnit from '@weco/common/views/components/MetaUnit/MetaUnit2';
import {workLd} from '@weco/common/utils/json-ld';
import WorkMedia from '@weco/common/views/components/WorkMedia/WorkMedia';
import {worksUrl} from '../../services/catalogue/urls';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchBox from '@weco/common/views/components/SearchBox/SearchBoxV2';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';

type Work = Object;
type Props = {|
  work: Work,
  iiifImageLocationUrl: ?string,
  licenseInfo: ?string,
  iiifImageLocationCredit: ?string,
  iiifImageLocationLicenseId: ?string
|}

class WorkRedesign extends Component<Props> {
  state = {
    query: ''
  }

  handleSubmit = (event) => {
    event.preventDefault();

    Router.push(
      worksUrl({query: this.state.query}).href,
      worksUrl({query: this.state.query}).as
    );
  }

  handleChange = (event) => {
    this.setState({
      query: event.target.value
    });
  }

  render() {
    const {
      work,
      iiifImageLocationUrl,
      licenseInfo,
      iiifImageLocationCredit
    } = this.props;

    return (
      <PageLayout
        title={work.title}
        description={work.description || work.title}
        url={{pathname: `/works/${work.id}`}}
        openGraphType={'website'}
        jsonLd={workLd(work)}
        oEmbedUrl={`https://wellcomecollection.org/oembed/works/${work.id}`}
        imageUrl={iiifImageLocationUrl}
        imageAltText={work.title}>
        <InfoBanner text={`Coming from Wellcome Images? All freely available images have now been moved to the Wellcome Collection website. Here we're working to improve data quality, search relevance and tools to help you use these images more easily`} cookieName='WC_wellcomeImagesRedirect' />
        <Fragment>
          <Fragment>
            <div className={classNames({
              'bg-cream': true,
              [spacing({s: 4}, {padding: ['top', 'bottom'], margin: ['bottom']})]: true
            })}>
              <Layout12>
                <SearchBox
                  action={''}
                  id={'blah'}
                  name={'query'}
                  query={this.state.query}
                  autofocus={false}
                  onSubmit={this.handleSubmit}
                  onChange={this.handleChange}
                />
              </Layout12>
            </div>

            <SpacingSection>
              <Layout12>
                {work.workType &&
                  <NextLink {...worksUrl({ query: `workType:"${work.workType.label}"`, page: undefined })}>
                    <a className={`${font({s: 'HNL5', m: 'HNL4'})}`}>{work.workType.label}</a>
                  </NextLink>
                }
                <h1 id='work-info'
                  className={classNames([
                    font({s: 'HNM3', m: 'HNM2', l: 'HNM1'}),
                    spacing({s: 0}, {margin: ['top', 'bottom']})
                  ])}>{work.title}</h1>
              </Layout12>
            </SpacingSection>

            <SpacingSection>
              {iiifImageLocationUrl && <WorkMedia
                id={work.id}
                iiifUrl={iiifImageLocationUrl}
                title={work.title}
                isV2={true} />}
            </SpacingSection>

            <SpacingSection>
              <Layout10>
                <div>
                  {work.description &&
                    <MetaUnit headingText='Description' text={[work.description]} />
                  }

                  {work.physicalDescription &&
                    <MetaUnit headingText='Physical description' text={[`${work.physicalDescription} ${work.extent} ${work.dimensions}`]} />
                  }

                  {work.lettering &&
                    <MetaUnit headingText='Lettering' text={[work.lettering]} />
                  }

                  {work.createdDate &&
                    <MetaUnit headingText='Created date' text={[work.createdDate.label]} />
                  }

                  {work.contributors.length > 0 &&
                    <MetaUnit headingText='Contributors' links={work.contributors.map(contributor => {
                      const linkAttributes = worksUrl({ query: `contributors:"${contributor.agent.label}"`, page: undefined });
                      return (<NextLink key={1} href={linkAttributes.href} as={linkAttributes.as}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{contributor.agent.label}</a>
                      </NextLink>);
                    }
                    )} />
                  }

                  {work.subjects.length > 0 &&
                    <MetaUnit headingText='Subjects' links={work.subjects.map(subject => {
                      const linkAttributes = worksUrl({ query: `subjects:"${subject.label}"`, page: undefined });
                      return (<NextLink key={1} href={linkAttributes.href} as={linkAttributes.as}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{subject.label}</a>
                      </NextLink>);
                    }
                    )} />
                  }

                  {work.genres.length > 0 &&
                    <MetaUnit headingText='Genres' links={work.genres.map(genre => {
                      const linkAttributes = worksUrl({ query: `genres:"${genre.label}"`, page: undefined });
                      return (<NextLink key={1} href={linkAttributes.href} as={linkAttributes.as}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{genre.label}</a>
                      </NextLink>);
                    }
                    )} />
                  }

                  {work.production.length > 0 &&
                    <Fragment>
                      {work.production.map((production, i) => {
                        return (
                          <Fragment key={i}>
                            {production.places.length > 0 &&
                            <MetaUnit headingLevel={3} headingText='Places' list={production.places.map(place => place.label)} />}
                            {production.agents.length > 0 &&
                            <MetaUnit headingLevel={3} headingText='Agents' list={production.agents.map(agent => agent.label)} />}
                            {production.dates.length > 0 &&
                            <MetaUnit headingLevel={3} headingText='Dates' list={production.dates.map(date => date.label)} />}
                          </Fragment>
                        );
                      })}
                    </Fragment>
                  }

                  {work.language &&
                    <MetaUnit headingText='Language' links={[
                      <NextLink key={1} {...worksUrl({ query: `language:"${work.language.label}"`, page: undefined })}>
                        <a className={`plain-link font-green font-hover-turquoise ${font({s: 'HNM5', m: 'HNM4'})}`}>{work.language.label}</a>
                      </NextLink>
                    ]} />
                  }
                </div>

                {licenseInfo &&
                  <Fragment>
                    <MetaUnit headingLevel={3} headingText='License information' text={licenseInfo.humanReadableText} />
                    <MetaUnit headingLevel={3} headingText='Credit' text={[
                      `${work.title}. Credit: <a href="https://wellcomecollection.org/works/${work.id}">${iiifImageLocationCredit}</a>. ${licenseInfo.url ? `<a href="${licenseInfo.url}">${licenseInfo.text}</a>` : licenseInfo.text}`]} />
                  </Fragment>
                }
              </Layout10>
            </SpacingSection>
          </Fragment>
        </Fragment>
      </PageLayout>
    );
  }
}

export default WorkRedesign;
