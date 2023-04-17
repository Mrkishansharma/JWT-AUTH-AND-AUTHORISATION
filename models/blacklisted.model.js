
const mongoose = require('mongoose');


const tokenSchema = mongoose.Schema({

    Token : {type:String, required:true}

}, {

    versionKey:false
    
})

const BlacklistedModel = mongoose.model('blacklist', tokenSchema);

module.exports = {BlacklistedModel}