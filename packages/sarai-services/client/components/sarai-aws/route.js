FlowRouter.route("/services/aws", {
	name: 'services',
	action: (params, queryParams) => {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "ServicesAws"});
	}
});
