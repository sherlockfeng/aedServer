var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var mongodModel = require('../mongodb/mongodModel')
var util = require('../util')
var cookie = require('cookie-parser');
var request = require('request');
var path = require('path');
var APPID = 'wx110ab6473aa49e96'
var SECRET = 'aa2f081c63c93e69632ac6adbb873cf8'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  var uid = req.body.uid
  mongodModel.userModel.find({uid: uid}, function(error, docs) {
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

router.post('/register', function(req, res, next) {
  var content = {
    status: '-1000', 
    msg: '注册失败',
    data: []
  };
  var code = req.body.code
  request('https://api.weixin.qq.com/sns/jscode2session?appid=' + APPID + '&secret=' + SECRET + '&js_code='+ code + '&grant_type=authorization_code', function (error, response, body) {
    var result = JSON.parse(response.body)
    if(!result.errcode){
      var crtTime = new Date();
      var updatetime = util.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime)
      mongodModel.userModel.find({uid:result.openid}, function (error, doc) { 
        if(doc.length === 0) {
          mongodModel.userModel.create({
            uid: result.openid,
            isSe: 0,
            updatetime
          }, function(error, docs) {
            if(error) {
              res.end(JSON.stringify(content));
            } else {
              content.status = '0'
              content.msg = '注册成功'
              content.data = [{
                uid:result.openid,
                isSe :0,
                updatetime
              }]
              res.end(JSON.stringify(content));
            }
          })
        } else {
          content.status = '1'
          content.msg = '已注册'
          content.data = doc
          res.end(JSON.stringify(content));
        }
       })
    }else {
      res.end(JSON.stringify(content));
    }
  });
});

module.exports = router;
