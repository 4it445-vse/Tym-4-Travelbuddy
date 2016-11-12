module.exports = function (app) {
    app.dataSources.mysqlds.autoupdate('Buddy', function (err) {
        const {Buddy} = app.models;
        if (!Buddy) {
            return;
        }
    });
};