import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import firebase from '../../components/firebase/Firebase';
export type Props = {}

export type OwnProps = {}

export type State = {
  currentItem: string,
  username: string,
  items: Array<string>
}

class Home extends React.Component<OwnProps & Props, State> {
    constructor() {
        super();
        this.state = {
            currentItem: '',
            username: '',
            items: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', (snapshot) => {
            const items = snapshot.val();
            const newState = [];
            for (const item in items) {
                if(item) {
                    newState.push({
                        id: item,
                        title: items[item].title,
                        user: items[item].user
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
            title: this.state.currentItem,
            user: this.state.username
        };
        itemsRef.push(item);
        this.setState({
            currentItem: '',
            username: ''
        });
    }

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove();
    }

    render() {
        return (
            <div styleName="wrapper">
              <div styleName="book-binder">
                <div>
                  <section>
                      <form onSubmit={this.handleSubmit}>
                        <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.username} />
                        <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
                        <button>Add Item</button>
                      </form>
                  </section>
                  <section>
                    <div>
                      <ul>
                        {this.state.items.map((item) => {
                            return (
                              <li key={item.id}>
                                <h3>{item.title}</h3>
                                <p>brought by: {item.user}</p>
                                <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                              </li>
                            );
                        })}
                      </ul>
                    </div>
                  </section>
                </div>
              </div>
            </div>
        );
    }

}

export default CSSModules(Home, styles, {allowMultiple: true});
