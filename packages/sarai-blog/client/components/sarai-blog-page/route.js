FlowRouter.route("/blog/:_id", {
	name: 'blog',
	action: function(params, queryParams) {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "BlogPage"})
	}
});

FlowRouter.route("/blog/author/:authorid", {
	name: 'blogauthor',
	action: function(params, queryParams) {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "BlogPageAuthor"})
	}
});

FlowRouter.route("/blog/bytag/:tag", {
	name: 'blogtag',
	action: function(params, queryParams) {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "BlogPageTag"})
	}
});

FlowRouter.route("/blog/:month/:year", {
	name: 'blogmonthyyear',
	action: function(params, queryParams) {
		BlazeLayout.reset();
		BlazeLayout.render("MainLayout", {main: "BlogPageDate"})
	}
});
