import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';

export type Props = {}

export type OwnProps = {}

class Home extends React.Component<OwnProps & Props> {

    render() {
        return (
            <div styleName="container">
              Hello
            </div>
        );
    }

}

export default CSSModules(Home, styles, {allowMultiple: true});
