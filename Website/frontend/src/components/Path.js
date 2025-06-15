const app_name = 'salvagefinancial';
exports.buildPath =
function buildPath(route){
	if(procss.env.NODE_ENV === 'production'){
		return 'http://' + app_name + '.herokuapp.com/' + route;
	}
	else{
		return 'http://localhost:5000/' + route;
	}
}
