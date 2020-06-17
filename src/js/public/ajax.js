let commom = {
    find(resolve, reject, id, size, kind) {
      let url
      if(size){
        url = "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList&type=" + id + "&size=" + size + "&offset=0"
      }else{
        if(kind === 'play'){
          url =  "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid=" + id
        }else if(kind === 'lry'){
          url =  "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.lry&songid=" + id;
        }else{
          url = "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.search.catalogSug&query=" + id;
        }
      }
        $.ajax({
          type: "GET",
          dataType: "jsonp",
          url: url
        }).then((data)=>{
         resolve(data)
        }).catch((err)=>{
          reject(err)
        })
      }
}

