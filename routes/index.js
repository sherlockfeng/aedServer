var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var mongodModel = require('../mongodb/mongodModel')
var util = require('../util')
var cookie = require('cookie-parser');
var request = require('request');
var formidable = require('formidable');
var path = require('path');
var multipart = require('connect-multiparty');
var fs = require('fs');
var TITLE = 'formidable上传示例';
var varAVATAR_UPLOAD_FOLDER = '/images/';
var time = ''

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/aedinfo', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  mongodModel.aedModel.find({}, function(error, docs) {
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

router.post('/aedinfo', function(req, res, next) {
  var body = req.body
  var content = {
    status: '-10000', 
    msg: '查询失败',
    data: []
  };
  var crtTime = new Date();
  mongodModel.aedModel.create({
    address: body.address,
    longitude: body.longitude,
    latitude: body.latitude,
    status: body.status,
    updatetime: util.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime),
    city: body.city,
    ismr: body.ismr,
    dec: body.dec,
  }, function(error, docs) {
    if(error) {
      res.end(JSON.stringify(content));
    }else {
      content.status = '0'
      content.msg = '新增成功'
      content.data = docs
      mongodModel.aedModel.find({}, function(error, docs) {
        if(error) {
          content.status = '-9999'
          content.msg = '新增后查询失败'
          res.end(JSON.stringify(content));
        }else {
          content.data = docs
          res.end(JSON.stringify(content));
        }
      })
    }
  })
});

router.post('/deleteAed', function(req, res, next) {
  var body = req.body
  var content = {
    status: '-10000', 
    msg: '删除失败',
    data: []
  };
  var crtTime = new Date(); 
  util.deleteFolder('./public/images/'+req.body.id)
  mongodModel.aedModel.remove({_id: { $in: req.body.id }}, function(error, docs) {
    if(error) {
      res.end(JSON.stringify(content));
    }else {
      content.status = '0'
      content.msg = '删除成功'
      content.data = docs
      mongodModel.aedModel.find({}, function(error, docs) {
        if(error) {
          content.status = '-9999'
          content.msg = '新增后查询失败'
          res.end(JSON.stringify(content));
        }else {
          content.data = docs
          res.end(JSON.stringify(content));
        }
      })
    }
  })
})

router.post('/modifyAed', function(req, res, next) {
  var body = req.body
  var crtTime = new Date(); 
  var content = {
    status: '-10000', 
    msg: '修改失败',
    data: []
  };
  if(body.address === '') {
    content.msg = '请输入地址'
    res.end(JSON.stringify(content));
  }else {
    var change = {
      address: body.address,
      longitude: body.longitude,
      latitude: body.latitude,
      status: body.status,
      updatetime: util.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime),
      city: body.city,
      dec: body.dec,
      ismr:body.ismr
    }
    var crtTime = new Date(); 
    mongodModel.aedModel.update({_id: body.id},change, function(error, docs) {
      if(error) {
        res.end(JSON.stringify(content));
      }else {
        content.status = '0'
        content.msg = '新增成功'
        content.data = docs
        mongodModel.aedModel.find({}, function(error, docs) {
          if(error) {
            content.status = '-9999'
            content.msg = '新增后查询失败'
            res.end(JSON.stringify(content));
          }else {
            content.data = docs
            res.end(JSON.stringify(content));
          }
        })
      }
    })
  }
})

router.get('/admininfo', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  mongodModel.adminModel.find({}, function(error, docs) {
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

router.post('/admininfo', function(req, res, next) {
  var body = req.body
  var content = {
    status: '-10000', 
    msg: '新增失败',
    data: []
  };
  mongodModel.adminModel.find({username: req.body.username}, function(error, docs) {
    if(error) {
      content.status = '-9999'
      content.msg = '查询失败'
      res.end(JSON.stringify(content));
    }else {
      content.data = docs
      if(docs.length === 0){
        var crtTime = new Date(); 
        mongodModel.adminModel.create({
          password: body.password,
          username: body.username,
          status: 1,
          updatetime: util.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime)
        }, function(error, docs) {
          if(error) {
            res.end(JSON.stringify(content));
          }else {
            content.status = '0'
            content.msg = '新增成功'
            content.data = docs
            mongodModel.adminModel.find({}, function(error, docs) {
              if(error) {
                content.status = '-9999'
                content.msg = '新增后查询失败'
                res.end(JSON.stringify(content));
              }else {
                content.data = docs
                res.end(JSON.stringify(content));
              }
            })
          }
        })
      }else {
        content.status = '-9998'
        content.msg = '用户名重复'
        res.end(JSON.stringify(content));
      }
    }
  })
});

router.post('/deleteAdmin', function(req, res, next) {
  var body = req.body
  var content = {
    status: '-10000', 
    msg: '删除失败',
    data: []
  };
  var crtTime = new Date(); 
  mongodModel.adminModel.find({_id: req.body.id[0]}, function(error, docs) {
    if(error){
      res.end(JSON.stringify(content));
    }else {
      if(docs[0].status === 0) {
        content.msg = '不能删除管理员账号'
        res.end(JSON.stringify(content));
      }else {
        mongodModel.adminModel.remove({_id: { $in: req.body.id }}, function(error, docs) {
          if(error) {
            res.end(JSON.stringify(content));
          }else {
            content.status = '0'
            content.msg = '删除成功'
            content.data = docs
            mongodModel.adminModel.find({}, function(error, docs) {
              if(error) {
                content.status = '-9999'
                content.msg = '新增后查询失败'
                res.end(JSON.stringify(content));
              }else {
                content.data = docs
                res.end(JSON.stringify(content));
              }
            })
          }
        })
      }
    }
  })
})

router.post('/modifyAdmin', function(req, res, next) {
  var body = req.body
  var crtTime = new Date(); 
  var change = {
    updatetime: util.dateFtt("yyyy-MM-dd hh:mm:ss",crtTime)
  }
  if(body.username !== '' &&  body.username){
    change.username = body.username
  }
  if(body.password !== '' && body.password){
    change.password = body.password
  }
  var content = {
    status: '-10000', 
    msg: '修改失败',
    data: []
  };
  var crtTime = new Date(); 
  mongodModel.adminModel.update({_id: body.id},change, function(error, docs) {
    if(error) {
      res.end(JSON.stringify(content));
    }else {
      content.status = '0'
      content.msg = '修改成功'
      content.data = docs
      mongodModel.adminModel.find({}, function(error, docs) {
        if(error) {
          content.status = '-9999'
          content.msg = '修改后查询失败'
          res.end(JSON.stringify(content));
        }else {
          content.data = docs
          res.end(JSON.stringify(content));
        }
      })
    }
  })
})

router.post('/login', function(req, res, next) {

  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  var username = req.body.username
  var password = req.body.password
  mongodModel.adminModel.find({username: username, password: password}, function(error, docs) {
    if(error) {
      content.status = '-10000'
      content.msg = '查询失败'
      res.end(JSON.stringify(content));
    }else {
      if(docs.length === 0){
        content.status = '-10000'
        content.msg = '用户名或密码错误'
        res.end(JSON.stringify(content));
      }else{
        var temp = {
          statue: docs[0].status
        }
        if(req.body.aedRem) {
          res.cookie('aedRem', JSON.stringify(temp), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), httpOnly: true });
        }else {
          res.cookie('aedRem', JSON.stringify(temp), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24), httpOnly: true });
        }
        content.data = docs
        res.end(JSON.stringify(content));
      }
    }
  })
});


router.get('/check', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  req.cookies.aedRem && (content.data = [req.cookies.aedRem])
  res.end(JSON.stringify(content));
});

router.get('/logout', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  res.cookie('aedRem', '', { expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), httpOnly: true });
  res.end(JSON.stringify(content));
});

router.post('/nearBy', function(req, res, next) {
  var latitude = Number(req.body.latitude)
  var longitude = Number(req.body.longitude)
  var city = req.body.city
  
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  var toLatitude = 0
  var toLongitude = 0
  var result = []
  var distance = 0
  var imglist = []
  var _id = ''
  mongodModel.aedModel.find({status:0}, function(error, docs) {
    if(error) {
      content.status = '-10000'
      content.msg = '查询失败'
      res.end(JSON.stringify(content));
    }else {
      for(var i = 0; i < docs.length; i++) {
        toLatitude = docs[i].latitude
        toLongitude = docs[i].longitude
        distance = util.getDisance(latitude, longitude, toLatitude, toLongitude)
        imglist = docs[i].imglist
        _id = docs[i]._id
        if(distance < 100000){
          result.push({
            latitude: toLatitude,
            longitude: toLongitude,
            name: 'AED设备('+docs[i].dec+')',
            address: docs[i].address,
            distance: distance,
            imglist: imglist,
            _id:_id,
            ismr:docs[i].ismr
          })
        }
      }
      result.sort(function(a,b){
        return a.distance - b.distance
      })
      // result = result.slice(0, 5)
      content.data = result
      res.end(JSON.stringify(content));
    }
  })
});

router.post('/tips',function(req, res, next) {
  var input = req.body.input
  var content = {
    status: '0', 
    msg: '查询成功',
    data: []
  };
  if(!time) {
    var newTime = new Date().getTime()
    if(newTime - time > 500){
      time = newTime
      request('http://apis.map.qq.com/ws/place/v1/suggestion?key='+encodeURIComponent('SAIBZ-KALRG-VQFQF-ISJIM-CBP2H-VOBTP')+'&keyword='+encodeURIComponent(input), function (error, response, body) {
        var result = JSON.parse(response.body)
        if(result.status === 0){
          for(var i=0;i<result.data.length;i++){
            var province = result.data[i].province || ''
            var city = result.data[i].city || ''
            if(province == city){
              provicecity = city
            }else{
              provicecity = province+city
            }
            var district = result.data[i].district || ''
            content.data.push(provicecity+district+result.data[i].title)
          }
        }
        res.end(JSON.stringify(content));
      });
    }else{
      res.end(JSON.stringify(content));
    }
  }else{
    time = new Date().getTime()
    request('http://apis.map.qq.com/ws/place/v1/suggestion?key='+encodeURIComponent('SAIBZ-KALRG-VQFQF-ISJIM-CBP2H-VOBTP')+'&keyword='+encodeURIComponent(input), function (error, response, body) {
        var result = JSON.parse(response.body)
        if(result.status === 0){
          console.log(result.data)
          for(var i=0;i<result.data.length;i++){
            var province = result.data[i].province || ''
            var city = result.data[i].city || ''
            if(province == city){
              provicecity = city
            }else{
              provicecity = province+city
            }
            var district = result.data[i].district || ''
            content.data.push(provicecity+district+result.data[i].title)
          }
        }
        res.end(JSON.stringify(content));
      });   
  }

})



router.post('/upload', multipart(), function (req, res) {
  var content = {
    status: '-1000', 
    msg: '上传失败',
    data: []
  };
  //获得文件名
  var pathName = req.query.filename
  var filename = new Date().getTime()
  var type = req.files.file.type.split('/')[1]
  fs.exists('./public/images/'+pathName, function(exists){
    if(!exists) {
      fs.mkdir('./public/images/' + pathName, function(err){
        if(!err){
          //复制文件到指定路径
          var targetPath = './public/images/' + pathName + '/' + filename + '.' + type;
          //复制文件流
          fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(targetPath));
          mongodModel.aedModel.update({_id : pathName}, { $push : { imglist : filename + '.' + type}},function(error, docs){
            if(error){
              content.msg = '数据库更新失败'
            }else{
              content.status = 0
              content.msg = '上传成功'
            }
          })
        }
      })
    }else{
      //复制文件到指定路径
      var targetPath = './public/images/' + pathName + '/' + filename + '.' + type;
      //复制文件流
      fs.createReadStream(req.files.file.path).pipe(fs.createWriteStream(targetPath));
      mongodModel.aedModel.update({_id : pathName}, { $push : { imglist : filename + '.' + type}},function(error, docs){
        if(error){
          content.msg = '数据库更新失败'
        }else{
          content.status = 0
          content.msg = '上传成功'
        }
      })
    }
  });

  //响应ajax请求，告诉它图片传到哪了
  res.end(JSON.stringify(content));
});



router.post('/deleteImg', function(req, res, next) {
  var content = {
    status: '0', 
    msg: '删除成功',
    data: []
  };
  var targetPath = './public/images/' + req.body.id + '/' + req.body.name;
  console.log(req.body)
  fs.unlink(targetPath)
  mongodModel.aedModel.updateMany({_id : req.body.id}, { $pull : { imglist : req.body.name}},function(error, docs){
    if(error){
      content.status= '-10000', 
      content.msg = '删除成功失败'
    }else{
      res.end(JSON.stringify(content));
    }
  })
});

module.exports = router;
