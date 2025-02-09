'use client'; 

import { useEffect, useRef } from 'react';

const GoogleSearchBox = () => {
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cse.google.com/cse.js?cx=f0725e85992914228";
    script.async = true;
    document.head.appendChild(script);

    if (searchContainerRef.current && !searchContainerRef.current.querySelector('.gcse-search')) {
      const searchDiv = document.createElement('div');
      searchDiv.className = 'gcse-search';
      searchContainerRef.current.appendChild(searchDiv);
    }

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div ref={searchContainerRef} className="w-[50vw] rounded-md"></div>;
};

export default GoogleSearchBox;