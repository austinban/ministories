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
  items: Array<string>,
  formOpen: boolean
}

class Home extends React.Component<OwnProps & Props, State> {
    constructor() {
        super();
        this.state = {
            items: [],
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

        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', (snapshot) => {
            const items = snapshot.val();
            const newState = [];
            for (const item in items) {
                if(item) {
                    newState.push({
                        id: item,
                        author: {
                            id: items[item].author.id,
                            name: items[item].author.name,
                        },
                        body: items[item].body,
                        prompt: items[item].prompt,
                        date: items[item].date,
                        likes: {
                            count: items[item].likes.count,
                            users: items[item].likes.users
                        }
                    });
                }
            }
            this.setState({
                items: newState.reverse()
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.user !== this.state.user) {
            // console.log('updates')
        }
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
        const { user, items } = this.state;
        const verifiedItems = user ? items : items.slice(0, 12);
        if(verifiedItems.length > 0) {
            return(
              <div>
                <div styleName="cards">
                  {verifiedItems.map((item) => {
                      return (
                        <Card key={item.id} item={item} user={user} />
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
