import React, { useEffect, useState } from 'react';

interface Prop {
  imageSrc: string;
}

function ImageTooltip(props: Prop) {
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    setIsLoad(false);
  }, [props.imageSrc]);

  return (
    <div className="py-2">
      <img
        className={`${isLoad ? 'block' : 'hidden'} max-h-80 z-40`}
        src={props.imageSrc}
        alt=""
        onLoad={() => {
          setIsLoad(true);
        }}
      />

      <div className={`${isLoad ? 'hidden' : 'block'} w-32 text-center py-16`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin h-5 w-5 inline mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#bbb"
            fill="none"
            strokeWidth={3}
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            strokeDashoffset="100"
            strokeDasharray="50"
            strokeWidth={3}
          />
        </svg>
      </div>
    </div>
  );
}

export default ImageTooltip;
