/*****************************************************************************/
/* entityPage: Event Handlers */
/*****************************************************************************/
Template.AppsPage.events({
});

/*****************************************************************************/
/* entityPage: Helpers */
/*****************************************************************************/
Template.AppsPage.helpers({
	app: function(){
		var app = Apps.findOne({_id: FlowRouter.current().params._id});
		if(typeof app!='undefined'){
			return app;
		}
	}
});

/*****************************************************************************/
/* entityPage: Lifecycle Hooks */
/*****************************************************************************/
Template.AppsPage.created = function () {
};

Template.AppsPage.rendered = function () {
	
};

Template.AppsPage.destroyed = function () {
};
