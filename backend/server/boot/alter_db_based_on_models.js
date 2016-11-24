module.exports = function (app) {
    app.dataSources.mysqlds.autoupdate('Buddy', function (err) {
        const {Buddy} = app.models;
        if (!Buddy) {
            return;
        }
	Buddy.count({}, function(err, count) {
          if (count !== 0) { return; }
	  Buddy.create([
	        {
		   email:'SPUSTIT_SQL',
		   password:'$2a$10$f86KKcKcHg8a7bOqa7oCGe9NNqvNNv2M9e5b70k.Bhv8sxlh9GNai',
		   sex:'male',
		   name:'SPUSTIT_SQL',
		   surname:'SPUSTIT_SQL',
		   city:'Olomouc',
		   about_me:'',
		   is_hosting:1
		}
	     ], function(err, products){
			if (err){ console.error(err)}
			console.log('RUN SQL!');
		}
	  );
	});
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
