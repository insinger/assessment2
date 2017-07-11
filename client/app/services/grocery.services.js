// Always use an IIFE, i.e., (function() {})();
(function () {
    // Attaches GroceryService service to the MAIN_APP_MODULE module
    angular
        .module("MAIN_APP_MODULE")
        .service("GroceryService", GroceryService);

    GroceryService.$inject = ['$http'];

    function GroceryService($http) {

        var service = this;

        // EXPOSED FUNCTIONS -------------------------------------------------------------------------------------------
        service.createGrocery=createGrocery;
        service.retrieveGroceriesByID=retrieveGroceriesByID;
        service.retrieveGroceries=retrieveGroceries;
        service.updateGrocery=updateGrocery;
        service.deleteGrocery=deleteGrocery;

        // EXPOSED MODELS -------------------------------------------------------------------------------------------
		  service.stash={}
		  service.stash.brandSearchString='';
		  service.stash.nameSearchString='';
		  service.stash.multiSearchString='';

        // Grocery services -------------------------------------------------------------------------

        function createGrocery(grocery) {
            return $http({
                method: 'POST',
                url: 'api/groceries',
                data: {grocery: grocery}
            });
        }

        function retrieveGroceriesByID(id) {
            return $http({
                method: 'GET',
                url: 'api/groceries/'+id,
            });
        }

        function retrieveGroceries(searchField,term) {
				var searchString="";
				var params={};
				if (searchField=="brand" || searchField=="name") {
					params[searchField]=term;
				} else {
					params["brand"]=term;
					params["name"]=term;
				}
            return $http({
                method: 'GET',
                url: 'api/groceries/',
                params: params
            });
        }

        function updateGrocery(id,grocery) {
            return $http({
                method: 'PUT',
                url: 'api/groceries/' + id,
                data: {
                    grocery: grocery
                }
            });
        }

        function deleteGrocery(id) {
            return $http({
                method: 'DELETE',
                url: 'api/groceries/' + id,
            });
        }

    }
})();
