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
    console.error({error, errorInfo});
  }

  render() {
    if (this.state.hasError) {
      return <p>{JSON.stringify(this.state.error)}</p>;
    }
    return this.props.children;
  }
}