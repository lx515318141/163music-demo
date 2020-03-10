let commom = {
    find(resolve, reject) {
        $.ajax({
          type: "GET",
          dataType: "jsonp",
          url:
            "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type=1&size=10&offset=0"
        }).then((data)=>{
         resolve(data)
        }).catch((err)=>{
          reject(err)
        })
      }
}





// let _self = this;
// function fn(data){
//   console.log(data)
//   console.log(_self .model)
//   _self .model.data.songs = data.song_list;
//   console.log(_self .model.data.songs)
// }

// commom.find((data) => {
// 	 console.log(data)
//          console.log(this.model)
//          this.model.data.songs = data.song_list;
//          console.log(this.model.data.songs)
// 	}, (err)=>{
//          alert('x');
//        })
