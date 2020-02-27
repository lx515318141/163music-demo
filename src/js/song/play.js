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
        // 防止每次暂停都重新渲染audio的src，会导致歌曲从头开始播放，所有先进行判断src中是否有该歌曲的播放链接，没有时才进行渲染
        let audio = this.$el
          .find("audio")
          .attr("src", data.song.bitrate.file_link)
          .get(0);
        audio.onended = () => {
          // 歌曲播放完后触发ended事件，但此事件不冒泡，只能通过发布订阅来控制转盘停转
          window.eventHub.emit("songEnd");
        };
        audio.ontimeupdate = () => {
          this.showLyric(audio.currentTime);
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
      let { lrcContent } = data.song.lyrics;
      console.log(lrcContent)
      lrcContent.split("\n").map(string => {
        let p = document.createElement("p");
        let regex = /\[([\d:.]+)\](.+)/;
        // 声明一个正则表达式
        let matches = string.match(regex);
        // 将lrcContent里的string用正则表达式进行分组，若不符合正则表达式则不会进行分组
        // 将string的内容放在matches的第一项，[]里的放在第二项，[]外的放在第三项
        if (matches) {
          p.textContent = matches[2];
          let parts = matches[1].split(":");
          let time = parseInt(parts[0], 10) * 60 + parseFloat(parts[1], 10);
          p.setAttribute("data-time", time);
          // console.log('歌词')
          // console.log(typeof this.$el.find(".lyric>.lines").html())
          // console.log(this.$el.find(".lyric>.lines").html())
          if(this.$el.find(".lyric>.lines").html()){
            console.log('1')
          }else{
            this.$el.find(".lyric>.lines").append(p);
          }
          // this.$el.find(".lyric>.lines").append(p);
        }
      });
    },
    showLyric(time) {
      let allP = this.$el.find(".lyric>.lines>p");
      let p
      for (let i = 0; i < allP.length; i++) {
        if(i === allP.length-1){
          p = allP[i]
          break
        }else{
          let currentTime = allP.eq(i).attr("data-time");
          // jQuery的eq（）方法，eq选择器选取带有指定 index 值的元素,index值从0开始，
          let nextTime = allP.eq(i + 1).attr("data-time");
          if (currentTime <= time && time < nextTime) {
            p = allP[i]
            break
          }  
        }
        }
        let pHeight = p.getBoundingClientRect().top
        let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
        let height = pHeight - linesHeight
        this.$el.find('.lyric>.lines').css({
          transform: `translateY(${-(height - 25)}px)`
        })
        $(p).addClass('active').siblings('.active').removeClass('active')
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
      return getLrc(url).then(data => {
        this.data.song.lyrics = data;
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
        this.view.render(data);
        this.view.play();
      });
      this.model.getSongLrc(id).then(data => {
        this.view.render(data);
      });
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
