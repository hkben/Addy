import React, { useEffect } from 'react';

import { ICollection } from '../interface';
import Storage from '../storage';
import CollectionButton from './modules/CollectionButton';
import _ from 'lodash';

function Content(props: {}) {
  const [text, setText] = React.useState<string>('');

  const [searchKeyword, setSearchKeyword] = React.useState<string>('');

  const [newCollectionButton, setNewCollectionButton] = React.useState<boolean>(
    false
  );

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
    setNewCollectionButton(false);

    let highlighted_text = document.getSelection()!;

    if (highlighted_text.type == 'None') {
      return;
    }

    let selection = highlighted_text?.toString() || '';
    let range = highlighted_text.getRangeAt(0);
    let rect = range.getBoundingClientRect();

    setText(selection);
    showBox(rect);
  };

  const showBox = (_rect: DOMRect) => {
    let { innerHeight: window_height, innerWidth: window_width } = window;

    let {
      top: selection_top,
      left: selection_left,
      height: selection_height,
      width: selection_width,
    } = _rect;

    let offset_height = 10;

    let box_height = 200;
    let box_width = 350;

    let isDisplayOnTop,
      isDisplayOnRight = false;

    if (selection_top >= window_height / 2) {
      isDisplayOnTop = true;
    }
    if (selection_left >= window_width / 2) {
      isDisplayOnRight = true;
    }

    //Add with Scroll position
    let top = selection_top + window.scrollY;
    let left = selection_left + window.scrollX;

    if (isDisplayOnTop) {
      //top
      top = top - box_height - offset_height;
    } else {
      //bottom
      top = top + selection_height + offset_height;
    }

    if (isDisplayOnRight) {
      //right
      left = left + selection_width - box_width;
    }

    setStyles({
      top: top,
      left: left,
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

  const newCollectionAndSave = async () => {
    await Storage.newCollectionAndSave(searchKeyword, text);
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
    let value = event.target.value;

    setSearchKeyword(value);

    if (value.length == 0) {
      setFilteredCollections(collections);
      setNewCollectionButton(false);
      return;
    }

    let filtered = _.filter(collections, (o) =>
      o.name.toLowerCase().includes(value.toLocaleLowerCase())
    );

    let sameName = _.filter(
      filtered,
      (o) => o.name.toLowerCase() == value.toLocaleLowerCase()
    );

    if (sameName.length > 0) {
      setNewCollectionButton(false);
    } else {
      setNewCollectionButton(true);
    }

    setFilteredCollections(filtered);
  };

  return (
    <div>
      {isDisplay ? (
        <div className="bookmark-popup" style={styles}>
          <div className="bp-header">
            <p className="bp-header-text">{text}</p>
            <div className="bp-header-close-btn" onClick={toggleBox}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
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

          <div className="bp-body">
            <div className="bp-search-box">
              <input
                id="bp-search"
                placeholder="Search Collection"
                type="text"
                onChange={searchCollection}
              />
            </div>

            <div className="bp-collections-list">
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
            {newCollectionButton ? (
              <div className="add-btn" onClick={newCollectionAndSave}>
                <span>New Collection</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Content;
