import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import Button from '../button/Button';
import { auth, provider } from '../../components/firebase/Firebase';

export type Props = {}

export type OwnProps = {
  user: Object
}

class LoginButton extends React.Component<OwnProps & Props> {
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

    render() {
        const { user } = this.props;

        if(user) {
            return(
              <Button text="Log out" onClick={this.logout} />
            );
        }
        return(
          <Button text="Log in" onClick={this.login} />
        );
    }
}

export default CSSModules(LoginButton, styles, {allowMultiple: true});
