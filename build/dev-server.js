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
// var user={};
function randomUserAgent() {
  const userAgentList = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
    'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586',
    'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
  ]
  const num = Math.floor(Math.random() * userAgentList.length)
  return userAgentList[num]
}

var cookie=null;
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
      'Cookie': c,
      'User-Agent': randomUserAgent()
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
      'User-Agent': randomUserAgent()
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

//搜索建议
apiRoutes.get('/find-music-suggest',function(req,res){
  var cookie = req.get('Cookie') ? req.get('Cookie') : (req.query.cookie ? req.query.cookie : '');
  var data={
    'csrf_token': '',
    's': req.query.musicName || '',
    // 'limit':10
  };
  createWebAPIRequest('/weapi/search/suggest/web', data, cookie, res,'POST');
})

// 搜索歌曲url
apiRoutes.post('/play-music',function(req,res){
  var musicID=req.body.musicID;
  //var musicUrl="http://music.163.com/api/song/detail/?id="+musicID+"&ids=%5B"+musicID+"%5D";
  var br=128000 || req.body.br;
  var data={"ids":[musicID],"br":br,"csrf_token":""};
  var cookie = req.get('Cookie') ? req.get('Cookie') : (req.body.cookie ? req.body.cookie : '');
  createWebAPIRequest('/weapi/song/enhance/player/url', data, cookie, res);
});

//热歌榜
apiRoutes.get('/hot-toplist',function(req,res){
  // var cookie = req.get('Cookie') ? req.get('Cookie') : (req.body.cookie ? req.body.cookie : '');
  createRequest('/api/playlist/detail?id=3778678','GET', {}, function(response) {
    res.setHeader("Content-Type", "application/json");
    res.send(response);
  });
});

//歌词
apiRoutes.get('/lyric',function(req,res){
  var id=req.query.musicID;
  var data={};
  var cookie = req.get('Cookie') ? req.get('Cookie') : (req.query.cookie ? req.query.cookie : '');
  createWebAPIRequest('/weapi/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1', data, cookie, res,'POST');
});

// 搜索热门
apiRoutes.get('/search-hot',function(req,res){
  var hotKeywords=['张杰', '赵雷', '李健', '林志炫', '张碧晨',
                                        '梁博', '周笔畅', '张靓颖', '陈奕迅', '周杰伦',
                                         '王力宏', 'TFBoys', '李玉刚', '魏晨', '薛之谦',
                                         '理想三旬','一生所爱','童话镇','Seve','春风十里',
                                         'Panama','小半','你就不要想起我','谢春花','成都'
                                      ];
  var rHot = new Array(8);
  for (let i = 0; i < rHot.length; i++) {
    let length = hotKeywords.length;
    let random = Math.floor(length * Math.random());
    rHot[i] = hotKeywords[random];
    hotKeywords.splice(random, 1);
  }
  res.json({
    errno: 0,
    searchHot: rHot
  });
})


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

var uri = 'http://localhost:' + port

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
