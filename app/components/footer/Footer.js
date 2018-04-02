import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import LoginOrSignup from '../loginOrSignup/LoginOrSignup';

export type Props = {}

export type OwnProps = {
  user: Object,
  prompt: string
}

class Footer extends React.Component<OwnProps & Props> {
    static propTypes = {
        user: PropTypes.object,
    }

    render() {
        const { user } = this.props;

        return (
            <div styleName="container">
              <LoginOrSignup user={user} />
            </div>
        );
    }
}

export default CSSModules(Footer, styles, {allowMultiple: true});
