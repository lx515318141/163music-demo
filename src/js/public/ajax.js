let commom = {
    find() {
        $.ajax({
          type: "GET",
          dataType: "jsonp",
          url:
            "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type=1&size=10&offset=0"
        }).then()
      }
}