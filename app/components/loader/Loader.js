import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';

export type Props = {}

export type OwnProps = {}

class Loader extends React.Component<OwnProps & Props> {
    static propTypes = {
        text: PropTypes.string
    }

    render() {
        const { text } = this.props;
        return (
            <div styleName="container">
              <div styleName="ball"></div>
              <div styleName="ball"></div>
              <div styleName="ball"></div>
              <div styleName="ball"></div>
              {text}
            </div>
        );
    }
}

export default CSSModules(Loader, styles, {allowMultiple: true});
