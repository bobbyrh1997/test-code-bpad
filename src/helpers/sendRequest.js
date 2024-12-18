var request = require("request");

module.exports = (options)=>{
    return new Promise(function(resolve,reject){
        request(options,function(error,response){
            if(error) return reject(error);
            resolve(response.body);
        });
    });
};