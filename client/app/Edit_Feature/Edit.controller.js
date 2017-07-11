// register controller function to module
// inject service(s) needed
// expose model variables and functions
// init model variables as required
// check if parameters passed along with the URL for this view
// define functions (which will mostly call functions in the service(s) to do $http.post, etc.)

(function () {
    angular
        .module("MAIN_APP_MODULE")
        .controller("EditCtrl", EditCtrl);

    EditCtrl.$inject = ['$filter', '$window', 'GroceryService','$state','$stateParams'];

    function EditCtrl($filter, $window, GroceryService,$state,$stateParams) {
        var vm = this;

        // Exposed to view: data models ----------------
        vm.id='';
        vm.upc12='';
        vm.brand='';
		  vm.name='';

        // Exposed to view: functions ------------------
        vm.cancel=cancel;
		  vm.save=save;

		  // if coming from the search page, populate record
		  if ($stateParams && $stateParams.id) {
			  search_by_id(parseInt($stateParams.id));
		     window.alert("coming from search page. params=","multi:"+$stateParams.multisearch+"brand:"+$stateParams.brandsearch+"name:"+$stateParams.namesearch);
		  }
		  else {
		     // no parameters provided, so start with a blank page
			  init();
		  }

        // Function declaration and definition ---------------

        function init() {
			  vm.id='';
			  vm.upc12='';
			  vm.brand='';
			  vm.name='';
        }

		  function save() {
				var p=null;
				p=GroceryService.updateGrocery(vm.id,{id:vm.id,upc12:vm.upc12,brand:vm.brand,name:vm.name});
				p.then(function (results) {
					window.alert("Go back to search view");
					go_to_search_page();
				}, function (err) {
					window.alert("Error");
					console.log("error " + err);
				});
		  }

		  function cancel() {
		  }

		  // function to switch view 
		  function go_to_search_page() {
		     window.alert("going back to search page.");
		     $state.go("fancy_search",{refresh:true})
		  }


        function search_by_id(id) {
				var p=null;
				p=GroceryService.retrieveGroceriesByID(id);
				p.then(function (results) {
window.alert(JSON.stringify(results));
					vm.id = results.data.grocery.id;
					vm.upc12 = results.data.grocery.upc12;
					vm.brand = results.data.grocery.brand;
					vm.name = results.data.grocery.name;
				}, function (err) {
					console.log("error " + err);
				});
        }


    }
})();
