Template.ServicesCMS.onCreated(() => {
  Meteor.subscribe('services')
})

Template.ServicesCMS.onRendered(() => {
})

Template.ServicesCMS.events({

  'click .cms-service-edit': () => {

  },

  'click #cms-service-add': () => {
    Session.set('serviceAction', 'add')
    FlowRouter.go('/admin/services/add')
  }
})

Template.ServicesCMS.helpers({
  services: () => {
    const records = Services.find({}).fetch()

    if (records) {
      return records
    }
  },

  showToastIfAny: () => {
    if (Session.get('toast') != undefined) {
      Session.set('toast', undefined)
    }
  }
})