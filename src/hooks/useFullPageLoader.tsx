import React, { useState } from 'react';
import FullPageLoader from '../components/FullPageLoader';

const useFullPageLoader = () => {
  const [loading, setLoading] = useState(false);

  return [
    loading ? <FullPageLoader /> : null, 
    () => setLoading(true), // shows the loader
    () => setLoading(false) // hide the loader
  ] as const;
};

export default useFullPageLoader;