import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';

export type Props = {}

export type OwnProps = {}

class Button extends React.Component<OwnProps & Props> {
    static propTypes = {
        text: PropTypes.string,
        onClick: PropTypes.func,
        grey: PropTypes.bool,
        disabled: PropTypes.bool
    }

    render() {
        const { text, onClick, grey, disabled } = this.props;
        const buttonStyles = classNames('container', {grey}, {disabled});
        return (
            <button styleName={buttonStyles} onClick={onClick}>
              {text}
            </button>
        );
    }
}

export default CSSModules(Button, styles, {allowMultiple: true});
