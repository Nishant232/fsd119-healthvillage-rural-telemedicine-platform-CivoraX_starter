import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('React Error Boundary caught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    padding: '20px',
                    textAlign: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    <div style={{
                        maxWidth: '600px',
                        padding: '40px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                        <h1 style={{ color: '#e74c3c', marginBottom: '16px' }}>
                            Something went wrong
                        </h1>
                        <p style={{ color: '#666', marginBottom: '24px' }}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details style={{
                                marginBottom: '24px',
                                textAlign: 'left',
                                backgroundColor: '#f5f5f5',
                                padding: '16px',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}>
                                <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
                                    Error Details
                                </summary>
                                <pre style={{
                                    overflow: 'auto',
                                    fontSize: '12px',
                                    color: '#333'
                                }}>
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
