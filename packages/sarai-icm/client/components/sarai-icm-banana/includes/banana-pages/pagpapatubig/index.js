isLoggedIn = function(){
		 return true;
}

goHome = function(){
	FlowRouter.go('/icm-banana');
	FlowRouter.redirect('/icm-banana');
}
