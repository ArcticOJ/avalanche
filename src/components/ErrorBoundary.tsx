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
    console.error({error, errorInfo});
  }

  render() {
    if (this.state.hasError) {
      return <p>{this.state.error.message}</p>;
    }
    return this.props.children;
  }
}