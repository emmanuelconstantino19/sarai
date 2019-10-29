Template.ServicesCMSEditButton.onRendered(() => {

})

Template.ServicesCMSEditButton.events({

  'click .cms-service-edit': (event, template) => {
    Session.set('serviceAction', 'edit')

    FlowRouter.go(`/admin/services/${template.data.id}`)
  }

})

Template.ServicesCMSEditButton.helpers({
  edit: () => {
  }

})