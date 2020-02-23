{
  let view = {
    el: "#play",
    init() {
      this.$el = $(this.el);
    },
    
    render(data) {
      console.log(data.songinfo.pic_huge);
      $(this.el).find('.background').css('background-image', `url(${data.songinfo.pic_huge})`)
      this.$el.find('img.cover').attr('src', data.songinfo.pic_huge)
      this.$el.find('audio').attr('src',data.bitrate.file_link);
    },
    play(){
        let audio = this.$el.find('audio')[0]
        console.log(1)
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
        "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.song.play&songid="
         + id;
      function getData(url) {
        return $.ajax({
          type: "GET",
          dataType: "jsonp",
          url: url
        });
      }
      return getData(url).then(data => {
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
        console.log(data)
        this.view.render(data);
        // this.view.play()
      });
      // this.bindEvents()
    },
    bindEvents(){
        this.view.$el.on('click', '.disc-container', ()=>{
            this.view.play()
        })
        this.view.$el.on('click', '.disc-container', ()=>{
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
