Logs = new Mongo.Collection('logs');

// Attach behaviour with the default options
Logs.attachBehaviour('timestampable');

Logs.attachSchema(new SimpleSchema({
  applicationId: { type: String },
  type: { type: String },
  data: { type: String }
}));

Logs.helpers({
  application() {
    return Applications.findOne(this.applicationId);
  }
});

isServer(() => {

});
