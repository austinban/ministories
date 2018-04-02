import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import Popup from '../popup/Popup';
import LoginOrSignup from '../loginOrSignup/LoginOrSignup';
export type Props = {}

export type OwnProps = {
  user: Object,
  prompt: string
}

class Nav extends React.Component<OwnProps & Props> {
    static propTypes = {
        user: PropTypes.object,
        prompt: PropTypes.string
    }

    renderMenu() {
        const { user, prompt } = this.props;

        if(user) {
            return(
              <div styleName="options">
                <Popup user={user} prompt={prompt} />
                <LoginOrSignup user={user} />
                { this.renderImg() }
              </div>
            );
        }
        return(
          <LoginOrSignup user={user} />
        );
    }

    renderImg() {
        const { user } = this.props;
        console.log('user.photoURL', user.photoURL);
        if(user.photoURL) {
            return(
              <img styleName="profileImg" src={this.props.user.photoURL} />
            );
        }
        return null;
    }

    render() {
        return (
            <div styleName="container">
              <h1 styleName="logo">Ministori.es</h1>
              { this.renderMenu() }
            </div>
        );
    }
}

export default CSSModules(Nav, styles, {allowMultiple: true});
