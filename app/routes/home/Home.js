import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import Prism from './Prism';

export type Props = {}

export type OwnProps = {}

class Home extends React.Component<OwnProps & Props> {

    render() {
        return (
            <div styleName="wrapper">
              <Prism />
              <Prism />
              <Prism />
              <Prism />
            </div>
        );
    }

}

export default CSSModules(Home, styles, {allowMultiple: true});
