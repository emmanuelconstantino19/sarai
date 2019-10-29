Template.TopHeaderOptions.onCreated(function() {

  const handle = Meteor.subscribe('main', 'topHeader');
})

Template.TopHeaderOptions.onRendered(() => {
  $("#cms-weather-advisory-message-div").addClass("is-dirty");
  $("#cms-weather-advisory-description-div").addClass("is-dirty");
  $("#cms-weather-advisory-advisory-div").addClass("is-dirty");
})

Template.TopHeaderOptions.events({
  'click #cms-weather-advisory-save': () => {
    const title = $("#cms-weather-advisory-title").val()
    const description = $("#cms-weather-advisory-description").val()
    const advisory = $("#cms-weather-advisory-advisory").val()

    Meteor.call('cms-weather-advisory-update', title, description, advisory,(error, result) => {
      let toast = 'Unable to save changes'
      if (error) { } else {
        toast = 'Saved changes to Weather Advisory'
      }

      showToast(toast)
    })
  },

  'click #cms-weather-advisory-enable': () => {
    const title = $("#cms-weather-advisory-enable").html()

    let toast = 'Enabled Weather Advisory'
    if (title.trim() == 'Disable') {
      toast = 'Disabled Weather Advisory'
    }

    Meteor.call('cms-weather-advisory-toggle', (error, result) => {
      if (error) {
        toast = `Unable to ${title} Weather Advisory`
      }
      showToast(toast)

    })
  }
})

Template.WeatherAdvisoryOptions.helpers({

  title: () => {
    const record = Main.findOne({name: 'weather-advisory'})
    return record && record.title;
  },

  description: () => {
    const record = Main.findOne({name: 'weather-advisory'})
    return record && record.description
  },

  advisory: () => {
    const record = Main.findOne({name: 'weather-advisory'})
    return record && record.subtext
  },

  enabled: () => {
    const record = Main.findOne({name: 'weather-advisory'})

    if (record) {
      return record.enabled
    }
  },

  enabledStatus: () => {
    const record = Main.findOne({name: 'weather-advisory'})

    if (record) {
      return record.enabled ? '' : 'Disabled'
    }
  },

  disabled: () => {
    const record = Main.findOne({name: 'weather-advisory'})

    if (record) {
      return record.enabled ? '' : {disabled: 'true'}
    }
  },

  // Callbacks

  save: () => {
    const title = $("#cms-weather-advisory-title").val()
    const description = $("#cms-weather-advisory-description").val()
    const advisory = $("#cms-weather-advisory-advisory").val()

    Meteor.call('cms-weather-advisory-update', title, description, advisory)
  }
})