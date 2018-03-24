import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import firebase from '../firebase/Firebase';
import Button from '../button/Button';

export type Props = {}

export type OwnProps = {
  user: Object
}

class Popup extends React.Component<OwnProps & Props> {
    static propTypes = {
        user: PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            body: '',
            author: '',
            formOpen: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { user } = this.props;
        const { body } = this.state;
        const itemsRef = firebase.database().ref('items');
        const item = {
            author: {
                id: user.uid,
                name: user.displayName || user.email,
            },
            body: body,
            prompt: 'What are you grateful for?',
            date: Date(),
            likes: {
                count: 0,
                users: null
            }
        };
        itemsRef.push(item);
        this.setState({
            body: '',
            author: ''
        });
    }

    toggleForm() {
        this.setState({formOpen: !this.state.formOpen});
    }

    isDisabled() {
        const { body } = this.state;

        let isDisabled = false;
        if(body.length < 1 || (new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?').test(body))) {
            isDisabled = true;
        }
        return isDisabled;
    }


    render() {
        const { body } = this.state;
        const popupClasses = classNames('popup-wrapper', this.state.formOpen ? '' : 'hidden');
        const storyLength = body.length;
        return(
            <div>
              <Button text="Write a story" onClick={() => this.toggleForm()}/>
              <div styleName={popupClasses}>
                <div styleName="popup">
                  <div styleName="close-icon" onClick={() => this.toggleForm()}>X</div>
                  <form styleName="form" onSubmit={this.handleSubmit}>
                    <h1 styleName="popup-header">Today, I am grateful for...</h1>
                    <textarea styleName="input" type="text" name="body" placeholder="What are you grateful for?" onChange={this.handleChange} value={body} maxLength="750" />
                    <div styleName={storyLength === 750 ? 'red' : ''}>{storyLength} / 750</div>
                    <Button text="Submit story" grey disabled={this.isDisabled()} onClick={() => this.toggleForm()} />
                  </form>
                </div>
              </div>
            </div>
        );
    }
}

export default CSSModules(Popup, styles, {allowMultiple: true});
