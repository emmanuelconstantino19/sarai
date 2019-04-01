Template.TwitterFeed.onCreated(() => {
  Session.set('twitter-is-visible', false)
})

Template.TwitterFeed.onRendered(() => {

})

Template.TwitterFeed.helpers({
  heightClass: () => {
    const isVisible = Session.get('twitter-is-visible')
    if (isVisible) {
      return {
        class: 'max'
      }
    } else {
      return {
        class: 'min'
      }
    }
  },

  max: () => {
    const isVisible = Session.get('twitter-is-visible')

    return isVisible
  }
})

Template.TwitterFeed.events({
  'click #twitter-feed #toggle-visibility': () => {
    const isVisible = Session.get('twitter-is-visible')

    if (isVisible) {
      Session.set('twitter-is-visible', false)
    } else {
      Session.set('twitter-is-visible', true)
    }
  }
})
