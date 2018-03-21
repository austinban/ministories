import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import firebase from '../firebase/Firebase';
import classNames from 'classnames';

class Card extends React.Component<> {
    static propTypes = {
        item: PropTypes.object.isRequired,
        user: PropTypes.object
    }

    // Functions
    removeStory(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove();
    }

    likeStory(item) {
        const itemId = item.id;
        const { user } = this.props;

        // Can only like if you've logged in and you haven't liked it before
        const canLike = user && (!item.likes.users || !Object.values(item.likes.users).includes(user.uid));

        if(canLike) {
            const itemLikeRef = firebase.database().ref(`/items/${itemId}/likes/count`);
            itemLikeRef.transaction(function like(currentLikes) {
                return currentLikes + 1;
            });
            const itemLikersRef = firebase.database().ref(`/items/${itemId}/likes/users`);
            itemLikersRef.push(
                user.uid
            );
        }
    }

    hasLikedStory() {
        const { item, user } = this.props;
        return item.likes.users && Object.values(item.likes.users).includes(user.uid);
    }

    // Render Partials
    renderRemoveButton() {
        const { item, user } = this.props;
        if(user && item.author.id === user.uid) {
            return(
                <div styleName="remove" onClick={() => this.removeStory(item.id)}>X</div>
            );
        }
        return null;
    }

    renderLikes() {
        const { item } = this.props;
        const likeStyles = classNames('like', this.hasLikedStory() ? 'liked' : '');
        return(
            <div styleName={likeStyles} onClick={() => this.likeStory(item)}>{item.likes.count >= 0 ? item.likes.count : 0}</div>
        );
    }

    renderLikeUsers() {
        return(
            <div></div>
        );
    }

    // Render
    render() {
        const { item } = this.props;
        let initials = item.author.name.match(/\b\w/g) || [];
        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

        return (
            <div styleName="container" key={item.id}>
              <div styleName="prompt">{item.prompt}</div>
              <div styleName="body">{item.body}</div>
              <div styleName="author">-{initials}</div>
              { this.renderRemoveButton() }
              { this.renderLikes() }
              { this.renderLikeUsers() }
            </div>
        );
    }
}

export default CSSModules(Card, styles, {allowMultiple: true});
