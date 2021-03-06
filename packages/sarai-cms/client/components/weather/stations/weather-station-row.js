Template.WeatherStationRow.events({
  'click #edit-weather-station': function() {
    Session.set('weather-station-id', this.id)

    const dialog = document.querySelector('#cms-weather-station-dialog')

    fillWeatherStationDialog(this._id)

    dialog.showModal()
  }
})

const fillWeatherStationDialog = (stationID) => {
  $('#cms-ws-label').addClass('is-dirty')
  $('#cms-ws-lat').addClass('is-dirty')
  $('#cms-ws-long').addClass('is-dirty')

  Meteor.subscribe('weather-station', stationID, () => {
    const record = WeatherStations.findOne()

    $('#cms-ws-label-input').val(record.label)
    $('#cms-ws-lat-input').val(record.coords[0])
    $('#cms-ws-long-input').val(record.coords[1])
  })
}