export const context = {
  pageDescription: {
    title: 'Principles',
    lead: true,
    meta: {
      value: `This document outlines core concepts that will inform the development of the Wellcome Collection website.`
    }
  },
  pageSections: [
    {
      name: 'Progressive enhancement',
      url: 'pe',
      content: `
      <p><strong>The site will function without JavaScript or CSS</strong></p>
      <p>Progressive enhancement is a way of building websites that ensures it will function with HTML alone. This adds to the development overhead, but is crucial for ensuring sites are available to the widest possible audience.</p>
      <p>In combination with <a href="http://responsivenews.co.uk/post/18948466399/cutting-the-mustard">cutting the mustard</a>, it provides the best strategy for making sites that work on as large a number of devices/browsers as possible.</p>
      <p>Opera mini and other <a href="https://www.youtube.com/watch?v=BHO70H9tvqo#t=16m51s">proxy browsers constitute a significant and growing proportion of web browsers</a> in use. This is particularly true in developing countries where slower network connections and expensive data plans make them appealing. Using <a href="https://dev.opera.com/articles/making-sites-work-opera-mini/">progressive enhancement is key to making sites that operate well on proxy browsers</a>.</p>
      `
    },
    {
      name: 'Mobile first',
      url: 'mf',
      content: `
      <p><strong>The site will be designed for smallest screens first</strong></p>
      <p>This is both a design ethos and a technical implementation strategy.</p>
      <p>Among other benefits, designing for smaller screens first helps to place focus on the core experience (which feeds into to the 'cutting the mustard' technique alluded to above).</p>
      <p>In terms of implementation, it dictates a strategy for the use of media queries.</p>
      `
    },
    {
      name: 'Pattern library',
      url: 'pl',
      content: `
      <p><strong>The site will contain a living pattern library</strong></p>
      <p>All components will be displayed in a pattern library, which shares it's code with the main website, ensuring it stays up to date.</p>
      <p>A pattern library will help us to deliver a consistent user experience and promote the reuse of code. It also provides other benefits such as simplifying CSS regression testing.</p>
      `
    },
    {
      name: 'Performance',
      url: 'perf',
      content: `
      <p><strong>The site will deliver core content as fast as possible</strong> - need to determine exactly what this means - working on separate doc</p>
      <p>Performance needs to be a consideration throughout the build and we should always be mindful of limited hardware, poor latency, and low bandwidth situations.</p>
      <p>A performance budget should be used against which decesions about design, development, content, or any aspect of a site that may affect performance can be made.</p>
      <h3>Performance Budget</h3>
      <p>In progress…</p>
      `
    },
    {
      name: 'Accessibility',
      url: 'a11y',
      content: `
      <p><strong>The website will conform to WCAG 2.0 - level Double-A</strong></p>
      <p>The aim is to make the website accessible to the widest possible audience, regardless of the technology used to view it or the abilities of users. To this end, we aim to meet at least level Double-A conformance of the <a href="http://www.w3.org/TR/WCAG20/">Web Content Accessibility Guidelines (WCAG) 2.0</a>.</p>
      <p>The only exceptions to this will be where compliance is technically unfeasible and practical alternatives can be provided.</p>
      <p>In addition, although reliance on client side scripts are permitted in the guidelines, we will strive to ensure that core functionality and information is available without them, in keeping with the <a href="#pe">commitment to progressive enhancement, outlined above</a>.</p>
      `
    },
    {
      name: 'Browser/Device Support',
      url: 'support'
    }
  ],
  supportedBrowsers: [
    {
      type: 'Chrome (latest 2 versions)',
      supportLevel: 'Full'
    },
    {
      type: 'Safari (latest 2 versions)',
      supportLevel: 'Full'
    },
    {
      type: 'Firefox (latest 2 versions)',
      supportLevel: 'Full'
    },
    {
      type: 'Edge (latest 2 versions)',
      supportLevel: 'Full'
    },
    {
      type: 'Internet Explorer (latest 2 versions)',
      supportLevel: 'Full'
    },
    {
      type: 'Opera Mini (extreme mode)',
      supportLevel: 'Basic'
    },
    {
      type: 'iOS 9+ with Safari and Chrome',
      supportLevel: 'Full'
    },
    {
      type: 'Android 4.4+ with latest version of Chrome',
      supportLevel: 'Full'
    },
    {
      type: 'iOS 8 basic',
      supportLevel: 'Full'
    }
  ]
};
