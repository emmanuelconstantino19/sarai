FlowRouter.route("/services/kp", {
	name: 'services',
	action: (params, queryParams) => {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "ServicesKp"});
	}
});
