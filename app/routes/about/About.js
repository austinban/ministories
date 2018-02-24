import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';

export type Props = {}

export type OwnProps = {}

class About extends React.Component<OwnProps & Props> {

    render() {
        return (
          <div styleName="container">
            Sup
          </div>
      );
    }

}
export default CSSModules(About, styles, {allowMultiple: true});
