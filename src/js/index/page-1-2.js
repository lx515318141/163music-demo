{
  let view = {
    el: "section.songs",
    init() {
      this.$el = $(this.el);
    },
    template: ` 
        <li>
          <a href="./play.html?{{song.id}}">
          <div class="info">
            <h3>{{song.title}}</h3>
            <p>
              <svg class="icon icon-sq1" aria-hidden="true">
                <use xlink:href="#icon-sq2"></use>
              </svg>
              {{song.author}}
            </p>
          </div>
          <div class="playButton">
            <svg class="icon icon-play1" aria-hidden="true">
                <use xlink:href="#icon-play1"></use>
            </svg>
          </div>
          </a>
        </li>`,
    render(data) {
      // 传过来的data是一个对象，对象里面是一个数组
      let { songs } = data;
      // 将数组赋给songs，songs就是这个数组
      songs.map(song => {
        // 遍历songs，把里面的每一个song都生成一个li
        let $li = $(
          this.template
            .replace("{{song.title}}", song.title)
            .replace("{{song.author}}", song.author)
            .replace("{{song.id}}", song.song_id)
        );
        this.$el.find("ol.list").append($li);
        // 再把生成的li放到class为list的ol里面
      });
    }
  };
  let model = {
    data: {
      songs: []
    },
    find(suc, err) {
      // return $.ajax({
      //   type: "GET",
      //   dataType: "jsonp",
      //   url:
      //     "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList&type=1&size=10&offset=0"
      // }).then((data)=>{
      //   this.data.songs = data.song_list;
      // })

      // let _self = this
      // function fn(data){
      //   console.log(data)
      //   console.log(_self.model)
      //   _self.model.data.songs = data.song_list;
      //   console.log(_self.model.data.songs)
      // }
      // commom.find(fn(data), (err)=>{
      //   alert('x')
      // })
      // return this.data.songs

      commom.find(
        data => {
          this.data.songs = data.song_list;
          suc(this.data.songs)
        },
        err => {
          alert("x");
          err(err)
        }
      );
      
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.model.find((data)=>{
        this.view.$el.find(".square-spin").addClass("active");
        console.log(this.model.data)
        console.log(data)
        this.view.render(this.model.data);
      },(err)=>{
        alert(err)
      })
      // .then(() => {
      //   this.view.$el.find(".square-spin").addClass("active");
      //   this.view.render(this.model.data);
      // });
    }
  };
  controller.init(view, model);
}
