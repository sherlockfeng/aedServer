var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var mongodModel = require('../mongodb/mongodModel')
var util = require('../util')
var cookie = require('cookie-parser');
var request = require('request');
var path = require('path');
var multipart = require('connect-multiparty');
var fs = require('fs');

router.get('/', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  mongodModel.maydayModel.find({}, function(error, docs) {
    if(error) {
      content.status = '-10000'
      content.msg = '查询失败'
      res.end(JSON.stringify(content));
    }else {
      content.data = docs
      res.end(JSON.stringify(content));
    }
  })
});

router.post('/', function(req, res, next) {
  var param = req.body
  var crtTime = new Date();
  var content = {
    status: '-10000', 
    msg: '新增失败',
    data: []
  };
  param.updatetime = util.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime),
  param.imgList = param.imgList.split(',')
  mongodModel.maydayModel.create(param, function(error, docs) {
    if(error) {
      res.end(JSON.stringify(content));
    }else {
      content.status = '0'
      content.msg = '发布成功'
      content.data = param
      res.end(JSON.stringify(content));
    }
  })
})

router.post('/upload', multipart(), function (req, res) {
  var content = {
    status: '-1000', 
    msg: '上传失败',
    data: []
  };
  //获得文件名
  var pathName = req.query.pathname
  var filename = req.query.filename
  var type = req.files.file.type.split('/')[1]
  var paths = path.join(__dirname, '../public/maydayImage/')
  var targetPath = paths + pathName + '/' + filename + '.' + type;
  fs.exists(paths+pathName, function(exists){
    if(!exists) {
      content.status = '-100'
      fs.mkdir(paths + pathName, function(err){
        if(!err){
          //复制文件到指定路径
          
          //复制文件流
          fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(targetPath))
          content.status = '0'
          content.msg = '上传成功'
          res.end(JSON.stringify(content));
        }else{
          content.status = '-300'
          res.end(JSON.stringify(content));
        }
      })
    }else{
      content.status = '-200'
      //复制文件到指定路径
      // var targetPath = paths + pathName + '/' + filename + '.' + type;
      //复制文件流
      fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(targetPath));
      content.status = '0'
      content.msg = '上传成功'
      res.end(JSON.stringify(content));
    }
  })
});

module.exports = router;