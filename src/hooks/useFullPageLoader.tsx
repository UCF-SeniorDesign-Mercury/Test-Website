import React, { useState } from 'react';
import FullPageLoader from '../components/FullPageLoader';

const useFullPageLoader = () => {
  const [loading, setLoading] = useState(false);

  return [
    loading ? <FullPageLoader /> : null, 
    () => setLoading(true), // shows the loader
    async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    }
  ] as const;
};

export default useFullPageLoader;