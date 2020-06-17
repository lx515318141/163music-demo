{
  let view = {
    el: "#play",
    init() {
      this.$el = $(this.el);
    },
    render(data) {
      document.title = data.song.songinfo.title;
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
        // 歌曲播放完后触发ended事件，但此事件不冒泡，只能通过发布订阅来控制转盘停转
        audio.onended = () => {
          window.eventHub.emit("songEnd");
        };
        audio.ontimeupdate = () => {
          if (data.song.lyrics.errno === "22001") {
            this.scrollLyric(audio.currentTime);
          }
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
    },
    pushLyric(data) {
      // 创建p标签
      let p = document.createElement("p");
      // 判断是否获取到歌词了
      if (data) {
        let { lrcContent } = data;
        // 将歌词按行分成数组，然后遍历
        lrcContent.split("\n").map((string) => {
          // 声明一个正则表达式
          let regex = /\[([\d:.]+)\](.+)/;
          // 将lrcContent里的string用正则表达式进行分组，若不符合正则表达式则不会进行分组
          // 将string的内容放在matches的第一项，[]里的放在第二项，[]外的放在第三项
          let matches = string.match(regex);
          if (matches) {
            // 将歌词放在p标签里面
            p.textContent = matches[2];
            // 将时间按冒号分割
            let parts = matches[1].split(":");
            // 将时间换算成秒
            let time = parseInt(parts[0], 10) * 60 + parseFloat(parts[1], 10);
            // 将时间放到p标签的data-time属性中
            p.setAttribute("data-time", time);
          }
        });
      }else{
        p.textContent = '暂无歌词'
      }
      // 将p标签插入到lines元素内
      this.$el.find(".lyric>.lines").append(p);
    },
    scrollLyric(time) {
      let allP = this.$el.find(".lyric>.lines>p");
      let p;
      if (allP.length !== 0) {
        for (let i = 0; i < allP.length; i++) {
          if (i === allP.length - 1) {
            p = allP[i];
            break;
          } else {
            let currentTime = allP.eq(i).attr("data-time");
            // jQuery的eq（）方法，eq选择器选取带有指定 index 值的元素,index值从0开始，
            let nextTime = allP.eq(i + 1).attr("data-time");
            if (currentTime <= time && time < nextTime) {
              p = allP[i];
              break;
            }
          }
        }
        let pHeight = p.getBoundingClientRect().top;
        let linesHeight = this.$el
          .find(".lyric>.lines")[0]
          .getBoundingClientRect().top;
        let height = pHeight - linesHeight;
        this.$el.find(".lyric>.lines").css({
          transform: `translateY(${-(height - 25)}px)`,
        });
        $(p).addClass("active").siblings(".active").removeClass("active");
      }
    },
    play() {
      this.$el.find("audio")[0].play();
    },
    pause() {
      this.$el.find("audio")[0].pause();
    },
  };
  let model = {
    data: {
      song: {},
      status: "playing",
    },
    get(suc, err, id) {
      commom.find(
        (data) => {
          Object.assign(this.data.song, data);
          suc(this.data);
        },
        (errInfor) => {
          alert("获取歌曲失败");
          err(errInfor);
        },
        id,
        "",
        "play"
      );
    },
    getSongLrc(suc, err, id) {
      commom.find(
        (data) => {
          this.data.song.lyrics = data;
          suc(data);
        },
        (errInfor) => {
          alert("未获取到歌词");
          err(errInfor);
        },
        id,
        "",
        "lcy"
      );
    },
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init();
      let id = this.getId();
      this.model.get(
        (data) => {
          this.view.render(data);
          this.view.play();
        },
        (err) => {
          alert(err);
        },
        id
      );
      this.model.getSongLrc(
        (data) => {
          this.view.pushLyric(data);
        },
        (err) => {
          this.view.pushLyric();
        },
        id
      );
      this.bindEvents();
    },
    bindEvents() {
      this.view.$el.on("click", ".disc-container", () => {
        if (this.model.data.status === "paused") {
          this.model.data.status = "playing";
          this.view.render(this.model.data);
        } else {
          this.model.data.status = "paused";
          this.view.render(this.model.data);
        }
      });
      window.eventHub.on("songEnd", () => {
        this.model.data.status = "paused";
        this.view.render(this.model.data);
      });
    },
    getId() {
      let search = window.location.search;
      // 获取查询参数
      let id = "";
      // indexOf可返回某个指定的字符串值在字符串中首次出现的位置
      if (search.indexOf("?") === 0) {
        // sunstring提取字符串中介于两个指定下标之间的字符，一个参数时提取参数位置之后的字符
        id = search.substring(1);
      }
      return id;
    },
  };
  controller.init(view, model);
}
