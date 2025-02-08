'use client'

import { useEffect, useState } from 'react';

export default function Page(){
	const [completion, setCompletion] = useState(null);
	const [loading, setLoading] = useState(true);
    
  const request = "what is today's date?";
	
	useEffect(() => {
    const fetchCompletion = async () => {
      setLoading(true);
      
      try {
        const res = await fetch('/api/get_ai_response', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: request }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch completion');
        }

        const data = await res.json();
        setCompletion(data.completion || 'No response from the API');
      } catch (error) {
        setCompletion('Error: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

		fetchCompletion();
  }, []);

  return (
        <div className="bg-white h-screen flex justify-center items-center text-black">
                <div className="flex items-center gap-10">
									{loading ? <p>Loading...</p> : <p>{completion}</p>}
                </div>
        </div>
  );
};