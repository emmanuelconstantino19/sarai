FlowRouter.route("/services/waiss", {
	name: 'services',
	action: (params, queryParams) => {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "ServicesWaiss"});
	}
});
