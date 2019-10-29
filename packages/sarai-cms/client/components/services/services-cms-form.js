Template.ServicesCMSForm.onCreated(() => {
  Meteor.subscribe('services')
  this.serviceID = FlowRouter.current().params._id

  this.action = Session.get('serviceAction')
})

Template.ServicesCMSForm.onRendered(() => {

  if (this.action == 'edit') {
    setFormDirty()

  } else if (this.action == 'add') {

  }



  // $('#cms-service-col1text-editor').summernote();
  // $('#cms-service-col1text-editor').code('<h3>Sample</h3>');


  // const hiddenCode = $('#hidden-col1text').attr('value')
  // $('#cms-service-col1Text-editor').code(hiddenCode)
})

Template.ServicesCMSForm.events({

})

Template.ServicesCMSForm.helpers({
  service: () => {
    const service = Services.findOne({_id: this.serviceID})

    return service && service
  },

  formActionEdit: () => {
    if (this.action == 'edit') {
      return true
    } else {
      return false
    }
  },

  formActionAdd: () => {
    if (this.action == 'add') {
      return true
    } else {
      return false
    }
  }
})

const setFormDirty = () => {

  $('#cms-service-title').addClass('is-dirty')
  $('#cms-service-tagline').addClass('is-dirty')
  $('#cms-service-crops').addClass('is-dirty')
  $('#cms-service-experts').addClass('is-dirty')
  $('#cms-service-ura').addClass('is-dirty')

  $('#cms-service-leaders').addClass('is-dirty')

  $('#cms-service-subtitle').addClass('is-dirty')
  $('#cms-service-subtitleLink').addClass('is-dirty')

  $('#cms-service-col1title').addClass('is-dirty')
  $('#cms-service-col2title').addClass('is-dirty')
}
