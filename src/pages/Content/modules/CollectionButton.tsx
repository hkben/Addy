import React from 'react';

interface Prop {
  collectionName: string;
  isExists: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

class CollectionButton extends React.Component<Prop> {
  constructor(props: Prop) {
    super(props);

    // this.newCollection = this.newCollection.bind(this);
    // document.addEventListener('mouseup', this.onMouseUp);
  }

  render() {
    return (
      <div
        className="add-collection-button pointer"
        onClick={this.props.onClick}
      >
        #<span>{this.props.collectionName}</span>
        {this.props.isExists ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : null}
      </div>
    );
  }
}

export default CollectionButton;
