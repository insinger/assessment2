// register controller function to module
// inject service(s) needed
// expose model variables and functions
// init model variables as required
// check if parameters passed along with the URL for this view
// define functions (which will mostly call functions in the service(s) to do $http.post, etc.)
(function () {
    angular
        .module("MAIN_APP_MODULE")          // to call an angular module, omit the second argument ([]) from the angular.module()
        // syntax this syntax is called the getter syntax
        .controller("BBBctrl", BBBctrl);    // angular.controller() attaches a controller to the angular module
                                            // specified as you can see, angular methods are chainable


    BBBctrl.$inject = ['$filter', '$window', 'DeptService','$state','$stateParams'];


    function BBBctrl($filter, $window, DeptService,$state,$stateParams) {

        var vm = this;

        // Exposed to view: data models ----------------
        vm.department = {
            id: ""
            , name: ""
            , manager: ""
        };
        // Creates a status object. We will use this to display appropriate success or error messages.
        vm.status = {
            message: ""
            , code: ""
        };

        // Exposed to view: functions ------------------
        vm.register = register;


        // Initializations --------------------------------------------------------------------------------------------
        // Functions that are run when view/html is loaded

        initManagerBox();

		  // check if there are any parameters passed along with the URL for this view
		  // this is triggered by ...
		  if ($stateParams && $stateParams.deptnum) {
			  // for example:
		     // vm.dept_no=$stateParams.deptnum;
			  // vm.search();
		  }

        // Function declaration and definition -------------------------------------------------------------------------

        // initManagerBox triggers retrieval of employees that are currently not managers of existing departments and
        // displays these employees in the manager selection box
        function initManagerBox() {
            EmpService
                .retrieveNonManagers()
                .then(function (results) {
                    console.log("--- EMPLOYEES ----");
                    console.log(results.data);
                    // results.data is expected to contain employee number, first name, and last name
                    vm.employees = results.data;
                })
                .catch(function (err) {
                    console.log("error " + JSON.stringify(err));
                    vm.status.message = err.data.name;
                    vm.status.code = err.data.parent.errno;
                });
        }

		  // function to switch view 
		  function go_to_fancy_edit(dn) {
		     window.alert("xxxx");
		     $state.go("fancy_edit",{deptnum:dn});
		  }


        // register function triggers department registration and persistence (i.e., saving to DB)
        function register() {
            // Prints registration information onto the client console
            console.log("The registration information you sent were:");
            console.log(vm.department);

            vm.department.from_date = $filter('date')(new Date(), 'yyyy-MM-dd');
            vm.department.to_date = new Date('9999-01-01');
            console.log("vm.dept" + JSON.stringify(vm.department));

            // Call DeptService.insertDept to handle registration of department information. The data sent to this
            // function will eventually be inserted into the database.
            DeptService
                .insertDept(vm.department)
                .then(function (result) {
                    console.log("result " + JSON.stringify(result));
                    $window.location.assign('/app/registration/thanks.html');
                })
                .catch(function (err) {
                    console.log("error " + JSON.stringify(err));
                    vm.status.message = err.data.name;
                    vm.status.code = err.data.parent.errno;
                });
        }
    }

})();
