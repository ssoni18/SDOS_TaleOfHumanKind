import React, { useState, useEffect } from 'react';
import "../css/userProfile.css";

export default function Counter({ limit, description}) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (counter < limit) {
        setCounter(counter + 1);
      }
    }, 10);

    return () => {
      clearTimeout(timeout);
    };
  }, [counter, limit]);
  return (<>
        <h6 className="count h2">{counter}</h6>
        <p className="m-0px font-w-600"><center>{description}</center></p>
  </>
      
  );
}
