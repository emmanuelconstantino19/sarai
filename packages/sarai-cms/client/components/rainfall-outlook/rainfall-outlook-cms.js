Template.RainfallOutlookCMS.helpers({
  message: function() {
    return 'sample'
  },

  myCallbacks: () => {
    return {
      formData: () => {
        return {
          filename: `rainfall-${Random.id()}`,
          uploadGroup: 'main'
        }
      },
      finished: (index, fileInfo, context) => {
        this.uploadedFile = `${uploadDirPrefix()}${fileInfo.path}`
        console.log(`${fileInfo}`)
        console.log(`saved to ${this.uploadedFile}`)

        var rawFile = new XMLHttpRequest();
        var allText;
          rawFile.open("GET", this.uploadedFile, false);
          rawFile.onreadystatechange = function ()
          {
              if(rawFile.readyState === 4)
              {
                  if(rawFile.status === 200 || rawFile.status == 0)
                  {
                      allText = rawFile.responseText;
                  }
              }
          }
          rawFile.send(null);
         Meteor.call('cms-rainfall-outlook-content-update', allText, (error, result) => {
          let toast = 'File uploaded successfully'
          if (error) {
            toast = 'Unable to upload file'
          }
          showToast(toast)
        })
      }
    }
  }

})

Template.RainfallOutlookCMS.onCreated(function() {
  Meteor.subscribe('rainfall-outlook');

})