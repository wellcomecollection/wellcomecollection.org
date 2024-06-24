const CoreWebVitalsScript = () => (
  <>
    <script
      id="web-vitals-ga4"
      dangerouslySetInnerHTML={{
        __html: `/*
          * Send Core Web Vitals to the DataLayer 
          * v3.0
          */
          function sendToDataLayer(metric) {

            var rating = metric.rating;
            var attribution = metric.attribution;

            var debugTarget = attribution ? attribution.largestShiftTarget||attribution.element||attribution.eventTarget||'' : '(not set)';

            var webVitalsMeasurement =  {
              name: metric.name,
              id: metric.id, 
              value: metric.value,
              delta: metric.delta,
              rating: rating,
              valueRounded: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
              deltaRounded: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
              event_time: attribution ? attribution.largestShiftTime||(attribution.lcpEntry&&attribution.lcpEntry.startTime)||attribution.eventTime||'': ''
            };

            dataLayer.push({
                event: 'coreWebVitals', 
                webVitalsMeasurement: webVitalsMeasurement
            });
          }`,
      }}
    />
    <script
      id="web-vitals-cdn"
      dangerouslySetInnerHTML={{
        __html: `/*
          * Using the web-vitals script from a CDN
          * 
          * https://github.com/GoogleChrome/web-vitals#from-a-cdn
          * 
          * Modified to call the sendToDataLayer function on events
          * 
          */
          
          (function() {
            var script = document.createElement('script');
            script.src = 'https://unpkg.com/web-vitals@3.0.0/dist/web-vitals.attribution.iife.js';
            script.onload = function() {
              // When loading "web-vitals" using a classic script, all the public
              // methods can be found on the "webVitals" global namespace.
              webVitals.onCLS(sendToDataLayer);
              webVitals.onFID(sendToDataLayer);
              webVitals.onLCP(sendToDataLayer);
              webVitals.onFCP(sendToDataLayer);
              webVitals.onTTFB(sendToDataLayer);
              webVitals.onINP(sendToDataLayer);
            }
            document.head.appendChild(script);
          }());`,
      }}
    />
  </>
);

export default CoreWebVitalsScript;
