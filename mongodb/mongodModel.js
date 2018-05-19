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
    username : {type:String,default:''},
    password : {type:String,default:''},
    status : {type:Number,default:0},
    updatetime : {type:String,default:''},
});
var aedSchema = new mongoose.Schema({
    address : {type:String,default:''},
    longitude : {type:String,default:''},
    latitude : {type:String,default:''},
    updatetime : {type:String,default:''},
    status : {type:Number,default:0},
    city : {type:String,default:'中国'},
    dec : {type:String,default:''},
    imglist : {type:Array,default:[]},
    ismr : {type:Number,default:0},
    phone:{type:String,default:''},
    extro:{type:String,default:''},
    extro1:{type:String,default:''},
    weixin:{type:Number},//0 微信上传 1 后台上传
});
var userSchema = new mongoose.Schema({
    username : {type:String,default:''},
    password : {type:String,default:''},
    uid:{type:String,default:''},
    phone : {type:String,default:''},
    isSe : {type:Number,default:0},
    dec: {type:String,default:''},
    longitude : {type:String,default:''},
    latitude : {type:String,default:''},
    address: {type:String,default:''},
    timeStart: {type:String,default:''},
    timeEnd: {type:String,default:''},
    updatetime : {type:String,default:''},
    id: {type:String,default:''},
    seId: {type:String,default:''},
    seTime: {type:String,default:''},
    seCom: {type:String,default:''},
    imglist: {type:Array,default:[]},
    skill: {type:Array,default:[]},
    longitudeOther : {type:String,default:''},
    latitudeOther : {type:String,default:''},
    addressOther: {type:String,default:''},
});

var mongodModel = {
    adminModel: mongoose.model('admins', adminSchema),
    aedModel: mongoose.model('aeds', aedSchema),
    userModel: mongoose.model('users', userSchema),
}
module.exports = mongodModel
//admin 0 管理员 1 普通用户
//aed 0 启用 1 停用
//isSe 0 救生员 1 非救生员