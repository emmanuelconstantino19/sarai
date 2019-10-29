/*****************************************************************************/
/* entityPage: Event Handlers */
/*****************************************************************************/
Template.BlogPageDate.events({
});

/*****************************************************************************/
/* entityPage: Helpers */
/*****************************************************************************/
Template.BlogPageDate.helpers({
	month: function(){
		return FlowRouter.current().params.month;
	},
	year: function(){
		return FlowRouter.current().params.year;
	},
	blogsbasedate: function(){
		var month = FlowRouter.current().params.month;
		var year = FlowRouter.current().params.year;
		var start = new Date(month + ' ' + 1 + ', ' + year);
		var end = new Date(month + ' ' + 31 + ', ' + year);
		var blogsbasedate = Blog.find({date: {$gt: start}, date: {$lt: end}}, {sort: {date: -1}}).fetch();
		return blogsbasedate;
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
Template.BlogPageDate.created = function () {
};

Template.BlogPageDate.rendered = function () {
	
};

Template.BlogPageDate.destroyed = function () {
};
