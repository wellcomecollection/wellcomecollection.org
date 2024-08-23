// More on consent mode here:
// https://business-api.tiktok.com/portal/docs?id=1795929012554754
import { useEffect } from 'react';

const TikTokScript = ({
  hasMarketingConsent,
}: {
  hasMarketingConsent: boolean;
}) => {
  useEffect(() => {
    if (hasMarketingConsent) {
      window.ttq.grantConsent();
    } else {
      window.ttq.revokeConsent();
    }
  }, [hasMarketingConsent]);

  return (
    <script
      id="tiktok-pixel"
      dangerouslySetInnerHTML={{
        __html: `!function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ${!hasMarketingConsent ? 'ttq.holdConsent();' : ''}
        ttq.load('CP1ONKJC77UF1T0I8320');
        ttq.page();
      }(window, document, 'ttq');`,
      }}
    />
  );
};

export default TikTokScript;
