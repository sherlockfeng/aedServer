var mongoose = require("mongoose")
mongoose.connect('mongodb://localhost/admin')
// mongoose.connect('mongodb://username:password@localhost/admin');
let db = mongoose.connection
db.on('error', function(){
    console.log('error')
})
db.once('open', function(){
  console.log('MongoDB连接成功！！')
})
var adminSchema = new mongoose.Schema({
    username : {type:String},
    password : {type:String},
    status : {type:Number,default:0},
    updatetime : {type:String},
});
var aedSchema = new mongoose.Schema({
    address : {type:String},
    longitude : {type:String},
    latitude : {type:String},
    updatetime : {type:String},
    status : {type:Number,default:0},
    city : {type:String,default:'中国'},
    dec : {type:String,default:''},
    imglist : {type:Array,default:[]},
    ismr : {type:Number,default:0},
    extro:{type:String,default:''},
    extro1:{type:String,default:''},
});

var mongodModel = {
    adminModel: mongoose.model('admins', adminSchema),
    aedModel: mongoose.model('aeds', aedSchema) 
}
module.exports = mongodModel
//admin 0 管理员 1 普通用户
//aed 0 启用 1 停用