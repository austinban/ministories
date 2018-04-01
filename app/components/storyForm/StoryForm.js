import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import firebase from '../firebase/Firebase';
import Button from '../button/Button';
import ReactGA from 'react-ga';

class StoryForm extends React.Component<> {
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
            submitted: false
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
        const date = this.getDate();
        const storiesRef = firebase.database().ref(`stories/${date}`);
        const item = {
            author: {
                id: user.uid,
                name: user.displayName || user.email,
            },
            body: body,
            prompt: prompt,
            date: date,
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
        this.setState({submitted: true});
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

        today = yyyy + mm + dd;
        return today;
    }

    toggleStoryForm() {
        this.setState({submitted: !this.state.submitted});
    }

    renderBody() {
        const { body, submitted } = this.state;
        const { prompt } = this.props;
        const storyLength = body.length;
        if(submitted) {
            return(
                <div styleName="confirmation">
                  <h2>Thanks for your story!</h2>
                  <div styleName="link" onClick={() => this.toggleStoryForm()}>Tell another story</div>
                </div>
            );
        }return(
            <form styleName="form" onSubmit={this.handleSubmit}>
              <textarea styleName="input" type="text" name="body" placeholder={prompt} onChange={this.handleChange} value={body} maxLength="750" />
              <div styleName={storyLength === 750 ? 'red' : ''}>{storyLength} / 750</div>
              <Button text="Submit story" grey disabled={this.isDisabled()} onClick={() => this.toggleForm()} />
            </form>
        );
    }

    render() {
        return(
            <div styleName="container">
              { this.renderBody() }
            </div>
        );
    }
}

export default CSSModules(StoryForm, styles, {allowMultiple: true});
