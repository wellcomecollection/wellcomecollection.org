/* eslint-disable no-useless-escape */

const PerformanceTimingTrackingScript = () => (
  <script
    id="performance-timing-tracking"
    dangerouslySetInnerHTML={{
      __html: `
        (function() {

        var siteSpeedSampleRate = 100;
        var gaCookiename = '_ga';
        var dataLayerName = 'dataLayer';

        // No need to edit anything after this line
        var shouldItBeTracked = function(siteSpeedSampleRate) {
            // If we don't pass a sample rate, default value is 1
            if (!siteSpeedSampleRate)
                siteSpeedSampleRate = 1;
            // Generate a hashId from a String
            var hashId = function(a) {
                var b = 1, c;
                if (a)
                    for (b = 0,
                    c = a.length - 1; 0 <= c; c--) {
                        var d = a.charCodeAt(c);
                        b = (b << 6 & 268435455) + d + (d << 14);
                        d = b & 266338304;
                        b = 0 != d ? b ^ d >> 21 : b
                    }
                return b
            }
            var clientId = ('; ' + document.cookie).split('; '+gaCookiename+'=').pop().split(';').shift().split(/GA1\.[0-9]\./)[1];
            if(!clientId) return !1;
            // If, for any reason the sample speed rate is higher than 100, let's keep it to a 100 max value
            var b = Math.min(siteSpeedSampleRate, 100);        
            return hashId(clientId) % 100 >= b ? !1 : !0
        }

        if (shouldItBeTracked(siteSpeedSampleRate)) {
            var pt = window.performance || window.webkitPerformance;
            pt = pt && pt.timing;
            if (!pt)
                return;
            if (pt.navigationStart === 0 || pt.loadEventStart === 0)
                return;
            var timingData = {
                "page_load_time": pt.loadEventStart - pt.navigationStart,
                "page_download_time": pt.responseEnd - pt.responseStart,
                "dns_time": pt.domainLookupEnd - pt.domainLookupStart,
                "redirect_response_time": pt.fetchStart - pt.navigationStart,
                "server_response_time": pt.responseStart - pt.requestStart,
                "tcp_connect_time": pt.connectEnd - pt.connectStart,
                "dom_interactive_time": pt.domInteractive - pt.navigationStart,
                "content_load_time": pt.domContentLoadedEventStart - pt.navigationStart
            };
            // Sanity Checks if any value is negative abort
            if (Object.values(timingData).filter(function(e) {
                if (e < 0)
                    return e;
            }).length > 0)
                return;
            window[dataLayerName] && window[dataLayerName].push({
                "event": "performance_timing",
                "timing": timingData
            })
        }
    }
    )()`,
    }}
  />
);

export default PerformanceTimingTrackingScript;
