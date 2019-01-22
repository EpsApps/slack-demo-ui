import API from 'API';

export const GETTING_LOCATION_DATA = 'GETTING_LOCATION_DATA';
export const GOT_LOCATION_DATA = 'GOT_LOCATION_DATA';
export const GOT_LOCATION_DATA_ERROR = 'GOT_LOCATION_DATA_ERROR';

/**
 * @todo rather than hardcoding device id, allow user input for this
 * for now this is outside the scope of this project
 */
export const DEVICE_ID = 'dd7295fa-6c65-484d-b38d-30df3bc31c0c';

export const getLocationData = (start, end) => (dispatch) => {
    dispatch({ type: GETTING_LOCATION_DATA });
    let requestOptions = {
        method: 'GET',
        uri: `${API.getBaseURL()}/devices/history/ids/${DEVICE_ID}?since=${start}&until=${end}`,
        headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRqYXlAZm9yZC5jb20iLCJzeXN0ZW1Sb2xlIjoic3lzdGVtVXNlciIsImlhdCI6MTU0MTAwNzAzMiwiaXNzIjoiaHR0cDovL3dlYi1zZXJ2ZXJzLWRldi0xNDI1MzI1MDI4LnVzLXdlc3QtMi5lbGIuYW1hem9uYXdzLmNvbSIsInN1YiI6ImUyMmE2MjlkLWRlYTAtNDc0Yi04YzY5LTFlODQwYmZkMzRmYSIsImp0aSI6IjY0Nzk2YWIwLTlhYTItNGY3Ny04OTk4LWI1MzMzYzhlMmI5OCJ9.aIGEX_qigixaA17dcO0KNJay-R_704FDaugfkIAeVLA' }
    };
    let successOptions = {
        type: GOT_LOCATION_DATA
    };
    let errorOptions = {
        type: GOT_LOCATION_DATA_ERROR
    };
    dispatch(API.request(requestOptions, successOptions, errorOptions));
}

const initialState = {
    locationData: [],
    mapPositions: []
}

export default function map(state = initialState, { type, payload }) {
    switch (type) {
        case GOT_LOCATION_DATA:
            if (payload && payload.devices && payload.devices[DEVICE_ID]) {
                let locationData = payload.devices[DEVICE_ID];
                locationData.sort((a, b) => {
                    if (a.timestamp < b.timestamp) return -1;
                    if (a.timestamp > b.timestamp) return 1;
                    return 0;
                });
                let mapPositions = [];
                for (let i = 0; i < locationData.length; i++) {
                    let currentPoint = locationData[i];
                    mapPositions.push([currentPoint.lat, currentPoint.long]);
                    if (i == 0) {
                        currentPoint.acceleration = 0;
                    } else {
                        let metricConversionRatio = 2.237;
                        let lastPoint = locationData[i - 1];
                        let speedDelta = (currentPoint.speed / metricConversionRatio)  - (lastPoint.speed / metricConversionRatio);
                        let timeDelta = (currentPoint.timestamp / 1000) - (lastPoint.timestamp / 1000);
                        let acceleration = (timeDelta) ? speedDelta / timeDelta : 0;
                        currentPoint.acceleration = acceleration;
                    }
                }
                return { ...state, locationData, mapPositions };
            }
        default:
            return state;
    }
}