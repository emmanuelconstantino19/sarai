Meteor.methods({

  'cms-service-update': (_id, title, tagline, thumbnail, info, media, col1, col2) => {

    Services.update(
      { _id },
      {
        $set : {
          title,
          tagline,
          thumbnail,
          info,
          media,
          col1,
          col2
        }
      },
      { upsert: true }
    );
  }

})