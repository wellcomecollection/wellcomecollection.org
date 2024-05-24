import { FunctionComponent } from 'react';
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
import { cookiesTableCopy } from '@weco/common/data/cookies';

const CookieTable = ({ rows }: { rows: string[][] }) => {
  return (
    <Table
      rows={[['Provider', 'Cookie name', 'Purpose', 'Duration'], ...rows]}
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
      description="This policy contains information on cookies used on the Wellcome Collection website and how to manage your cookie preferences."
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
              <h2>Cookies</h2>
              <h3>Our websites</h3>
              <p>
                This Cookie Policy relates to your use of the Wellcome
                Collection websites (
                <a
                  href="https://wellcomecollection.org"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://wellcomecollection.org
                </a>
                ).
              </p>
              <p>
                When you choose to accept or reject cookies on one of our
                websites, your choices are valid for that website only. If you
                click through to another website, whether operated by us
                (including Wellcome Trust or Wellcome Funding) or a third party
                you will need to make separate choices in relation to the
                cookies that you would like to accept or reject on that other
                website.
              </p>
              <p>
                For more information as to how Wellcome uses your information,
                please see our Privacy Policy.
              </p>
              <h3>What are cookies?</h3>
              <p>
                Like most organisations, Wellcome uses cookies, and similar
                technologies such as tracking pixels (referred to in this policy
                together as &quot;cookies&quot;), to capture information about
                our website users (referred to as &quot;you&quot;). A cookie is
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
                We will ask for your consent to place cookies on your computer
                or device, except where they are essential to make our website
                work.
              </p>
              <p>
                You can withdraw your consent to the use of cookies or manage
                any other cookie preferences by changing your cookie settings.
                This page can also be accessed by clicking on &quot;Manage
                cookies&quot; in the footer of our websites. You can then adjust
                the slider buttons to &quot;on&quot; or &quot;off&quot; and
                save. You may need to refresh your page for your settings to
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
              <CookieTable rows={cookiesTableCopy.strictlyNecessaryCookies} />

              <h4>Cookies that measure website use</h4>
              <p>
                We use analytics cookies on our websites. These collect
                information related to the number of visitors to the website,
                where visitors have come to the website from, and the pages they
                visited. We use the information to compile reports and to help
                us improve the website. We use the following analytics cookies
                on our websites:
              </p>
              <CookieTable rows={cookiesTableCopy.analyticsCookies} />

              <h4>Cookies that help with our communications and marketing</h4>
              <p>
                We will use these to measure how you are interacting with our
                marketing and advertising materials, and the effectiveness of
                our campaigns.
              </p>
              <p>
                We may use targeting cookies to understand your interests and
                show you relevant adverts about us on other websites you visit.
                You can control what adverts you see on these sites by logging
                into your settings on the relevant service.
              </p>
              <p>
                Targeting our adverts means they&apos;re more effective and
                enable us to reach a diverse and wide ranging audience.
              </p>
              <p>We use the following marketing cookies on our websites:</p>
              <CookieTable rows={cookiesTableCopy.marketingCookies} />

              <h3>Controlling all cookies</h3>
              <p>
                In addition to the cookie choices presented within our websites,
                you can also use your web browser to manage your cookies. For
                example, your web browser will enable you to:
              </p>
              <ul>
                <li>delete all or selected cookies</li>
                <li>block all cookies</li>
                <li>allow all cookies</li>
                <li>block &quot;third party&quot; cookies</li>
                <li>clear all cookies when you close the browser</li>
                <li>
                  open a &quot;private browsing&quot;/ &quot;incognito&quot;
                  session, which allows you to browse the web without recording
                  your browsing history or storing local data such as cookies.
                </li>
              </ul>
              <p>
                If you do choose to block cookies, please be aware that you may
                lose some of the functionality of our websites.
              </p>
              <p>Find out more about managing cookies on browsers:</p>
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
              <p>
                <em>This policy was last updated on {policyUpdatedDate}.</em>
              </p>
            </div>
          </Layout>
        </Space>
      </Space>
    </PageLayout>
  );
};

export default CookiePolicy;
