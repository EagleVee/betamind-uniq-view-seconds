import React from 'react';
import logo from './logo.svg';
import './App.css';
import useUniqViewSeconds from './hooks/useUniqViewSeconds';

function App() {
    const { viewSeconds, error, isFetchingViewSeconds, fetchData } = useUniqViewSeconds({
        shouldFetchInitially: false,
    });

    const renderFetchingIndicator = () => {
        return <img src={logo} className="App-logo" alt="logo" />;
    };

    const renderResult = () => {
        return <code className="App-view-seconds">{viewSeconds.join(', ')}</code>;
    };

    const renderError = () => {
        return <code className="App-view-seconds">{error}</code>;
    };

    return (
        <div className="App">
            <header className="App-header">
                {isFetchingViewSeconds ? renderFetchingIndicator() : error ? renderError() : renderResult()}
                <div
                    className={`App-fetch-btn ${isFetchingViewSeconds && 'App-fetch-btn-disabled'}`}
                    onClick={fetchData}>
                    {viewSeconds.length ? 'Refetch data' : 'Click to fetch data'}
                </div>
            </header>
        </div>
    );
}

export default App;
