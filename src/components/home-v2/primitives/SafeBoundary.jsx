import React from 'react';

/**
 * Keeps one decorative section from taking the page down: if a child throws
 * while rendering, show `fallback` (nothing by default) and log the error.
 * @extends {React.Component<{ children?: React.ReactNode, fallback?: React.ReactNode }, { failed: boolean }>}
 */
export default class SafeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('[home] a section failed to render', error);
  }

  render() {
    return this.state.failed ? this.props.fallback || null : this.props.children;
  }
}
