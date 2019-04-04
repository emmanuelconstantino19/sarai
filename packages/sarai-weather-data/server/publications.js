/**********WEATHER DATA***********/
Meteor.publish('weather-data', () => {
  return WeatherData.find();
});

Meteor.publish('wunderground-data', () => {
  return WundergroundData.find();
});

Meteor.publish('weather-data-30', () => {
  const oneMonthAgo = new Date()

  let reverseOffset = oneMonthAgo.getDate() - 31

  if (reverseOffset > 32 || reverseOffset < -32) {
    const reverseOffset = -(31 - oneMonthAgo.getDate())
  }

  oneMonthAgo.setDate(reverseOffset)

  return WeatherData.find({dateUTC: { $gt: oneMonthAgo}}, {sort: {dateUTC: -1}});
});

Meteor.publish('weather-data-30-by-id', (stationID) => {
  const oneMonthAgo = new Date()

  let reverseOffset = oneMonthAgo.getDate() - 31

  if (reverseOffset > 32 || reverseOffset < -32) {
    const reverseOffset = -(31 - oneMonthAgo.getDate())
  }

  oneMonthAgo.setDate(reverseOffset)

  return WeatherData.find({id: stationID, dateUTC: { $gt: oneMonthAgo}}, {sort: {dateUTC: -1}});
});


// Meteor.publish('weather-data-30-by-id', (id) => {
//   let oneMonthAgo = new Date()
//   // oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
//   oneMonthAgo.setDate(oneMonthAgo.getDate() - 31)

//   return WeatherData.find({id, dateUTC: { $gt: oneMonthAgo}}, {sort: {dateUTC: -1}});
// })

/**********WEATHER STATIONS***********/

//just one
Meteor.publish('weather-station', (id) => {
  return WeatherStations.find({id})
})


Meteor.publish('quick-weather-stations', () => {
  return WeatherStations.find({}, {limit: 5})
})

Meteor.publish('weather-stations', () => {
    return WeatherStations.find();
});

//Return all enabled SARAI stations
Meteor.publish('sarai-weather-stations', () => {
  return WeatherStations.find({group: 'SARAI', enabled: true})
})

Meteor.publish('dss-settings', () => {
  return DSSSettings.find();
})

Meteor.publish('heat-map-data', () => {
  return HeatMapData.find();
})

Meteor.publish('heat-map-data-by-id', (stationID) => {
  return HeatMapData.find({stationID: stationID})
})