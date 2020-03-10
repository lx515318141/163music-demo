{
  let view = {
    el: "#page",
    init() {
      this.$el = $(this.el);
    },
    template: `
        <li>
            <a href="./play.html?{{song.id}}">
                <div class="number">{{song.number}}</div>
                <div class="song">
                  <div class="info">
                    <h3>{{song.title}}</h3>
                      <p>
                        {{song.author}}
                      </p>
                  </div>
                  <div class="playButton">
                      <svg class="icon icon-play1" aria-hidden="true">
                          <use xlink:href="#icon-play1"></use>
                      </svg>
                  </div>
                </div>
            </a>
        </li>
    `,
    render(data) {
      document.title = data.title
      let { songs } = data;
      songs.map(song => {
        let $li = $(
          this.template
            .replace("{{song.title}}", song.title)
            .replace("{{song.author}}", song.author)
            .replace("{{song.id}}", song.song_id)
            .replace("{{song.number}}", song.rank)
        );
        this.$el.find("#song-list>#list").append($li);
      });
      this.$el
        .find(".background")
        .css("background-image", `url(./img/${data.id}.jpg)`);
      this.$el
        .find(".summary .header_pic>img")
        .attr("src", `./img/${data.id}.jpg`);
      this.$el.find(".summary h2").html(data.title);
      this.$el.find(".label>span").html(data.label);
    }
  };
  let model = {
    data: {
      songs: []
    },
    getList(id, title) {
      let url =
        "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type=" +
        id +
        "&size=30&offset=0";
      this.data.title = title;
      function getdata(url) {
        return $.ajax({
          url: url,
          type: "GET",
          dataType: "jsonp"
        });
      }
      return getdata(url).then(data => {
        Object.assign(this.data.songs, data.song_list);
        this.data.id = data.billboard.billboard_type;
        this.data.label = data.billboard.name;
        return this.data;
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init();
      this.getId();
      let id = this.getId().id;
      let title = this.getId().title;
      this.model.getList(id, title).then(data => {
        this.view.render(data);
      });
    },
    getId() {
      let search = window.location.search;
      // 获取查询参数
      let serachArray = search.split("&");
      let info = {};
      info.id = serachArray[0].split("=")[1];
      info.title = decodeURIComponent(serachArray[1].split("=")[1]);
      // if (search.indexOf("?") === 0) {
      //   //  indexOf可返回指定字符在字符串中首次出现的位置
      //   id = search.substring(1);
      //   //  substring可输入一个或两个参数，一个参数时可提取参数位置之后的字符串，两个参数时可提取介于两个参数之间的字符串
      // }

      return info;
    }
  };
  controller.init(view, model);
}
