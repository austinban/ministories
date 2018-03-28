import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import firebase, { auth } from '../../components/firebase/Firebase';
import Card from '../../components/card/Card';
import Nav from '../../components/nav/Nav';
import Loader from '../../components/loader/Loader';

export type Props = {}

export type OwnProps = {}

export type State = {
  body: string,
  author: string,
  stories: Array<string>,
  formOpen: boolean
}

class Home extends React.Component<OwnProps & Props, State> {
    constructor() {
        super();
        this.state = {
            stories: [],
            user: null
        };
    }

    // React lifcycle
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
        this.getStories();
    }

    // functions
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
        const { user } = this.state;
        if(user) {
            return(
              <div styleName="banner">
                <h1 styleName="banner-text">Welcome back, {user.displayName}!</h1>
                <p styleName="banner-subtext">I'm so glad you're here! </p>
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
        console.log('stories', stories);
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
        const { user } = this.state;
        return (
            <div styleName="wrapper">
              { <Nav user={user} /> }
              { this.renderBanner() }
              { this.renderCards() }
            </div>
        );
    }
}

export default CSSModules(Home, styles, {allowMultiple: true});
