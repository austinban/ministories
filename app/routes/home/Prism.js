import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';

export type Props = {}

export type OwnProps = {}

class Prism extends React.Component<OwnProps & Props> {

    render() {
        return (
            <div styleName="prism">
              <img styleName="image" src="https://images.unsplash.com/photo-1507963901243-ebfaecd5f2f4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8f1afdd53eeeeebe1d5fe866294c6da9&auto=format&fit=crop&w=1979&q=80" />
            </div>
        );
    }

}

export default CSSModules(Prism, styles, {allowMultiple: true});
