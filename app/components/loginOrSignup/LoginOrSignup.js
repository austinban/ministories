import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import Button from '../button/Button';
import ReactGA from 'react-ga';
import { auth, provider } from '../firebase/Firebase';

class LoginOrSignup extends React.Component<> {
    static propTypes = {
        user: PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            formOpen: false,
            alreadyHasAccount: false,
            errorMessage: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.gmailLogin = this.gmailLogin.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    toggleForm() {
        this.setState({formOpen: !this.state.formOpen});
    }

    toggleHasAccount() {
        this.setState({alreadyHasAccount: !this.state.alreadyHasAccount});
    }

    isDisabled() {
        const { email, password, firstName, lastName, alreadyHasAccount } = this.state;

        if(alreadyHasAccount) {
            return email.length <= 0 || password.length <= 0;
        }
        return email.length <= 0 || password.length <= 0 || firstName.length <= 0 || lastName.length <= 0;
    }

    gmailLogin() {
        auth.signInWithPopup(provider)
          .then((result) => {
              this.setState({
                  result
              });
              this.clearInputs();
          });
        ReactGA.event({
            category: 'User',
            action: 'Logged in via Gmail'
        });
    }

    emailLogin() {
        const { email, password } = this.state;

        auth.signInWithEmailAndPassword(email, password);
        this.clearInputs();
        ReactGA.event({
            category: 'User',
            action: 'Logged in via email'
        });
    }

    emailSignUp() {
        const { email, password, firstName, lastName} = this.state;

        auth.createUserWithEmailAndPassword(email, password).then(function updateUser() {
            const refUser = auth.currentUser;
            refUser.updateProfile({
                displayName: firstName + ' ' + lastName,
            }).catch((error) => {
                this.setState({errorMessage: error});
            });
        });
        this.clearInputs();
        ReactGA.event({
            category: 'User',
            action: 'Signed up'
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {alreadyHasAccount} = this.state;
        if(alreadyHasAccount) {
            this.emailLogin();
        }else{
            this.emailSignUp();
        }
    }

    clearInputs() {
        this.setState({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            formOpen: false
        });
    }

    logout() {
        auth.signOut()
          .then(() => {
              this.setState({
                  user: null
              });
          });
        location.reload();
        ReactGA.event({
            category: 'User',
            action: 'Logged out'
        });
    }

    renderForm() {
        const { email, password, firstName, lastName, alreadyHasAccount} = this.state;
        if(alreadyHasAccount) {
            return(
              <form onSubmit={this.handleSubmit}>
                <h2>Log in</h2>
                <input styleName="input" type="text" name="email" placeholder="email" onChange={this.handleChange} value={email} />
                <input styleName="input" type="password" name="password" placeholder="password" onChange={this.handleChange} value={password} />
                <Button text="Login" grey disabled={this.isDisabled()} />
                <div onClick={() => this.toggleHasAccount()}>Don't have an account?</div>
              </form>
            );
        }
        return(
          <form onSubmit={this.handleSubmit}>
            <h2>Sign up</h2>
            <div styleName="name-wrapper">
              <input styleName="input" type="text" name="firstName" placeholder="First name" onChange={this.handleChange} value={firstName} />
              <input styleName="input" type="text" name="lastName" placeholder="Last name" onChange={this.handleChange} value={lastName} />
            </div>
            <input styleName="input" type="text" name="email" placeholder="email" onChange={this.handleChange} value={email} />
            <input styleName="input" type="password" name="password" placeholder="password" onChange={this.handleChange} value={password} />
            <Button text="Signup" grey disabled={this.isDisabled()} />
            <div onClick={() => this.toggleHasAccount()}>Already have an account?</div>
          </form>
        );
    }

    renderButton() {
        const { user } = this.props;
        if(user) {
            return(
                <Button text="logout" onClick={() => this.logout()}/>
            );
        }
        return <Button text="Login or signup" onClick={() => this.toggleForm()}/>;
    }

    render() {
        const popupClasses = classNames('popup-wrapper', this.state.formOpen ? '' : 'hidden');
        return(
          <div>
            { this.renderButton() }
            <div styleName={popupClasses}>
              <div styleName="popup">
                <div styleName="close-icon" onClick={() => this.toggleForm()}>X</div>
                { this.renderForm() }
                <Button grey text="Log in with google" onClick={() => this.gmailLogin()} />
              </div>
            </div>
          </div>
        );
    }
}

export default CSSModules(LoginOrSignup, styles, {allowMultiple: true});
