import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import firebase, { auth } from '../../components/firebase/Firebase';
import Card from '../../components/card/Card';
import Nav from '../../components/nav/Nav';
import Loader from '../../components/loader/Loader';


class Home extends React.Component<> {
    constructor() {
        super();
        this.state = {
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
    }

    // functions
    getPrompt() {
        const date = this.getDate();
        if(date === '20180331') {
            this.setState({dailyPrompt: 'Who is your favorite person?'});
        }else if(date === '20180332') {
            this.setState({dailyPrompt: 'Who is your enemy?'});
        }else {
            this.setState({dailyPrompt: 'Who do you hate?'});
        }
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

            this.setState({
                stories: newState.reverse()
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
        const verifiedstories = user ? stories : stories.slice(0, 12);
        if(verifiedstories.length > 0) {
            return(
              <div>
                <div styleName="cards">
                  {verifiedstories.map((story) => {
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
              { <Nav user={user} prompt={dailyPrompt} /> }
              { this.renderBanner() }
              { this.renderCards() }
            </div>
        );
    }
}

export default CSSModules(Home, styles, {allowMultiple: true});
