import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import firebase from '../firebase/Firebase';
import classNames from 'classnames';
import ReactGA from 'react-ga';

class Card extends React.Component<> {
    static propTypes = {
        item: PropTypes.object.isRequired,
        user: PropTypes.object
    }

    // Functions
    removeStory() {
        const {item} = this.props;
        const itemId = item.id;
        const date = item.date;
        const itemRef = firebase.database().ref(`/stories/${date}/${itemId}`);
        itemRef.remove();
        ReactGA.event({
            category: 'Story',
            action: 'Removed'
        });
    }

    likeStory() {
        const { user, item } = this.props;
        const itemId = item.id;
        const date = item.date;

        // Can only like if you've logged in and you haven't liked it before
        const canLike = user && (!item.likes.users || !Object.values(item.likes.users).includes(user.uid));

        if(canLike) {
            const itemLikeRef = firebase.database().ref(`/stories/${date}/${itemId}/likes/count`);
            itemLikeRef.transaction(function like(currentLikes) {
                return currentLikes + 1;
            });
            const itemLikersRef = firebase.database().ref(`/stories/${date}/${itemId}/likes/users`);
            itemLikersRef.push(
                user.uid
            );
        }
        ReactGA.event({
            category: 'Story',
            action: 'Liked'
        });
    }

    hasLikedStory() {
        const { item, user } = this.props;
        return user && item.likes.users && Object.values(item.likes.users).includes(user.uid);
    }

    // Render Partials
    renderRemoveButton() {
        const { item, user } = this.props;
        if(user && item.author.id === user.uid) {
            return(
                <div styleName="remove" onClick={() => this.removeStory()}>X</div>
            );
        }
        return null;
    }

    renderLikes() {
        const { item } = this.props;
        const likeStyles = classNames('like', this.hasLikedStory() ? 'liked' : '');
        return(
            <div styleName={likeStyles} onClick={() => this.likeStory()}>{item.likes.count >= 0 ? item.likes.count : 0}</div>
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
              <h2 styleName="prompt">{item.prompt}</h2>
              <p styleName="body">{item.body}</p>
              <div styleName="author">-{initials}</div>
              { this.renderRemoveButton() }
              { this.renderLikes() }
              { this.renderLikeUsers() }
            </div>
        );
    }
}

export default CSSModules(Card, styles, {allowMultiple: true});
