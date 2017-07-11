// Create the main application module
(function () {
    angular
        .module("MAIN_APP_MODULE", [
            "ngMessages",   // ngMessages simple show/hide form error messages, work with ngModel $error object
            "ngAnimate",    // ngAnimate module supports both CSS-based and JS-based animations via callback hooks
            "ui.router"     // Client-side #-based routing
        ]);

	angular.module("MAIN_APP_MODULE").config(myRoutesConfig);

	myRoutesConfig.$inject=["$stateProvider","$urlRouterProvider"];

	// Define UI states

	function myRoutesConfig($stateProvider,$urlRouterProvider) {
		$stateProvider.state('Search', {url:"/Search",templateUrl:"/app/Search_Feature/Search.html"});
		$stateProvider.state('Edit', {url:"/Edit",templateUrl:"/app/Edit_Feature/Edit.html"});
		$stateProvider.state('fancy_edit', {url:"/fancy_edit/{id}",templateUrl:"/app/Edit_Feature/Edit.html"});
		$stateProvider.state('fancy_search', {url:"/fancy_search/{refresh}",templateUrl:"/app/Search_Feature/Search.html"});
		$urlRouterProvider.otherwise("/Search"); // also sets initial state if not provided
	}
})();
               
