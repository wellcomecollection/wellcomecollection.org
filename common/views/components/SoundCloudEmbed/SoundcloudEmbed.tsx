import { useRef, useEffect, useState } from 'react';

const SoundcloudEmbed = ({ embedUrl, caption }) => {
  const soundcloudIframeRef = useRef(null);
  const [scWidget, setScWidget] = useState(null);

  function setupScWidget() {
    SC && setScWidget(SC.Widget(soundcloudIframeRef));
    console.log({ scWidget });
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;

    document.body.appendChild(script);

    setupScWidget();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <iframe
      ref={soundcloudIframeRef}
      width="100%"
      height="20"
      frameBorder="none"
      src={embedUrl}
    />
  );
};

export default SoundcloudEmbed;
