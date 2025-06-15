const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function (fn, ln, id){
    return _createToken(fn, ln, id);
}

_createToken = function (fn, ln, id){
    try{
        const expiration = new Date();
        const user = {userId:id, firstName:fn, lastName:ln};

        const accessToken = jwt.sign( user, process.env.ACCESS_TOKEN_SECRET);

        var ret = {accessToken:accessToken};
    }
    catch(e){
        var ret = {error:e.message};
    }
    return ret;
}

exports.isExpired = function( token ){
    var isError = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        (err, verifiedJWT) =>
    {
        if(err){
            return true;
        }
        else{
            return false;
        }
    });
    return isError;
}

exports.refresh = function(token){
    var ud = jwt.decode(token, {complete:true});

    var userId = ud.payload.id;
    var firstName = ud.payload.firstName;
    var lastName = ud.payload.lastName;
    return _createToken(firstName, lastName, userId);
}
