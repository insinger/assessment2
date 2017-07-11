// register controller function to module
// inject service(s) needed
// expose model variables and functions
// init model variables as required
// check if parameters passed along with the URL for this view
// define functions (which will mostly call functions in the service(s) to do $http.post, etc.)

(function () {
    'use strict';
    angular
        .module("MAIN_APP_MODULE")
        .controller("AAActrl", AAActrl);

    AAActrl.$inject = ['$filter', '$window', 'DeptService','$state','$stateParams'];

    function AAActrl($filter, $window, DeptService,$state,$stateParams) {

        var vm = this;

        // Exposed to view: data models ----------------
        vm.dept_no = "";
        vm.result = {};

        // Exposed to view: functions ------------------
        vm.deleteManager = deleteManager;
        vm.initDetails = initDetails;
        vm.search = search;
        vm.toggleEditor = toggleEditor;
        vm.updateDeptName = updateDeptName;


        // Initializations --------------------------------------------------------------------------------------------
        // Functions that are run when view/html is loaded
        initDetails();

		  // check if there are any parameters passed along with the URL for this view
		  // this is triggered by searchDB.controller.js function go_to_fancy_edit()
		  if ($stateParams && $stateParams.deptnum) {
		     vm.dept_no=$stateParams.deptnum;
			  vm.search();
		  }


        // Function declaration and definition -------------------------------------------------------------------------
        // Deletes displayed manager. Details of preceding manager is then displayed.
        function deleteManager() {
            DeptService
                .deleteDept(vm.dept_no, vm.result.manager_id)
                .then(function (response) {
                    // Calls search() in order to populate manager info with predecessor of deleted manager
                    search();
                })
                .catch(function (err) {
                    console.log("error: \n" + JSON.stringify(err));
                });
        }

        // Initializes department details shown in view
        function initDetails() {
            vm.result.dept_no = "";
            vm.result.dept_name = "";
            vm.result.manager_id = "";
            vm.result.manager_name = "";
            vm.result.manager_from = "";
            vm.result.manager_to = "";
            vm.result.manager_id = "";
            vm.showDetails = false;
            vm.isEditorOn = false;
        }

		  // function to switch view 
		  function go_to_fancy_edit(dn) {
		     window.alert("xxxx");
		     $state.go("fancy_edit",{deptnum:dn});
		  }


        // Saves edited department name
        function updateDeptName() {
            DeptService
                .updateDept(vm.dept_no, vm.result.dept_name)
                .then(function (result) {
                    console.log("-- > updateDeptName() > results: \n" + JSON.stringify(result.data));
                })
                .catch(function (err) {
                    console.log("-- > updateDeptName() > error: \n" + JSON.stringify(err));
                });
            vm.toggleEditor();
        }

        // Given a department number, this function searches the Employees database for
        // the department name, and the latest department manager's id/name and tenure
        function search() {
            initDetails();
            vm.showDetails = true;

            DeptService
                .retrieveDeptByID(vm.dept_no)
                .then(function (result) {
                    // Show table structure
                    vm.showDetails = true;

                    // This is a good way to understand the type of results you're getting
                    console.log("-- > search() > results: \n" + JSON.stringify(result.data));

                    // Exit .then() if result data is empty
                    if (!result.data)
                        return;

                    // The result is an array of objects that contain only 1 object
                    // We are assigning value like so, so that we don't have to do access complex structures
                    // from the view. Also this would give you a good sense of the structure returned.
                    // You could, of course, massage data from the back end so that you get a simpler structure
                    vm.result.dept_no = result.data.dept_no;
                    vm.result.dept_name = result.data.dept_name;
                    if (result.data.managers[0]) {
                        vm.result.manager_id = result.data.managers[0].emp_no;
                        vm.result.manager_name = result.data.managers[0].employee.first_name
                            + " "
                            + result.data.managers[0].employee.last_name;
                        vm.result.manager_from = $filter('date')
                        (result.data.managers[0].from_date, 'MMM dd, yyyy');
                        vm.result.manager_to = $filter('date')
                        (result.data.managers[0].to_date, 'MMM dd, yyyy');
                    }
                })
                .catch(function (err) {
                    console.log("--  > search() > error: \n" + JSON.stringify(err));
                });
        }

        // Switches editor state of the department name input/edit field
        function toggleEditor() {
            vm.isEditorOn = !(vm.isEditorOn);
        }
    }
})();
