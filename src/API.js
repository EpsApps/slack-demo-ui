import request from 'request';

export const API_ERROR = 'API_ERROR';

export default class API {

    static request = (requestOptions, successOptions, errorOptions) => (dispatch, subscribe) => {
        dispatch({ type: 'ASYNC_REQUEST_INITIATED' });
        request(requestOptions, (error, response, body) => {
            dispatch({ type: 'ASYNC_REQUEST_COMPLETED' });
            if (error || response.statusCode >= 400) {
                dispatch({
                    type: API_ERROR
                });
                if (errorOptions && errorOptions.type) {
                    dispatch({
                        type: errorOptions.type
                    });
                }
            } else {
                if (successOptions && successOptions.type) {
                    dispatch({
                        type: successOptions.type,
                        payload: JSON.parse(body)
                    });
                }
            }
        });
    }

    static getBaseURL = () => {
        return 'http://ec2-54-183-41-146.us-west-1.compute.amazonaws.com:8081';
    }

}