import { FunctionComponent } from 'react';
import styled from 'styled-components';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import Space from '@weco/common/views/components/styled/Space';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import { landingHeaderBackgroundLs } from '@weco/common/utils/backgrounds';
import Layout, { gridSize8 } from '@weco/common/views/components/Layout';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import Table from '@weco/content/components/Table';
import { policyUpdatedDate } from '@weco/common/views/components/CivicUK';

const Note = styled.p`
  background-color: red;
  color: white;
  font-size: 20px;
  padding: 5px;
`;

const CookieTable = () => {
  return (
    <Table
      rows={[
        [
          'Cookie name',
          'Provider',
          'Purpose',
          'Type (1st/3rd Party)',
          'Duration',
        ],
        [
          'lorem ipsum',
          'dolor sit amet',
          'lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
          '1st',
          '90 days',
        ],
        [
          'lorem ipsum',
          'dolor sit amet',
          'lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
          '1st',
          '90 days',
        ],
        ['', '', '', '', ''],
      ]}
      withBorder={true}
    ></Table>
  );
};

export const getServerSideProps = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const { cookiesWork } = serverData?.toggles;

  if (!cookiesWork.value) {
    return { notFound: true };
  }

  return {
    props: serialiseProps({
      serverData,
    }),
  };
};

const CookiePolicy: FunctionComponent = () => {
  return (
    <PageLayout
      title="Cookie policy"
      description="" // TODO
      hideNewsletterPromo={true}
      url={{ pathname: '/cookie-policy' }}
      jsonLd={{ '@type': 'WebPage' }}
      openGraphType="website"
      siteSection="about-us"
    >
      <PageHeader
        breadcrumbs={{ items: [] }}
        title="Cookie policy"
        backgroundTexture={landingHeaderBackgroundLs}
        highlightHeading={true}
      />

      <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
        <Space $v={{ size: 'xl', properties: ['padding-bottom'] }}>
          <Layout gridSizes={gridSize8()}>
            <div className="body-text spaced-text">
              <Note>7. We need a metadescription for this page</Note>
              <h2>Cookies</h2>
              <Note>
                5. I changed this from the og document to only talk about wc.org
                as this is our own policy, is that correct?
              </Note>
              <h3>Our websites</h3>
              <p>
                This Cookie Policy relates to your use of our website: Wellcome
                Collection (
                <a href="https://wellcome.org" target="_blank" rel="noreferrer">
                  https://wellcomecollection.org
                </a>
                )
              </p>
              <p>
                When you choose to accept or reject Cookies on one of our
                websites, your choices are valid for that website only. If you
                click through to another website, whether operated by us or a
                third party you will need to make separate choices in relation
                to the Cookies that you would like to accept or reject on that
                other website. These websites will set cookies in accordance
                with their own policies, which are separate from ours. Please
                consult these separate policies as appropriate.
              </p>
              <p>
                For more information as to how Wellcome uses your information,
                please see our Privacy Policy.
              </p>
              <h3>What are Cookies?</h3>
              <p>
                Like most organisations, Wellcome uses Cookies, and similar
                technologies such as tracking pixels (referred to in this policy
                together as &quot;Cookies&quot;), to capture information about
                our website users (referred to as &quot;you&quot;). A Cookie is
                a small file of letters and numbers that is downloaded onto your
                computer or device by a website, stored and used to send
                information back to that website.
              </p>
              <p>
                Cookies help to make websites work. They can also improve the
                performance of a site and some provide information to the owners
                of the site.
              </p>
              <p>
                Cookies do not store or collect information about you like your
                name. But they do collect information that relates to, for
                example, the devices you use to access the internet and your
                browsing history.
              </p>

              <h3>What cookies do we use?</h3>
              <p>
                Cookies that measure website use: these allow us to count your
                visits to the website, and to see how you move around it. This
                helps us to provide you with a good experience while you browse,
                for example by helping to make sure you can find what you need.
                It also allows us to improve the way the website works.
              </p>
              <p>
                Cookies that help with our communications and marketing: we will
                use these to measure how you are interacting with our marketing
                and advertising materials, and the effectiveness of our
                campaigns.
              </p>
              <p>
                We may use targeting cookies to understand your interests and
                show you relevant adverts about us on other websites you visit.
                This includes social networks, such as Facebook, Instagram,
                LinkedIn and Research Gate.
              </p>
              <p>
                Targeting our adverts means they’re more effective and enable us
                to reach a diverse and wide-ranging audience.
              </p>
              <p>
                Strictly necessary cookies: These cookies are necessary for our
                website to function and therefore cannot be switched off. We use
                them for things like remembering your privacy settings, or
                information that you enter into an online form.
              </p>
              <p>
                First party cookies: These are cookies that Wellcome sets when
                you visit our website.
              </p>
              <p>
                Third party cookies: These are cookies that are used by third
                parties other than Wellcome. They include advertising partners
                and social media providers, such as Facebook, LinkedIn and
                Research Gate, and we may use these to serve advertisements
                about our work across the internet.
              </p>

              <h3>Cookies consent and changing preferences</h3>
              <p>
                We will ask for your consent to place Cookies on your computer
                or device, except where they are essential to make our website
                work.
              </p>
              <Note>
                1. The section below doesn&apos;t work for us and needs
                rewriting
              </Note>
              <p>
                You can withdraw your consent to the use of Cookies or manage
                any other Cookie preferences by changing your Cookie settings.
                This page can also be accessed by clicking on &quot;Cookie
                settings&quot; in the footer of our websites. You can then
                adjust the radio buttons to &quot;on&quot; or &quot;off &quot;
                and save. You may need to refresh your page for your settings to
                take effect.
              </p>
              <p>
                We will ask you to revisit your preferences if you haven&apos;t
                visited our websites in over six months, so that we can check
                that they are accurate.
              </p>

              <h3>Cookies we use</h3>
              <h4>Strictly necessary cookies</h4>
              <p>
                These cookies are necessary for our website to function and
                therefore cannot be switched off. We use them for things like
                remembering your privacy settings, or information that you enter
                into an online form.
              </p>
              <CookieTable />

              <h4>Cookies that measure website use</h4>
              <p>
                We use Google Analytics on our websites. Google Analytics
                Cookies collect information related to the number of visitors to
                the website, where visitors have come to the website from, and
                the pages they visited. We use the information to compile
                reports and to help us improve the website.
              </p>
              <p>
                We use the following Google Analytics Cookies on our websites:
                We also use the following analytics Cookies on our websites:
              </p>
              <CookieTable />

              <Note>3. Is section below necessary for us? To confirm</Note>
              <h4>Cookies that help with our communications and marketing</h4>
              <p>
                We will use these to measure how you are interacting with our
                marketing and advertising materials, and the effectiveness of
                our campaigns.
              </p>
              <p>
                We may use targeting cookies to understand your interests and
                show you relevant adverts about us on other websites you visit.
                This includes social networks, such as Facebook, Instagram,
                LinkedIn and Research Gate. You can control what adverts you see
                on these sites by logging into your settings on the relevant
                service.
              </p>
              <p>
                Targeting our adverts means they&apos;re more effective and
                enable us to reach a diverse and wide ranging audience.
              </p>
              <p>We use the following marketing cookies on our websites:</p>
              <CookieTable />

              <h3>Controlling all Cookies</h3>
              <p>
                In addition to the Cookie choices presented within our websites,
                you can also use your web browser to manage your Cookies. For
                example, your web browser will enable you to:
              </p>
              <ul>
                <li>delete all or selected Cookies</li>
                <li>block all Cookies</li>
                <li>allow all Cookies</li>
                <li>block &quot;third party&quot; Cookies</li>
                <li>clear all Cookies when you close the browser</li>
                <li>
                  open a &quot;private browsing&quot;/ &quot;incognito&quot;
                  session, which allows you to browse the web without recording
                  your browsing history or storing local data such as Cookies.
                </li>
              </ul>
              <p>
                If you do choose to block Cookies, please be aware that you may
                lose some of the functionality of our websites.
              </p>
              <p>Find out more about managing Cookies on browsers:</p>
              <ul>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Microsoft Edge
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Internet Explorer
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647?hl=en-GB"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/delete-browsing-search-download-history-firefox"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Firefox
                  </a>
                </li>
                <li>
                  Safari –{' '}
                  <a
                    href="https://support.apple.com/en-gb/105082"
                    target="_blank"
                    rel="noreferrer"
                  >
                    mobile devices
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noreferrer"
                  >
                    desktops
                  </a>
                </li>
                <li>
                  <a
                    href="https://help.opera.com/en/latest/web-preferences/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Opera.
                  </a>
                </li>
              </ul>

              <h3>Changes to this Policy</h3>
              <p>
                We may update how we use cookies (and this policy) from time to
                time. So please check regularly to keep up to date with any
                changes.
              </p>

              <h3>Contact us</h3>
              <p>
                If you want to contact us in relation to this Cookie Policy,
                contact our Data Protection Team at{' '}
                <a href="mailto:dataprotection@wellcome.org">
                  dataprotection@wellcome.org
                </a>
                .
              </p>
              <Note>6. What should the date be here?</Note>
              <p>
                <em>This policy was last updated on [{policyUpdatedDate}].</em>
              </p>

              <Note>
                2. References to the Wellcome site here, can we remove some?
              </Note>
              <h2>Disclaimer</h2>
              <p>
                The Wellcome website is operated by The Wellcome Trust Limited
                (as trustee of the Wellcome Trust) (Wellcome). Content on the
                Wellcome website is provided for general and research purposes
                only. Wellcome accepts no responsibility for losses arising from
                reliance on information contained on the Wellcome website, or
                other sites that we may link to from time to time. In
                particular, Wellcome accepts no responsibility for losses
                arising from re-use of content on the Wellcome website without
                conducting your own due diligence.
              </p>
              <p>
                Unless otherwise stated, content on the Wellcome website is ©
                The Wellcome Trust and is licensed under a Creative Commons
                Attribution 4.0 International (CC-BY 4.0) licence.
              </p>
              <p>
                This means you can share the content on the Wellcome website by
                copying and distributing it, but you must comply with the terms
                of the CC-BY-4.0 licence, which includes acknowledging Wellcome
                as the copyright owner and providing a link to the source page
                on the Wellcome website. Please see{' '}
                <a
                  href="https://creativecommons.org/licenses"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://creativecommons.org/licenses
                </a>{' '}
                for more information.
              </p>
              <p>
                The Wellcome Collection website is operated by Wellcome.
                Wellcome Collection is a free museum and library that is
                committed to the long-term preservation of and access to its
                collections online and on-premises, to ensure they can be used
                by researchers and the wider public for generations to come.
              </p>
              <p>
                The copyright status of content made available on the Wellcome
                Collection website will vary. We publish a range of material
                which is still in copyright and in certain circumstances, take a
                risk-managed approach towards the publication of material in
                which the copyright position is less clear. Please refer to
                copyright information provided on the relevant pages on the
                Wellcome Collection website for further information.
              </p>
              <Note>
                4. Access policy links to a document marked 2018-2023, should it
                say 2024?
              </Note>
              <p>
                If you use and/or share content from our collections, you must
                do so in compliance with the law. In order to comply with UK
                Data Protection Law, in some cases, we may redact the names
                and/or ages of individuals that feature in our collections for
                sensitivity purposes. In other circumstances, alternative
                actions may be required. Please see our{' '}
                <a
                  href="https://wellcomecollection.cdn.prismic.io/wellcomecollection/d4817da5-c71a-4151-81c4-83e39ad4f5b3_Wellcome+Collection_Access+Policy_Aug+2020.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Access Policy
                </a>{' '}
                and{' '}
                <a
                  href="https://wellcomecollection.cdn.prismic.io/wellcomecollection/9a529367-ccc0-46bc-becc-70d299f9592a_Wellcome+Collection+Access+Procedures+Aug+2020.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Access to personal and sensitive information within our
                  collections
                </a>{' '}
                for further information.
              </p>
              <p>
                Despite the measures we take, there may be objections to the
                presence of specific information or the material being made
                available online. Please see our &quot;
                <a
                  href="/pages/YGSEhxAAACgAXL4E"
                  target="_blank"
                  rel="noreferrer"
                >
                  Copyright clearance and takedown guidelines for digitised
                  content
                </a>
                &quot; for further information about our copyright clearance
                process, the circumstances under which we would consider
                removing material from our website, and how to contact us
                regarding the removal of material.
              </p>
            </div>
          </Layout>
        </Space>
      </Space>
    </PageLayout>
  );
};

export default CookiePolicy;
