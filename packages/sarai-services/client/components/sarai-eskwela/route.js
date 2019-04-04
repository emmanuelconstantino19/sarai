FlowRouter.route("/services/eskwela", {
	name: 'services',
	action: (params, queryParams) => {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "ServicesEskwela"});
	}
});
