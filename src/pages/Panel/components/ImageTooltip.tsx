import React, { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

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
        <ArrowPathIcon
          className="animate-spin h-5 w-5 inline mr-1"
          strokeWidth={3}
        />
      </div>
    </div>
  );
}

export default ImageTooltip;
