Template.Projects.onRendered(function(){
	var num = FlowRouter.current().params._id

	num_sub = 'sub' + num.split('.')[0]
	console.log(num_sub)

	var sub = document.getElementById(num_sub)
	sub.nextElementSibling.classList.toggle("show");
	sub.classList.toggle("active");

	var proj = document.getElementById(num)
	proj.nextElementSibling.classList.toggle("show");
	proj.classList.toggle("active");
	proj.scrollIntoView();
})

Template.Projects.helpers({
  project: function(){
    //return Home.find({'title': 'Hello World'});
    return About.findOne({'name': 'projects'});

  }
})