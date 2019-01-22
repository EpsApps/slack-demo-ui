import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import configureStore from './store';
import ApplicationContainer from 'components/ApplicationContainer';
import ReduxBlockUi from 'react-block-ui/redux';
import CircularProgress from 'library/CircularProgress';
import * as serviceWorker from './serviceWorker';
import './index.css';

function appContainer() {
    return (
        <ReduxBlockUi
            className='block-ui-custom'
            tag='div' block='ASYNC_REQUEST_INITIATED'
            unblock='ASYNC_REQUEST_COMPLETED'
            loader={CircularProgress}>
            <ApplicationContainer />
        </ReduxBlockUi>
    )
};

const mapStateToProps = state => ({
    user: state.user
});

let ConnectedAppContainer = connect(mapStateToProps, {})(appContainer);

ReactDOM.render(
    <Provider store={configureStore()}>
                <ConnectedAppContainer />
    </Provider>,
    document.getElementById('root')
);
serviceWorker.unregister();