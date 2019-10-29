Template.ConciseView.onCreated(() => {
  Session.set('station-skip', 0)
  Meteor.subscribe('sarai-weather-stations', () => {
    const WSCount = WeatherStations.find({}).count()

    this.WSCount = WSCount
  })
  Meteor.subscribe('weather-data-30')


})

Template.ConciseView.onRendered(() => {

})

Template.ConciseView.helpers({
  weatherStations: () => {
    const stations = WeatherStations.find({}).fetch()

    const cleanStations = Meteor.previewHelpers.sortStations(stations)

    return cleanStations
  },

  first4: () => {
    //return PlantProblem.find({'type': 'Pest', 'plant_affected': pestType},{sort: {time: -1}, skip: (Session.get(currentPest)-1)*pestsPerPage, limit: pestsPerPage});
    //}
    const stationSkip = Session.get('station-skip')

    const first4 = WeatherStations.find({}, {skip: stationSkip, limit: 4}).fetch()

    const cleaned = Meteor.previewHelpers.sortStations(first4)
    return cleaned
  },

  second4: () => {
    const stationSkip = Session.get('station-skip')

    const second4 = WeatherStations.find({}, {skip: stationSkip + 4, limit: 4}).fetch()

    const cleaned = Meteor.previewHelpers.sortStations(second4)
    return cleaned
  },

  onFirstPage: () => {
    const skip = Session.get('station-skip')

    if (skip == 0) {
      return true
    } else {
      return false
    }
  },

  onLastPage: () => {
    const skip = Session.get('station-skip')

    if (skip >= this.WSCount - 8) {
      return true
    } else {
      return false
    }
  }

})

Template.ConciseView.events({
  'click #prev-concise': (e) => {
    const skip = Session.get('station-skip')

    const newSkip = (skip - 8 < 0) ? 0 : skip - 8

    Session.set('station-skip', newSkip)
  },

  'click #next-concise': (e) => {
    const skip = Session.get('station-skip')

    const newSkip = (skip + 8 >= this.WSCount) ? skip : skip + 8

    Session.set('station-skip', newSkip)
  }
})