// define API route handlers
// Load controller(s) and wire up API endpoints to functions defined in the controller(s)

module.exports = function(app, dbmodels) {
  var GroceryController = require('./api/grocery.controller')(dbmodels); 

  // Create new grocery
  app.post("/api/groceries", GroceryController.create);

  // Retrieve grocery 
  app.get("/api/groceries/:id", GroceryController.retrieve);

  // Update grocery 
  app.put("/api/groceries/:id", GroceryController.update);

  // Delete grocery 
  app.delete("/api/groceries/:id", GroceryController.destroy);

  // Search groceries 
  app.get("/api/groceries", GroceryController.search);

};
