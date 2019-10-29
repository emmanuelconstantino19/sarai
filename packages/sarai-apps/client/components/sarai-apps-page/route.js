FlowRouter.route("/apps/:_id", {
	name: 'apps',
	action: function(params, queryParams) {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "AppsPage"});
	}
});
