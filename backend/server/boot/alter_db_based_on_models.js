module.exports = function (app) {
    app.dataSources.mysqlds.autoupdate('Buddy', function (err) {
        const {Buddy} = app.models;
        if (!Buddy) {
            return;
        }
    });
    app.dataSources.mysqlds.autoupdate('Buddy_Request', function (err) {
        const {Buddyrequest} = app.models;
        if (!Buddyrequest) {
            return;
        }
    });

    app.dataSources.mysqlds.autoupdate('Buddy_Message', function (err) {
        const {Buddymessage} = app.models;
        if (!Buddymessage) {
            return;
        }
    });
};
