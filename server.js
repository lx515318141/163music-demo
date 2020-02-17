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
      let db = JSON.parse(fs.readFileSync('./data-bank', 'utf8',)) 
      // 文件中写入的都是字符串。所以要先将字符串转换成对象再进行操作
      db.push(data)
      // push方法会返回修改后该数组的新长度
      db = JSON.stringify(db)
      // 再将完成操作的对象转换回字符串，存到数据库中
      fs.writeFileSync('./data-bank', db)
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
  }else if(path === '/change' && method === 'POST'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')
    var Data = ''
    request.on('data', function(chunk){
      Data += chunk
    })
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    request.on('end', function(){
      Data = querystring.parse(Data)
      // 将字符串转换成对象
      console.log(Data)
      db = JSON.parse(fs.readFileSync('./data-bank', 'utf8',))
      console.log(db)
      for(let i=0; i<db.length; i++){
        if(db[i].id === Data.id){
          db[i] = Data
        }
      }
      db = JSON.stringify(db)
      fs.writeFileSync('./data-bank', db)
    })
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

 