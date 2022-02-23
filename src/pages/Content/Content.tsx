import React, { useEffect } from 'react';

import { ICollection } from '../interface';
import Storage from '../storage';
import CollectionButton from './modules/CollectionButton';
import _ from 'lodash';

function Content(props: {}) {
  const [text, setText] = React.useState<string>('');

  const [isDisplay, setIsDisplay] = React.useState<boolean>(false);

  const [styles, setStyles] = React.useState<object>({
    top: 0,
    left: 0,
  });

  const [collections, setCollections] = React.useState<ICollection[]>(
    [] as ICollection[]
  );

  const [filteredCollections, setFilteredCollections] = React.useState<
    ICollection[]
  >([] as ICollection[]);

  const getHighlightedText = async () => {
    let _collections = (await Storage.getCollections()) as ICollection[];

    setCollections(_collections);
    setFilteredCollections(_collections);

    let highlighted_text = document.getSelection()!;

    if (highlighted_text.type == 'None') {
      return;
    }

    let selection = highlighted_text?.toString() || '';
    let range = highlighted_text.getRangeAt(0);
    let rect = range.getBoundingClientRect();

    showBox(selection, rect);
  };

  const showBox = (_selection: string, _rect: DOMRect) => {
    let windowHeight = window.innerHeight;

    let { top, left, height, width } = _rect;

    let offset_height = 20;

    let isDisplayOnTop = false;

    if (top >= windowHeight / 2) {
      isDisplayOnTop = true;
    }

    let selectionTop = top + window.scrollY;
    let selectionLeft = left + window.scrollX;

    if (isDisplayOnTop) {
      //top
      selectionTop = selectionTop - offset_height - 100;
    } else {
      //bottom
      selectionTop = selectionTop + offset_height * 2;
    }

    setText(_selection);
    setStyles({
      top: selectionTop,
      left: selectionLeft,
    });
    setIsDisplay(true);
  };

  const toggleBox = () => {
    let _isDisplay = isDisplay ? false : true;
    setIsDisplay(_isDisplay);
  };

  const saveTextToCollection = async (name: string) => {
    await Storage.saveItemToCollection(name, text);
    toggleBox();
  };

  const handleEvent = (event: Event) => {
    getHighlightedText();
  };

  useEffect(() => {
    getHighlightedText();

    window.addEventListener('onExtensionAction', handleEvent);
    return () => {
      window.removeEventListener('onExtensionAction', handleEvent);
    };
  }, []);

  const searchCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.toLocaleLowerCase();

    if (value.length == 0) {
      setFilteredCollections(collections);
      return;
    }

    let result = _.filter(collections, (o) =>
      o.name.toLowerCase().includes(value)
    );

    setFilteredCollections(result);
  };

  return (
    <div>
      {isDisplay ? (
        <div className="floating-box" style={styles}>
          <div className="floating-box-header">
            <p>{text}</p>
            <div className="pointer" onClick={toggleBox}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="floating-box-body">
            <div className="search-box">
              <input
                id="search"
                placeholder="Search Collection"
                type="text"
                onChange={searchCollection}
              />
            </div>

            <div className="collections-list">
              {filteredCollections.map((collection, index) => {
                let findExits = _.filter(
                  collection.items,
                  (i) => i.text == text
                );

                let isExists = findExits.length > 0 ? true : false;

                return (
                  <CollectionButton
                    key={index}
                    collectionName={collection.name}
                    isExists={isExists}
                    onClick={() => saveTextToCollection(collection.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Content;
