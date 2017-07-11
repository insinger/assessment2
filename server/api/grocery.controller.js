// NOTE: the grocery info is in req.body.grocery.* (not in req.body.*)


// Create a new grocery
// POST /api/groceries
// This function returns the function that will handle the actual request
var create = function(dbmodels) {
   return function(req, res) {
      dbmodels.Grocery.create({
         id:    req.body.grocery.id,
			upc12: req.body.grocery.upc12,
			brand: req.body.grocery.brand,
			name:  req.body.grocery.name
      })
		.then(function(grocery) {
         console.log(grocery.get({ plain: true }));
         res.status(200).json({grocery:grocery});
      }).catch(function(err) {
         res.status(500).json(err);
      });
   }
};

// Retrieve grocery by id
// GET /api/groceries/:id
// This function returns the function that will handle the actual request
var retrieve = function(dbmodels) {
  return function (req, res) {
		// console.log("retrieve() req.query=",req.query,"req.params=",req.params);
		var where = {};
		if (req.params.id) {
			where.id = req.params.id;
		}

      dbmodels.Grocery.findOne({
			where: where
		})
		.then(function (grocery) {
			res.status(200).json({grocery:grocery});
		})
		.catch(function (err) {
			res.status(500).json({error: true});
		});
	}
};

// Update grocery record
// PUT /api/groceries/:id
// This function returns the function that will handle the actual request
var update = function(dbmodels) {
   return function (req, res) {
      var where = {};
      where.id = req.params.id;
      dbmodels.Grocery.update({
         id:    req.body.grocery.id,
			upc12: req.body.grocery.upc12,
			brand: req.body.grocery.brand,
			name:  req.body.grocery.name
      },
			{where: where}
		)
		.then(function(result) {
			console.log("SUCCESS updating Grocery");
			res.status(200).json(req.body);
		})
		.catch(function(err) {
		 	console.log("ERROR updating Grocery");
			res.status(500).json({error:true});
		});
	}
}

// Delete grocery record
// DELETE /api/groceries/:id", function (req, res) {
// This function returns the function that will handle the actual request
var destroy = function(dbmodels) {
	return function(req,res) {
      var where = {};
      where.id = req.params.id;

	   dbmodels.Grocery.destroy({where:where})
	  	.then(function(result) {
	  		console.log("SUCCESS DELETING Grocery");
	  		res.status(200).json(req.body);
	  	})
	  	.catch(function(err) {
	  		console.log("ERROR DELETING Grocery");
	  		res.status(500).json({error:true});
	  	});
	}
};

// Search DB for all groceries where upc12/brand/name match searchString parameter
// GET /api/groceries?brand=xyz&name=qqq&orderfield=name&orderdirection=a
// GET /api/groceries                    (2)
// This function returns the function that will handle the actual request
var search = function(dbmodels) {
   return function (req, res) {
		var valid_fields=["upc12","brand","name"];
		var or_list=[];
		var orderfield="";
		var orderdirection="ASC";
		var searchspec={};
		console.log("search() req.query=",req.query,"req.params=",req.params);
		// if no query parameters given, interpret as return all groceries 
		if (req.query && Object.keys(req.query).length==0) {
			searchspec={
				where:{id:{$like:"%"}},
				limit:100 // limit 100 if no query given
			}; 
		}
		else { // build query from given parameters
			for (x of Object.keys(req.query)) {
				var lx=x.toLowerCase();
				// if a valid fieldname then add it to the 'or' query
				if (valid_fields.includes(lx)) {
					var term={}
					term[lx]={$like:"%"+req.query[x]+"%"}
					or_list.push(term);
				}
				// field to order by has been provided
				else if (lx=="orderfield") {
					var fieldname=req.query[x].toLowerCase();
					if (valid_fields.includes(fieldname)) orderfield=fieldname;
				}
				// sort order has been provided
				else if (lx=="orderdirection") {
					var dir=req.query[x].toLowerCase();
					if (dir.substring(0,1)=="d") orderdirection="DESC";
				}
			}
			searchspec['where']={$or:or_list};
			searchspec['limit']=20;
			if (orderfield) searchspec['order']=[[orderfield,orderdirection]];
		}
		console.log("searchspec=",searchspec);
		// do the query
		dbmodels.Grocery.findAll(searchspec)
		.then(function(groceries) {
			res.status(200).json({groceries:groceries});
		})
		.catch(function(err) {
			console.log("groceries search error: " + err);
			res.status(500).json(err);
		});
	}
};

// Export route handlers
// note: each of the values in this dictionary is a function call which returns a function
module.exports = function(dbmodels) {
   return {
      create: create(dbmodels),
      retrieve: retrieve(dbmodels),
      update: update(dbmodels),
      destroy: destroy(dbmodels),
      search: search(dbmodels),
   }
};
