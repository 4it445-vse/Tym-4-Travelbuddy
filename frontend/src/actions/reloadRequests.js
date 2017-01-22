export const refreshRequestsSuccess = (payload) => ({
    type: 'REFRESH_REQUESTS_SUCCESS',
    payload
});

export const refreshRequests = () => {
    console.log("in refreshRequests");
    return (dispatch) => {
        return dispatch(refreshRequestsSuccess({time: new Date().getTime(), data: null}));
    }
};