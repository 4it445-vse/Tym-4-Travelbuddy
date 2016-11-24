module.exports = function (app) {
    app.dataSources.mysqlds.autoupdate('Buddy', function (err) {
        const {Buddy} = app.models;
        if (!Buddy) {
            return;
        }
    });
    app.dataSources.mysqlds.autoupdate('Request', function (err) {
        const {Request} = app.models;
        if (!Request) {
            return;
        }
    });

    app.dataSources.mysqlds.autoupdate('Message', function (err) {
        const {Message} = app.models;
        if (!Message) {
            return;
        }
    });
};
