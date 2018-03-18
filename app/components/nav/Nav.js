import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import Popup from '../popup/Popup';
import Button from '../button/Button';
import { auth, provider } from '../../components/firebase/Firebase';

export type Props = {}

export type OwnProps = {
  user: Object
}

class Nav extends React.Component<OwnProps & Props> {
    static propTypes = {
        user: PropTypes.object,
    }
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
        auth.signOut()
          .then(() => {
              this.setState({
                  user: null
              });
          });
        location.reload();
    }

    login() {
        auth.signInWithPopup(provider)
          .then((result) => {
              this.setState({
                  result
              });
          });
    }

    renderMenu() {
        const { user } = this.props;
        if(user) {
            return(
              <div styleName="options">
                <Popup user={user} />
                <Button text="Log out" onClick={this.logout} />
                <img styleName="profileImg" src={this.props.user.photoURL} />
              </div>
            );
        }
        return(
          <Button text="Log in" onClick={this.login} />
        );
    }

    renderImg() {
        const { user } = this.props;
        if(user) {
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
