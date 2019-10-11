import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import reactBlockUIMiddleware from 'react-block-ui/reduxMiddleware';
import slackUsers from './slackUsers';

const rootReducer = combineReducers({
    slackUsers
});

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(thunk, reactBlockUIMiddleware)
    );
}