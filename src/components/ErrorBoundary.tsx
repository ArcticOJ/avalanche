import {Component} from 'react';

export default class ErrorBoundary extends Component<any> {
  state = {hasError: false, error: null};

  static getDerivedStateFromError(error) {
    return {
      hasError: !(error instanceof Promise),
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({error, errorInfo});
  }

  render() {
    if (this.state.hasError) {
      return this.state.error;
    }
    return this.props.children;
  }
}