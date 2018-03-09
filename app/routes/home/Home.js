import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import firebase, { auth, provider } from '../../components/firebase/Firebase';
import Card from '../../components/card/Card';

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
            body: '',
            author: '',
            items: [],
            formOpen: false,
            user: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

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
                        author: items[item].author,
                        body: items[item].body
                    });
                }
            }
            this.setState({
                items: newState
            });
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');
        const item = {
            author: this.state.user.displayName || this.state.user.email,
            body: this.state.author
        };
        itemsRef.push(item);
        this.setState({
            body: '',
            author: ''
        });
    }

    logout() {
        auth.signOut()
          .then(() => {
              this.setState({
                  user: null
              });
          });
    }

    login() {
        auth.signInWithPopup(provider)
          .then((result) => {
              this.setState({
                  result
              });
          });
    }

    toggleForm() {
        this.setState({formOpen: !this.state.formOpen});
    }

    renderForm() {
        const popupClasses = classNames('popup-wrapper', this.state.formOpen ? '' : 'hidden');
        return(
            <div styleName={popupClasses}>
              <div styleName="popup">
                <div styleName="close-icon" onClick={() => this.toggleForm()}>X</div>
                <form styleName="form" onSubmit={this.handleSubmit}>
                  <textarea styleName="input" type="text" name="author" placeholder="What's your name?" onChange={this.handleChange} value={this.state.author} />
                  <textarea styleName="input" type="text" name="body" placeholder="What are you grateful for?" onChange={this.handleChange} value={this.state.body} />
                  <button onClick={() => this.toggleForm()}>Add Item</button>
                </form>
              </div>
            </div>
        );
    }

    render() {
        return (
            <div styleName="wrapper">
              {this.state.user ? <img styleName="profileImg" src={this.state.user.photoURL} />
              :
              <div>You must be logged in to see everything you dingus</div>}
              {this.state.user ?
                <button onClick={this.logout}>Log Out</button>
                :
                <button onClick={this.login}>Log In</button>
              }
              <div styleName="button" onClick={() => this.toggleForm()}>Submit Answer</div>
              <div styleName="cards">
                {this.state.items.map((item) => {
                    return (
                      <Card key={item.id} item={item} />
                    );
                })}
              </div>
              { this.renderForm() }
            </div>
        );
    }

}

export default CSSModules(Home, styles, {allowMultiple: true});
