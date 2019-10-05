import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reactBlockUIMiddleware from 'react-block-ui/reduxMiddleware';
import rootReducer from './rootReducer';

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(thunk, reactBlockUIMiddleware)
    );
}