import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.scss';
import Routes from '../../routes';
import CSSModules from 'react-css-modules';
import Favicon from 'react-favicon';

export type Props = {}
export type OwnProps = {}

class App extends React.Component<OwnProps & Props> {

    render() {
        return (
          <div styleName="container">
            <Favicon url="https://s3.amazonaws.com/ministoriessite/m.png" />
            <div styleName="nav">
              <Link to="/">Filterable Table</Link>
              <Link to="/about">About</Link>
            </div>

            { Routes }

          </div>
        );
    }

}

export default CSSModules(App, styles, {allowMultiple: true});
