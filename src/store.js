import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import reactBlockUIMiddleware from 'react-block-ui/reduxMiddleware';
import map from 'dashboards/Map/Map.redux';

let rootReducer = combineReducers({
    map
});

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(thunk, reactBlockUIMiddleware)
    );
}