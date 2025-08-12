import useCollectionStore from '@/common/hooks/useCollectionStore';
import React from 'react';

function ColorSelector() {
  const collection = useCollectionStore((state) => state.collection);

  const color = collection.color;

  const changeCollectionColor = useCollectionStore(
    (state) => state.changeCollectionColor
  );

  const colors = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="flex items-center gap-2">
      {colors.map((colorIndex) => (
        <span
          key={colorIndex}
          className={`${
            color === colorIndex ? 'active' : ''
          } color-selector color-${colorIndex}`}
          onClick={() => changeCollectionColor(collection.id, colorIndex)}
        />
      ))}
    </div>
  );
}

export default ColorSelector;
