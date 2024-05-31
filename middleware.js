const ExpressError = require("./expressError");

function middleStuff(req, res, next){
    try{

    }catch(e){
        return next(e);
    }
}

module.exports = {middleStuff};