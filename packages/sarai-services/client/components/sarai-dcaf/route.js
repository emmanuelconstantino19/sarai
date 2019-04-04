FlowRouter.route("/services/dcaf", {
	name: 'services',
	action: (params, queryParams) => {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "ServicesDcaf"});
	}
});
