
Template.AboutUsBannerOptions.created = function() {
  this.uploadedFile = ''
}

Template.AboutUsBannerOptions.onRendered(() => {
  const dialog = document.querySelector('#cms-aboutbanner-dialog')

    dialog.querySelector('.cancel').addEventListener('click', () => {
      dialog.close();
    });

    dialog.querySelector('.save').addEventListener('click', () => {
      const action = this.action

      const title = $('#cms-aboutbanner-slide-title-input').val()
      const subTitle = $('#cms-aboutbanner-slide-subtitle-input').val()

      if (action == 'edit') {
        const _id = this.actionID

        Meteor.call('cms-aboutbanner-slider-edit', _id, title, subTitle, (error, result) => {
          let toast = 'Banner saved'
          if (error) {
            toasts = 'Unable to save banner'
          }
          showToast(toast)
        })

      }

      dialog.close();
    })
})

Template.AboutUsBannerOptions.events({
  'click .cms-aboutbanner-slider-edit': (e) => {
    const id = e.currentTarget.id.split('-')[2]

    // this.uploadedFile =
    this.action = 'edit'
    this.actionID = id

    const dialog = document.querySelector('#cms-aboutbanner-dialog');
    dialog.showModal();

    const record = About.findOne({name: 'banner'})
   
    if (record) {
      const banner = record.banners[0];
      if(typeof banner != 'undefined'){
        setBannerDialogContents(banner.subtext, banner.subtext1)
      }
    }
  },

  'click .cms-aboutbanner-slider-delete': (e) => {
    const id = e.currentTarget.id.split('-')[2]

    Meteor.call('cms-aboutbanner-slider-delete', id, (error, result) => {
      let toast = 'Deleted banner'
      if (error) {
        toast = 'Unable to delete banner'
      }
      showToast(toast)
    })
  }
});

Template.AboutUsBannerOptions.helpers({
  truncateTableEntry: (text) => {
    if(typeof text != 'undefined'){
      
      if (text.length > 20) {
        return `${text.substring(0, 20)}...`
      } else {
        return text
      }
    }
  },

  dialogHeader: () => {
    const action = Session.get('action')

    if (action == 'edit') {
      return 'Edit Slide'
    }
  },

  entry: () => {
    const record = About.findOne({name: 'banner'})

    if(typeof record !='undefined'){
      return record.banners[0];
    }
  },

  myCallbacks: () => {
    return {
      formData: () => {
        return {
          filename: `slider-${Random.id()}`,
          uploadGroup: 'main'
        }
      },
      finished: (index, fileInfo, context) => {
        this.uploadedFile = `${uploadDirPrefix()}${fileInfo.path}`
      }
    }
  }
})


const setBannerDialogContents = (title, subTitle) => {

  $('#cms-aboutbanner-slide-title-input').val(title)
  $('#cms-aboutbanner-slide-subtitle-input').val(subTitle)

  if (this.action == 'edit') {
    $('#cms-aboutbanner-slide-title').addClass('is-dirty')
    $('#cms-aboutbanner-slide-subtitle').addClass('is-dirty')
  }
}