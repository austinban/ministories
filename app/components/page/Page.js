import React from 'react';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';

export type Props = {}

export type OwnProps = {
  title?: string;
  body?: string;
}

class Page extends React.Component<OwnProps & Props> {
    static propTypes = {
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
    }

    renderTitle() {
        const { title } = this.props;
        if (title) {
            return(
              <div styleName="main-title">{title}</div>
            );
        }
        return '';
    }

    renderBody() {
        const { body } = this.props;
        if (body) {
            return(
              <div styleName="body">{body}</div>
            );
        }
        return '';
    }

    render() {
        return (
            <div styleName="container">
              { this.renderTitle() }
              { this.renderBody() }
            </div>
        );
    }
}

export default CSSModules(Page, styles, {allowMultiple: true});
