// register controller function to module
// inject service(s) needed
// expose model variables and functions
// init model variables as required
// check if parameters passed along with the URL for this view
// define functions (which will mostly call functions in the service(s) to do $http.post, etc.)

(function () {
    angular
        .module("MAIN_APP_MODULE")
        .controller("SearchCtrl", SearchCtrl);

    SearchCtrl.$inject = ['$filter', '$window', 'GroceryService','$state','$stateParams'];

    function SearchCtrl($filter, $window, GroceryService,$state,$stateParams) {
        var vm = this;

        // Exposed to view: data models ----------------
        vm.multiSearchString = '';
        vm.brandSearchString = '';
        vm.nameSearchString = '';
		  vm.groceries=[];

        // Exposed to view: functions ------------------
        vm.search = search;
		  vm.go_to_edit_page=go_to_edit_page;

		  // if coming back from the edit page, restore the last search
		  if ($stateParams && $stateParams.refresh==true) {
			  if (GroceryService.stash.brandSearchString) {
				  vm.brandSearchString=GroceryService.stash.brandSearchString;
			     search("brand");
			  } else if (GroceryService.stash.nameSearchString) {
				  vm.nameSearchString=GroceryService.stash.nameSearchString;
			     search("name");
			  } else if (GroceryService.stash.multiSearchString) {
				  vm.multiSearchString=GroceryService.stash.multiSearchString;
			     search("multi");
			  }
		  }
		  else {
		     // no parameters provided, so start with a blank page
			  init();
		  }

        // Function declaration and definition ---------------

        function init() {
			  vm.multiSearchString = '';
			  vm.brandSearchString = '';
			  vm.nameSearchString = '';
			  vm.groceries=[];
        }

		  // function to switch view 
		  function go_to_edit_page(groc_id) {
			  GroceryService.stash.brandSearchString=vm.brandSearchString;
			  GroceryService.stash.nameSearchString=vm.nameSearchString;
			  GroceryService.stash.multiSearchString=vm.multiSearchString;
		     $state.go("fancy_edit",{id:groc_id});
		  }

        function search(searchField,direction) {
				var p=null;
				var dir='a';
				if (direction) dir=direction;
				if (searchField=="brand") {
					p=GroceryService.retrieveGroceries(searchField,vm.brandSearchString,dir);
				}
				else if (searchField=="name") {
					p=GroceryService.retrieveGroceries(searchField,vm.nameSearchString,dir);
				} else if (searchField=="multi") {
					p=GroceryService.retrieveGroceries(searchField,vm.multiSearchString,dir);
				}

				p.then(function (results) {
					vm.groceries = results.data.groceries;
				}, function (err) {
					console.log("error " + err);
				});
        }


    }
})();
