import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import firebase from '../firebase/Firebase';

export type Props = {}

export type OwnProps = {
  item: Object
}

class Page extends React.Component<OwnProps & Props> {
    static propTypes = {
        item: PropTypes.object.isRequired,
    }

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove();
    }

    render() {
        const { item } = this.props;
        const _this = this;

        return (
            <div styleName="container" key={item.id}>
              <div styleName="main-title">{item.author}</div>
              <div styleName="body">{item.body}</div>
              <button onClick={() => _this.removeItem(item.id)}>Remove Item</button>
            </div>
        );
    }
}

export default CSSModules(Page, styles, {allowMultiple: true});
