import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import firebase from '../firebase/Firebase';
import Button from '../button/Button';
import ReactGA from 'react-ga';

class PromptSubmit extends React.Component<> {
    static propTypes = {
        user: PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            date: '',
            body: '',
            submitted: false
        };
    }

    // Functions
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { date, body } = this.state;
        const storiesRef = firebase.database().ref(`prompts/${date}`);
        const item = {
            prompt: body
        };
        storiesRef.push(item);
        this.setState({
            body: '',
            date: ''
        });
        ReactGA.event({
            category: 'Prompt',
            action: 'Submitted'
        });
        this.setState({submitted: true});
    }

    isDisabled = () => {
        const { body, date } = this.state;

        let isDisabled = false;
        if(body.length < 1 || date.length < 1) {
            isDisabled = true;
        }
        return isDisabled;
    }

    toggleStoryForm = () => {
        this.setState({submitted: !this.state.submitted});
    }

    // Partials
    renderBody() {
        const { body, date, submitted } = this.state;
        if(submitted) {
            return(
                <div styleName="confirmation">
                  <h2>Thanks for your prompt!</h2>
                  <div styleName="link" onClick={() => this.toggleStoryForm()}>Tell another story</div>
                </div>
            );
        }return(
            <form styleName="form" onSubmit={this.handleSubmit}>
              <textarea styleName="input" type="text" name="date" placeholder={'Enter date here (yyyymmdd)'} onChange={this.handleChange} value={date} maxLength="750" />
              <textarea styleName="textarea" type="text" name="body" placeholder={'Enter prompt here'} onChange={this.handleChange} value={body} maxLength="750" />
              <Button text="Submit prompt" grey disabled={this.isDisabled()} />
            </form>
        );
    }

    // Render
    render() {
        return(
            <div styleName="container">
              { this.renderBody() }
            </div>
        );
    }
}

export default CSSModules(PromptSubmit, styles, {allowMultiple: true});
