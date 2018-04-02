import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import Button from '../button/Button';
import { auth, provider } from '../firebase/Firebase';

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
        this.gmailLogin = this.gmailLogin.bind(this);
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

    gmailLogin() {
        auth.signInWithPopup(provider)
          .then((result) => {
              this.setState({
                  result
              });
          });
    }

    emailLogin() {
        const email = 'austin.ban@pop.belmont.edu';
        const password = '12345678';
        auth.signInWithEmailAndPassword(email, password).then((result) => {
            this.setState({user: result});
        });
    }

    emailSignUp() {
        const email = 'austin.ban@pop.belmont.edu';
        const password = '12345678';
        auth.createUserWithEmailAndPassword(email, password).then((result) => {
            this.setState({
                result
            });
            this.state.user.updateProfile({
                displayName: 'Jane Q. User',
            }).then(function() {
                // Update successful.
            }).catch(function(error) {
                // An error happened.
                console.log(error);
            });
        });
    }

    render() {
        const { user } = this.props;

        if(user) {
            return(
              <Button text="Log out" onClick={() => this.logout()} />
            );
        }
        return(
          <div>
            <Button text="Log in with google" onClick={() => this.gmailLogin()} />
            <Button text="Sign up with email" onClick={() => this.emailSignUp()} />
            <Button text="Login with email" onClick={() => this.emailLogin()} />
          </div>
        );
    }
}

export default CSSModules(LoginButton, styles, {allowMultiple: true});
