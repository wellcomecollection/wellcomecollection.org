
/* global google */

export function loadMapScript (callback) {
  const script = window.document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCcrz-MyrCbbJNrpFpPXxUFl16FFGmOBKs&callback=${callback}`;
  script.async = true;
  script.defer = true;
  script.type = 'text/javascript';
  document.head.appendChild(script);
}

export function createMap (el) {
  const mapCanvas = el;
  const latLng = {
    lat: Number(el.getAttribute('data-latitude')),
    lng: Number(el.getAttribute('data-longitude'))
  };
  const mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    }
  };
  const map = new google.maps.Map(mapCanvas, mapOptions);
  const locationTitle = el.getAttribute('data-title');
  const marker = new google.maps.Marker({ // eslint-disable-line no-unused-vars
    position: latLng,
    map: map,
    title: locationTitle
  });
};
