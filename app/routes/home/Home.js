import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import firebase, { auth } from '../../components/firebase/Firebase';
import Card from '../../components/card/Card';
import Nav from '../../components/nav/Nav';
import Footer from '../../components/footer/Footer';
import StoryForm from '../../components/storyForm/StoryForm';
import PromptSubmit from '../../components/promptSubmit/PromptSubmit';
import Loader from '../../components/loader/Loader';
import { getCurrentDate } from '../../lib/dates';

class Home extends React.Component<> {
    constructor() {
        super();
        this.state = {
            dates: [],
            stories: [],
            user: null,
            dailyPrompt: ''
        };
    }

    // React lifcycle
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
        this.getPrompt();
        this.getStories();
        this.getStoryDates();
    }

    // functions
    getPrompt() {
        const date = getCurrentDate();
        if(date === '20180401') {
            this.setState({dailyPrompt: 'What book should someone read every year?'});
        }else if(date === '20180402') {
            this.setState({dailyPrompt: 'What was the last movie to make you cry?'});
        }else if(date === '20180403') {
            this.setState({dailyPrompt: 'Who have you been avoiding?'});
        }else if(date === '20180404') {
            this.setState({dailyPrompt: 'Tell me about a time you felt complete.'});
        }else {
            this.setState({dailyPrompt: 'What are you grateful for?'});
        }
    }

    getStories() {
        const storiesRef = firebase.database().ref('stories');
        storiesRef.on('value', (snapshot) => {
            const dates = snapshot.val();
            const newState = [];

            for (const date in dates) {
                if(date) {
                    const dateRef = firebase.database().ref(`stories/${date}`);
                    dateRef.on('value', (snapshot2) => {
                        const stories = snapshot2.val();

                        for (const story in stories) {
                            if(story) {
                                newState.push({
                                    id: story,
                                    author: {
                                        id: stories[story].author.id,
                                        name: stories[story].author.name,
                                    },
                                    body: stories[story].body,
                                    prompt: stories[story].prompt,
                                    date: stories[story].date,
                                    likes: {
                                        count: stories[story].likes.count,
                                        users: stories[story].likes.users
                                    }
                                });
                            }
                        }
                    });
                }
            }
            this.setState({ stories: newState.reverse() });
        });
    }

    getStoryDates() {
        const storiesRef = firebase.database().ref('stories');
        storiesRef.on('value', (snapshot) => {
            const dates = snapshot.val();
            const newState = [];

            for (const date in dates) {
                if(date) { newState.push(date); }
            }

            this.setState({
                dates: newState.reverse()
            });
        });
    }

    // Render partials
    renderBanner() {
        const { user, dailyPrompt } = this.state;
        if(user) {
            return(
              <div styleName="banner">
                <h1 styleName="banner-text">{dailyPrompt}</h1>
                <p styleName="banner-subtext">Welcome back, {user.displayName}!</p>
              </div>
            );
        }return(
          <div styleName="banner">
            <h1 styleName="banner-text">Bite-size stories told everyday</h1>
            <p styleName="banner-subtext">This is the subtext</p>
          </div>
        );
    }

    renderCards() {
        const { user, stories } = this.state;
        if(stories.length > 0) {
            return(
              <div>
                <div styleName="cards">
                  { this.renderPromptSubmit() }
                  { this.renderStoryForm() }
                  {stories.map((story) => {
                      return (
                        <Card key={story.id} item={story} user={user} />
                      );
                  })}
                </div>
                { this.renderLoginMessage() }
              </div>
            );
        }return <Loader />;
    }

    renderStoryForm() {
        const { user, dailyPrompt } = this.state;
        if(user) {
            return(
              <StoryForm user={user} prompt={dailyPrompt} />
            );
        }return(null);
    }

    renderPromptSubmit() {
        const { user } = this.state;
        if(user) {
            return(
              <PromptSubmit user={user} />
            );
        }return(null);
    }

    renderLoginMessage() {
        const { user } = this.state;

        if(!user) {
            return(
              <div styleName="prompt">Log in to view more or tell your own story</div>
            );
        }return null;
    }

    // Render
    render() {
        const { user, dailyPrompt } = this.state;

        return (
            <div styleName="wrapper">
              <Nav user={user} prompt={dailyPrompt} />
              { this.renderBanner() }
              { this.renderCards() }
              <Footer user={user} />
            </div>
        );
    }
}

export default CSSModules(Home, styles, {allowMultiple: true});
