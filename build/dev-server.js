require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()


var apiRoutes = express.Router();
var bodyParser = require('body-parser');
var http = require('http');
var data = require('../music.json');
var  request  = require ('request');

//
var Encrypt = require('../crypto.js');
// require('big-integer');
var cookie=null;
var user={};
function createWebAPIRequest(path, data, c, response, method) {
  method = method ? method : "POST";
  var music_req = '';
  var cryptoreq = Encrypt(data);
  var http_client = http.request({
    hostname: 'music.163.com',
    method: method,
    path: path,
    headers: {
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': 'http://music.163.com',
      'Host': 'music.163.com',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
    }
  }, function(res) {
    res.on('error', function(err) {
      response.status(502).send('fetch error');
    });
    res.setEncoding('utf8');
    if(res.statusCode != 200) {
      createWebAPIRequest(path, data, c, response, method);
      return;
    } else if(res.statusCode==403){
      response.send('Forbidden');
    }else{
      res.on('data', function(chunk) {
        music_req += chunk;
      });
      res.on('end', function() {
        if(music_req == '') {
          createWebAPIRequest(path, data, c, response, method);
          return;
        }
        if(res.headers['set-cookie']) {
          cookie=res.headers['set-cookie'];
          response.set('Content-Type','application/json');
          response.send({
            code:200,
            i: JSON.parse(music_req)
          });
          // user=JSON.parse(music_req)
          return;
        }else{
          response.set('Content-Type','application/json');
          response.send(music_req);
        }
      })
    }
  });
  http_client.write('params=' + cryptoreq.params + '&encSecKey=' + cryptoreq.encSecKey);
  http_client.end();
}

function createRequest(path, method, data, callback) {
  var ne_req = '';
  var http_client = http.request({
    hostname: 'music.163.com',
    method: method,
    path: path,
    headers: {
      'Referer': 'http://music.163.com',
      'Cookie': 'appver=1.5.6',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      ne_req += chunk;
    });
    res.on('end', function() {
      callback(ne_req);
    })
  });
  if(method == 'POST') {
    http_client.write(data);
  }
  http_client.end();
}
//

// 获取音乐列表
apiRoutes.get('/music-data', function (req, res) {
  res.json({
    errno: 0,
    musicData: data.musicData
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//搜索音乐
apiRoutes.post('/find-music',function(req,res){
  // var musicName=req.body.musicName;
  // var musicUrl ="http://music.163.com/api/search/get/";
  // var musicConfig={
  //           method: 'post',
  //           url: musicUrl,
  //           form: {
  //           s: musicName,
  //           limit:20,
  //           type:1,
  //           offset:0
  //           },
  //           headers:{'Content-Type': 'application/json','Referer': 'http://music.163.com',
  //     'Cookie': 'appver=1.5.6'},
  // };
  // request(musicConfig,function(err,response,body){
  //   res.json({
  //   errno:0,
  //   musicData:JSON.parse(body).result
  // });
  // });
  var keywords = req.body.musicName || '';
  var type = req.body.type || 1;
  var offset = req.body.offset || '0';
  var limit = req.body.limit || 20;
  var cookie = req.get('Cookie') ? req.get('Cookie') : (req.body.cookie ? req.body.cookie : '');
  var data = {
    "s": keywords,
    "offset": offset,
    "limit": limit,
    "type": type
  };
  createWebAPIRequest('/weapi/cloudsearch/get/web', data, cookie, res);
});

// 搜索歌曲播放直链
apiRoutes.post('/play-music',function(req,res){
  var musicID=req.body.musicID;
  //var musicUrl="http://music.163.com/api/song/detail/?id="+musicID+"&ids=%5B"+musicID+"%5D";
  var br=128000 || req.body.br;
  var data={"ids":[musicID],"br":br,"csrf_token":""};
  var cookie = req.get('Cookie') ? req.get('Cookie') : (req.body.cookie ? req.body.cookie : '');
  createWebAPIRequest('/weapi/song/enhance/player/url', data, cookie, res);
  // request.get(musicUrl,function(err,response,body){
  //   res.json({
  //     errno:0,
  //     musicData:JSON.parse(body)
  //   });
  // });
});

//热歌榜
apiRoutes.post('/hot-toplist',function(req,res){
  var cookie = req.get('Cookie') ? req.get('Cookie') : (req.body.cookie ? req.body.cookie : '');
  createRequest('/api/playlist/detail?id=3778678','GET', {}, function(response) {
    res.setHeader("Content-Type", "application/json");
    res.send(response);
  });
});

//歌词
apiRoutes.get('/lyric',function(req,res){
  var id=req.query.musicID;
  createRequest('/api/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1', 'GET', null, function(response) {
    res.setHeader("Content-Type", "application/json");
    res.send(response);
  });
})

//搜索热门


app.use('/api', apiRoutes);



var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'https://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
