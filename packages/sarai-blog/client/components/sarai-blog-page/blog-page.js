/*****************************************************************************/
/* entityPage: Event Handlers */
/*****************************************************************************/
Template.BlogPage.events({
	'click #nextbutton': function(e){
		e.preventDefault();
		var currentblog = Blog.findOne({_id: FlowRouter.current().params._id});
		if(typeof currentblog!='undefined'){
			var obj = Blog.find({date: {$gt: new Date(currentblog.date)}}, {sort: {date: 1}}).fetch();
			var nextblog = obj[0];
			FlowRouter.go('/Blog/'+nextblog._id);
			BlazeLayout.reset();
			BlazeLayout.render("MainLayout", {main: "BlogPage"});
		}
	},
	'click #prevbutton': function(e){
		e.preventDefault();
		var currentblog = Blog.findOne({_id: FlowRouter.current().params._id});
		if(typeof currentblog!='undefined'){
			var obj = Blog.find({date: {$lt: new Date(currentblog.date)}, _id: {$ne: currentblog._id}}, {sort: {date: -1}}).fetch();
			var prevblog = obj[0];
			FlowRouter.go('/blog/'+prevblog._id);
			BlazeLayout.reset();
			BlazeLayout.render("MainLayout", {main: "BlogPage"});
		}
	}
});

/*****************************************************************************/
/* entityPage: Helpers */
/*****************************************************************************/
Template.BlogPage.helpers({
	blog: function(){
		return Blog.findOne({_id: FlowRouter.current().params._id});
	},
	nextblog: function(){
		var currentblog = Blog.findOne({_id: FlowRouter.current().params._id});
		if(typeof currentblog != 'undefined'){
			var obj = Blog.find({date: {$gt: new Date(currentblog.date)}}, {sort: {date: 1}}).fetch();
			return obj[0];
		}
	},
	prevblog: function(){
		var currentblog = Blog.findOne({_id: FlowRouter.current().params._id});
		if(typeof currentblog != 'undefined'){
			var obj = Blog.find({date: {$lt: new Date(currentblog.date)}, _id: {$ne: currentblog._id}}, {sort: {date: -1}}).fetch();
			return obj[0];
		}
	},
	recentblogs: function(){
		var recentblogs = Blog.find({}, {limit: 5, sort: {date: -1}}).fetch();

		if(typeof recentblogs != 'undefined'){
			return recentblogs;
		}
	},
	comments: function(){
		var comments = [];
		//TO DO
		return comments;
	},
	dates: function(){
		var dates = [];
		var allblogs = Blog.find({}, {sort: {date: -1}}).fetch();
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		if(typeof allblogs != 'undefined'){
			for(var i=0;i<allblogs.length;i++){
				var count = 0;
				for(var j=0;j<dates.length;j++){
					var newmonth = monthNames[allblogs[i].date.getMonth()];
					var newyear = allblogs[i].date.getFullYear();
					if(newmonth==dates[j].month && newyear==dates[j].year){
						count++;
					}
				}
				if(count==0){
					var newdate = {
						month: newmonth,
						year: newyear
					}
					dates.push(newdate);
				}
			}
			return dates;
		}
	},
	tags: function(){
		var tags = [];
		var allblogs = Blog.find({}, {sort: {date: -1}}).fetch();
		if(typeof allblogs != 'undefined'){
			for(var i=0;i<allblogs.length;i++){
				var count = 0;
				for(var j=0;j<tags.length;j++){
					if(allblogs[i].category==tags[j]){
						count++;
					}
				}
				if(count==0){
					tags.push(allblogs[i].category);
				}
			}
			return tags;
		}
	}
});

/*****************************************************************************/
/* entityPage: Lifecycle Hooks */
/*****************************************************************************/
Template.BlogPage.created = function () {
};

Template.BlogPage.rendered = function () {
	
};

Template.BlogPage.destroyed = function () {
};
