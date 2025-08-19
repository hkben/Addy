import React, { useEffect, useState } from 'react';
import { RefreshCwIcon } from 'lucide-react';

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
        <RefreshCwIcon className="m-auto animate-spin" />
      </div>
    </div>
  );
}

export default ImageTooltip;
