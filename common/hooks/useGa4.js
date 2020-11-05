import { useState, useEffect } from 'react';

const useGa4 = () => {
  const [ga4, setGa4] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGa4(window.gtag);
    }
  });

  return ga4;
};

export default useGa4;
