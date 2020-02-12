import PropTypes, { Requireable } from 'prop-types';
import React, { ReactNode } from 'react';

export default class ContextProviderHoc extends React.Component<{ context: IContext }> {
  static childContextTypes: { insertCss: Requireable<(...args: void[]) => void> } = {
    insertCss: PropTypes.func
  };

  getChildContext(): IContext {
    const { context } = this.props;
    return { ...context };
  }

  render(): ReactNode {
    const { children, ...props } = this.props;
    if (React.isValidElement(children)) {
      return React.cloneElement(children, props);
    }

    return '';
  }
}
