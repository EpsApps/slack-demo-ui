import API from 'API';

export const GETTING_USERS = 'GETTING_USERS';
export const GOT_USERS = 'GOT_USERS';
export const ERROR_GETTING_USERS = 'ERROR_GETTING_USERS';

export const getSlackUsers = () => (dispatch) => {
    dispatch({ type: GETTING_USERS });
    let requestOptions = {
        method: 'GET',
        uri: `${API.getBaseURL()}/slack/user`
    };
    let successOptions = {
        type: GOT_USERS
    };
    let errorOptions = {
        type: ERROR_GETTING_USERS
    };
    dispatch(API.request(requestOptions, successOptions, errorOptions));
}

const initialState = {
    users: [],
    loading: false
}

export default function slackUsers(state = initialState, { type, payload }) {
    switch (type) {
        case GETTING_USERS:
            return { ...state, loading: true };
        case GOT_USERS:
            return { ...state, users: payload, loading: false };
        case GOT_USERS:
            return { ...state, loading: false };
        default:
            return state;
    }
}