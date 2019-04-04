FlowRouter.route("/services/seams", {
	name: 'services',
	action: (params, queryParams) => {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "ServicesSeams"});
	}
});
