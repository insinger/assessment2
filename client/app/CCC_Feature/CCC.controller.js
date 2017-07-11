// register controller function to module
// inject service(s) needed
// expose model variables and functions
// init model variables as required
// check if parameters passed along with the URL for this view
// define functions (which will mostly call functions in the service(s) to do $http.post, etc.)

(function () {
    angular
        .module("MAIN_APP_MODULE")
        .controller("CCCctrl", CCCctrl);

    CCCctrl.$inject = ['$filter', '$window', 'DeptService','$state','$stateParams'];

    function CCCctrl($filter, $window, DeptService,$state,$stateParams) {
        var vm = this;

        // Exposed to view: data models ----------------
        vm.searchString = '';
        vm.result = null;
        vm.showManager = false;

        // Exposed to view: functions ------------------
        vm.search = search;
        vm.searchForManager = searchForManager;
		  vm.go_to_fancy_edit=go_to_fancy_edit;

        // Initializations --------------------------------------------------------------------------------------------
        // Functions that are run when view/html is loaded

        init();

		  // check if there are any parameters passed along with the URL for this view
		  // this is triggered by ...
		  if ($stateParams && $stateParams.deptnum) {
			  // for example:
		     // vm.dept_no=$stateParams.deptnum;
			  // vm.search();
		  }

        // Function declaration and definition -------------------------------------------------------------------------

        // The init function initializes view
        function init() {
            // We call DeptService.retrieveDeptDB to handle retrieval of department information. The data retrieved
            // from this function is used to populate search.html. Since we are initializing the view, we want to
            // display all available departments, thus we ask service to retrieve '' (i.e., match all)
            DeptService
                .retrieveDeptDB('')
                .then(function (results) {
                    // The result returned by the DB contains a data object, which in turn contains the records read
                    // from the database
                    vm.departments = results.data;
                })
                .catch(function (err) {
                    console.log("error " + err);
                });
        }

		  // function to switch view 
		  function go_to_fancy_edit(dn) {
		     window.alert("xxxx");
		     $state.go("fancy_edit",{deptnum:dn});
		  }


        // The search function searches for departments that matches query string entered by user. The query string is
        // matched against the department name and department number alike.
        function search() {
            vm.showManager = false;
            DeptService
                // we pass contents of vm.searchString to service so that we can search the DB for this string
                .retrieveDeptDB(vm.searchString)
                .then(function (results) {
                    // The result returned by the DB contains a data object, which in turn contains the records read
                    // from the database
                    vm.departments = results.data;
                })
                .catch(function (err) {
                    console.log("error " + err);
                });
        }


        // The search function searches for departments that matches query string entered by user. The query string is
        // matched against the department name and department number alike.
        function searchForManager() {
            vm.showManager = true;
            DeptService
            // we pass contents of vm.searchString to service so that we can search the DB for this string
                .retrieveDeptManager(vm.searchString)
                .then(function (results){
                    // The result returned by the DB contains a data object, which in turn contains the records read
                    // from the database
                    console.log("results: " + JSON.stringify(results.data));
                    vm.departments = results.data;
                })
                .catch(function (err) {
                    console.info("error " + JSON.stringify(err));
                });
        }
    }
})();
