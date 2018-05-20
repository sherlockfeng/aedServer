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

var QcloudSms  = require("qcloudsms_js");
var appid = 1400094527;
var appkey = "02d068cdf97b9425a5257c4555b256ed";
var templId = 124441;
var qcloudsms = QcloudSms(appid, appkey);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };

  var phone = req.body.phone
  var uid = req.body.uid
  mongodModel.userModel.find({uid: uid}, function(err, doc){
    if(doc[0].phone == phone) {
      content.status = '1'
      content.msg = '该手机号已被注册'
      res.end(JSON.stringify(content))
    }else {
      var ssender = qcloudsms.SmsSingleSender()
      var verify = Math.random().toString(36).substring(3,7) + ''
      var params = []
      params.push(verify)
      params.push('5')
      ssender.sendWithParam(86, phone, templId,
      params, "", "", "", function(err, result, resData) {
        if (err){
          console.log("err: ", err)
          content.status = '-1000'
          content.msg = '发送短信失败'
          res.end(JSON.stringify(content))
        }else{
          mongodModel.msgModel.remove({'phone': phone},function(error, docs) {
            console.log(error)
            console.log(docs)
            mongodModel.msgModel.create({'createdAt':Date.now(),"msgnum":verify, 'phone': phone},function(error, docs) {
              content.status = '0'
              content.msg = '验证码发送成功'
              res.end(JSON.stringify(content))
            })
          })
        }
        });
    }
  })
})

router.post('/check', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };

  var phone = req.body.phone
  var uid = req.body.uid
  var verify = req.body.verify
  mongodModel.msgModel.find({"phone":phone},function(error, docs) {
    if(docs.length === 0) {
      content.status = '1'
      content.msg = '验证码过期，请重新获取'
      res.end(JSON.stringify(content))
    }else {
      if(docs[0].msgnum === verify) {
        content.status = '0'
        content.msg = '验证码发送成功'
        res.end(JSON.stringify(content))
      }else {
        content.status = '-1000'
        content.msg = '验证码不正确，请重新获取'
        res.end(JSON.stringify(content))
      }
    }
  })
})


module.exports = router;