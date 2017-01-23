export const updateRequestNotificationCountSuccess = (payload) => ({
    type: 'UPDATE_REQUEST_NOTIFICATION_COUNT_SUCCESS',
    payload
});

export const updateRequestNotificationCount = (data) => {
    console.log("in refreshRequests");
    return (dispatch) => {
        return dispatch(updateRequestNotificationCountSuccess({countBuddy: data.countBuddy, countTraveller: data.countTraveller, data: null}));
    }
};