/*****************************************************************************/
/* entityPage: Event Handlers */
/*****************************************************************************/
Template.BlogPageTag.events({
});

/*****************************************************************************/
/* entityPage: Helpers */
/*****************************************************************************/
Template.BlogPageTag.helpers({
	currenttag: function(){
		return FlowRouter.current().params.tag;
	},
	blogsbasetag: function(){
		var tag = FlowRouter.current().params.tag;
		var blogsbasetag = Blog.find({category: tag}, {sort: {date: -1}}).fetch();
		return blogsbasetag;
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
Template.BlogPageTag.created = function () {
};

Template.BlogPageTag.rendered = function () {
	
};

Template.BlogPageTag.destroyed = function () {
};
