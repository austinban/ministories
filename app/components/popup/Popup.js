import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import firebase from '../firebase/Firebase';
import Button from '../button/Button';
import ReactGA from 'react-ga';

class Popup extends React.Component<> {
    static propTypes = {
        user: PropTypes.object,
        prompt: PropTypes.string,
    }

    static defaultProps = {
        prompt: 'What are you happy about today?'
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
        const { user, prompt } = this.props;
        const { body } = this.state;
        const trimmedPrompt = this.getTrimmedPrompt();
        const storiesRef = firebase.database().ref(`stories/${trimmedPrompt}`);
        const item = {
            author: {
                id: user.uid,
                name: user.displayName || user.email,
            },
            body: body,
            prompt: prompt,
            date: Date(),
            likes: {
                count: 0,
                users: null
            }
        };
        storiesRef.push(item);
        this.setState({
            body: '',
            author: ''
        });
        ReactGA.event({
            category: 'Story',
            action: 'Published'
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

    getDate() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        if(dd < 10) { dd = '0' + dd; }
        if(mm < 10) { mm = '0' + mm; }

        today = dd + mm + yyyy;
        return today;
    }

    getTrimmedPrompt() {
        const { prompt } = this.props;
        const trimmedPrompt = prompt.replace(/\s/g, '').replace(/[^a-zA-Z ]/g, '').toLowerCase();
        return trimmedPrompt;
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
