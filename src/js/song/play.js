{
  let view = {
    el: "#app",
    init() {
      this.$el = $(this.el);
    },
    template: `
    <audio controls src={{url}}></audio>
    <div>
        <button class="play">播放</button>
        <button class="pause">暂停</button>
    </div>
    `,
    render(data) {
      console.log(data.file_link);
      this.$el.html(this.template.replace("{{url}}", data.file_link));
    },
    play(){
        let audio = this.$el.find('audio')[0]
        audio.play()
    },
    pause(){
        let audio = this.$el.find('audio')[0]
        audio.pause()
    }
  };
  let model = {
    data: {},
    get(id) {
      let url =
        "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.song.play&songid=" +
        id;
      function getData(url) {
        return $.ajax({
          type: "GET",
          dataType: "jsonp",
          url: url
        });
      }
      return getData(url).then(data => {
        // this.data.name = data.songinfo.title;
        // this.data.singer = data.songinfo.author;
        // this.data.id = data.songinfo.song_id;
        // this.data.url = data.bitrate.file_link;
        Object.assign(this.data, data);
        return this.data;
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init();
      let id = this.getId();
      this.model.get(id).then(data => {
        this.view.render(data.bitrate);
      });
      this.bindEvents()
    },
    bindEvents(){
        this.view.$el.on('click', '.play', ()=>{
            this.view.play()
        })
        this.view.$el.on('click', '.pause', ()=>{
            this.view.pause()
        })
    },
    getId() {
      let search = window.location.search;
      console.log(search);
      // 获取查询参数
      let id = "";
      if (search.indexOf("?") === 0) {
        // indexOf可返回某个指定的字符串值在字符串中首次出现的位置
        id = search.substring(1);
        // sunstring提取字符串中介于两个指定下标之间的字符，一个参数时提取参数位置之后的字符
      }

      return id;
    }
  };
  controller.init(view, model);
}
