Meteor.publish('rainfall-distribution-data', () => {
  return RainfallDistributionData.find();
});

Meteor.publish('cumulative-data-30', (date_subscribe) => {
  let oneMonthAgo = new Date(date_subscribe)
  // oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 31)

  return WeatherData.find({dateUTC: { $gt: oneMonthAgo}}, {sort: {dateUTC: -1}});
});

Meteor.publish('cumulative-data-20', (date_subscribe) => {
  let twentyDaysAgo = new Date(date_subscribe)
  // twentyDaysAgo.setMonth(twentyDaysAgo.getMonth() - 1)
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20)

  return WeatherData.find({dateUTC: { $gt: twentyDaysAgo}}, {sort: {dateUTC: -1}});
});

Meteor.publish('cumulative-data', () => {
  return WeatherData.find();
});

Meteor.publish('weather-stations2', () => {
    return WeatherStations2.find();
});

Meteor.publish('dss-settings2', () => {
  return DSSSettings2.find();
})

Meteor.publish('percent-mean-data', () => {
  return PercentMeanData.find();
})

Meteor.publish('cumulative-data-whole-year', () => {
  let fromJanuary = new Date(2015, 12, 01)

  return WeatherData.find({dateUTC: { $gt: fromJanuary}}, {sort: {dateUTC: -1}});
});

Meteor.publish('historical-daily-rain-data', () => {
  return HistoricalDailyRainData.find();
})