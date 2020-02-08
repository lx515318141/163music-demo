var http = require('http')
var fs = require('fs')
var url = require('url')
var querystring = require("querystring");
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/
  if(path === '/uptoken' && method === 'POST'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')
    var data = ''
    request.on('data', function(chunk){
      data += chunk
    })
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    request.on('end', function(){
      data = querystring.parse(data)
      // 将字符串转换成对象
      var db = fs.readFileSync('./data-bank', 'utf8',)
      var newData = db + JSON.stringify(data)
      fs.writeFileSync('./data-bank', newData)
      console.log(newData)
    })
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    response.end()
  }else if(path === '/load'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')
    var songs = fs.readFileSync('./data-bank', 'utf8')
    response.write(songs)
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)

 