Template.SuitabilityMap.events({
	'click #gallery-button': () => {
	    FlowRouter.go(`/suitability-gallery`)
	  },
	'click #interactive-button': () => {
	    document.location.href = "http://139.59.125.198/suitability-maps";
	  },	
})
