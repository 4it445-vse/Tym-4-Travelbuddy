module.exports = function (app) {

  var Container = app.models.Container;
  var Buddy = app.models.Buddy;

  Buddy.find({fields: {id : true}})
  .then((ids) => { ids.map( id => {
    Container.getContainer("container_" + id.id, (err, obj) => {
      if(err) {
        Container.createContainer({name: "container_" + id.id }, (err,obj) => {if(err) console.log(err)})
      }
  })})})
  .catch((err) => {console.log(err.message)})

}
