isLoggedIn = function(){
		 return true;
}

goHome = function(){
	FlowRouter.go('/icm-coffee');
	FlowRouter.redirect('/icm-coffee');
}
