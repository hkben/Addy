import React from 'react';

import { ICollection } from '../interface';
import Storage from '../storage';
import CollectionButton from './modules/CollectionButton';
import _ from 'lodash';

interface QuickMenuState {
  isDispaly: boolean;
  text: string;
  collections: ICollection[];
  styles: {
    top: number;
    left: number;
  };
}

class Content extends React.Component<{}, QuickMenuState> {
  constructor(props: {}) {
    super(props);

    this.toggleBox = this.toggleBox.bind(this);
  }

  state = {
    text: '',
    isDispaly: false,
    styles: {
      top: 0,
      left: 0,
    },
    collections: [] as ICollection[],
  };

  async getHighlightedText() {
    this.state.collections = (await Storage.getCollections()) as ICollection[];

    let highlighted_text = document.getSelection()!;

    if (highlighted_text.type == 'None') {
      return;
    }

    let selection = highlighted_text?.toString() || '';
    let range = highlighted_text.getRangeAt(0);
    let rect = range.getBoundingClientRect();

    this.showBox(selection, rect);
  }

  showBox(_selection: string, _rect: DOMRect) {
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

    this.setState({
      text: _selection,
      isDispaly: true,
      styles: {
        top: selectionTop,
        left: selectionLeft,
      },
    });
  }

  toggleBox() {
    let _isDisplay = this.state.isDispaly;
    _isDisplay = _isDisplay ? false : true;
    this.setState({ isDispaly: _isDisplay });
  }

  async saveTextToCollection(name: string) {
    await Storage.saveItemToCollection(name, this.state.text);
    this.toggleBox();
  }

  async componentDidMount() {
    console.log('componentDidMount');
    this.getHighlightedText();
  }

  render() {
    const _isDispaly = this.state.isDispaly;

    if (_isDispaly) {
      return (
        <div className="floating-box" style={this.state.styles}>
          <div className="floating-box-header">
            <p>{this.state.text}</p>
            <div className="pointer" onClick={this.toggleBox}>
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
            {this.state.collections.map((collection, index) => {
              let findExits = _.filter(
                collection.items,
                (i) => i.text == this.state.text
              );

              let isExists = findExits.length > 0 ? true : false;

              return (
                <CollectionButton
                  key={index}
                  collectionName={collection.name}
                  isExists={isExists}
                  onClick={() => this.saveTextToCollection(collection.id)}
                />
              );
            })}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Content;
