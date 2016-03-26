// Admin users to add to all applications.
Migrations.add('memberIds', () => {
  Applications.find({ }).forEach((doc) => {
    const { _id, createdBy } = doc;

    Applications.update(_id, {
      $set: {
        memberIds: [createdBy]
      }
    });
  });
});
