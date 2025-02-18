import React, { Component, ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorData: {
    message: string;
  };
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorData: { message: '' } };
  }

  // This method is invoked after an error has been thrown by a descendant component.
  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, errorData: { message: error.message } };
  }

  // You can also log the error to an error reporting service
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI for errors.
      return (
        <View style={styles.centered}>
          <Text style={styles.error}>Something went wrong.</Text>
          <Text style={styles.error}>{this.state.errorData.message}</Text>
        </View>
      );
    }

    // If no error, render children components normally.
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
  },
});

export default ErrorBoundary;