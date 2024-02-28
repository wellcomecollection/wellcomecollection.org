const CivicUK = () => (
  <>
    <script
      src="https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js"
      type="text/javascript"
    ></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `CookieControl.load({
            product: 'COMMUNITY',
            apiKey: '73fee8f69cf633d66fae404ddd69d2559af7f887',
            branding: { removeIcon: true }, // PRO only
            necessaryCookies: ['toggle_*'],
            optionalCookies: [
              {
                name: 'analytics',
                label: 'Google Analytics, Segment, HotJar',
                description: 'Analytical cookies help us to improve our website by collecting and reporting information on its usage.',
                cookies: ['_ga', '_ga*', '_gid', '_gat', '__utma', '__utmt', '__utmb', '__utmc', '__utmz', '__utmv'],
                onAccept: function () {
                  const event = new CustomEvent('analyticsConsentChange', {});
                  window.dispatchEvent(event);
                },
                onRevoke: function () {
                  const event = new CustomEvent('analyticsConsentChange', {});
                  window.dispatchEvent(event);
                }
              }
            ],
          });`,
      }}
    />
  </>
);

export default CivicUK;
