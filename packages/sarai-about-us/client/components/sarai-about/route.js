FlowRouter.route("/about-us", {
  action: function() {
    BlazeLayout.render("MainLayout", {main: "SaraiAbout"})
  }
})

FlowRouter.route("/about-us/:_id", {
	action: (params, queryParams) => {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "SaraiAbout"})
	}
});
