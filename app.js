const express = require("express");
const app = express();
const ExpressError = require("./expressError");
const middleware = require("./middleware");
const items = require("./fakeDb");
//const morgan = require("morgan")

app.use(express.json());

//GET ALL ITEMS IN LIST
app.get('/items', (req, res) => {
  res.json({ items })
})

//ADD NEW ITEM TO LIST
app.post('/items', (req, res, next) => {
  console.log(req.query.name);
  try{
    if(!req.query.name) throw new ExpressError("Name is required", 400);
    const newItem = {name: req.query.name, price: req.query.price};
    items.push(newItem);
    return res.status(201).json({name:newItem})
  } catch(e){
    return next(e);
  }
})

//GET SPECIFIC ITEM ON LIST
app.get('/items/:name', (req, res) => {
    const findItem = items.find(item => item.name === req.params.name);
    if(findItem === undefined){
      throw new ExpressError("Item is not in shopping list", 404);
    }
    res.json({ item: findItem });
})

//EDIT ITEM ON THE LIST
app.patch('/items/:name', (req, res) => {
    const findItem = items.find(item => item.name === req.params.name);
    if(findItem === undefined){
      throw new ExpressError("Item is not in shopping list", 404);
    }
    findItem.name = req.body.name;
    res.json({ item: findItem });
})

//DELETE AN ITEM ON LIST
app.delete('/items/:name', (req, res) => {
  const findItem = items.find(item => item.name === req.params.name);
  if(findItem === undefined){
    throw new ExpressError("Item is not in shopping list", 404);
  }
  items.splice( findItem, 1)
  res.json({ message: "Deleted"})
})

// 404 Handler
app.use(function(req, res, next) {
    return new ExpressError("Not Found", 404);
});

// Error handler
app.use(function (err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
  
    // set the status and alert the user
    return res.status(status).json({
      error: {
        message: err.message,
        status: status
      }
    });
});

module.exports = app;