const message = require('../../config/messages')

const responseMethod =  {}

responseMethod.onSuccess(function(rst){
    return {result:rst,status : 200, message : message.success}
})

responseMethod.onInvalidRequest(function(rst){
    return {result:rst,status : 500, message : message.invalidRequest}
})
   
module.exports = {
    responseMethod
}
