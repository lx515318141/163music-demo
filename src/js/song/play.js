{
  let view = {
    el: "#play",
    init() {
      this.$el = $(this.el);
    },
    render(data) {
      this.$el
        .find(".background")
        .css("background-image", `url(${data.song.songinfo.pic_huge})`);
      this.$el.find("img.cover").attr("src", data.song.songinfo.pic_huge);
      if (this.$el.find("audio").attr("src") !== data.song.bitrate.file_link) {
        let audio = this.$el
          .find("audio")
          .attr("src", data.song.bitrate.file_link)
          .get(0);
        audio.onended = () => {
          window.eventHub.emit("songEnd");
        };
      }
      if (data.status === "playing") {
        this.$el.find(".disc-container").addClass("playing");
        this.play();
      } else {
        this.$el.find(".disc-container").removeClass("playing");
        this.pause();
      }
      this.$el
        .find(".song-description>h1>.song_name")
        .text(data.song.songinfo.title);
      this.$el.find(".song-description>h1>b").text(data.song.songinfo.author);
      let {lrcContent} = data.song.lyrics
      console.log(lrcContent)
      lrcContent.split('\n').map((string) => {
        let p = document.createElement('p')
        let regex = /\[([\d:.]+)\](.+)/
        // 声明一个正则表达式
        let matches = string.match(regex)
        // 将lrcContent里的string用正则表达式进行分组，若不符合正则表达式则不会进行分组
        // 将string的内容放在matches的第一项，[]里的放在第二项，[]外的放在第三项
        if(matches){
          p.textContent = matches[2]
          p.setAttribute('data-time', matches[1])
        }
        this.$el.find('.lyric>.lines').append(p)
      })
    },
    play() {
      this.$el.find("audio")[0].play();
    },
    pause() {
      this.$el.find("audio")[0].pause();
    }
  };
  let model = {
    data: {
      song: {},
      status: "playing"
    },
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
        Object.assign(this.data.song, data);
        return this.data;
      });
    },
    getSongLrc(id) {
      let url =
        "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.song.lry&songid=" +
        id;
      function getLrc(url) {
        return $.ajax({
          type: "GET",
          dataType: "jsonp",
          url: url
        });
      }
      return getLrc(url).then((data) => {
        this.data.song.lyrics = data
        return this.data
      })
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init();
      let id = this.getId();
      this.model.get(id).then(data => {
        this.view.render(data);
        this.view.play();
      });
      this.model.getSongLrc(id).then(data => {
        this.view.render(data);
      })
      this.bindEvents();
    },
    bindEvents() {
      this.view.$el.on("click", ".disc-container", () => {
        if (this.model.data.status === "paused") {
          this.model.data.status = "playing";
          this.view.render(this.model.data);
          console.log(this.model.data.status);
        } else {
          this.model.data.status = "paused";
          this.view.render(this.model.data);
          console.log(this.model.data.status);
        }
      });
      window.eventHub.on("songEnd", () => {
        this.model.data.status = "paused";
        this.view.render(this.model.data);
        console.log(this.model.data.status);
      });
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
