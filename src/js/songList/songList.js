{
  let view = {
    el: "#page",
    init() {
      this.$el = $(this.el);
    },
    template: `
        <li>
            <a href="./song.html?{{song.id}}">
                <div class="number">{{song.number}}</div>
                <div class="song">
                  <h3>{{song.name}}</h3>
                  <p>
                      {{song.singer}}
                  </p>
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
      let { songs } = data;
      console.log(data);
      songs.map(song => {
        let $li = $(
          this.template
            .replace("{{song.name}}", song.title)
            .replace("{{song.singer}}", song.author)
            .replace("{{song.id}}", song.song_id)
            .replace("{{song.number}}", song.rank)
        );
        console.log("1");
        this.$el.find("#song-list>#list").append($li);
      });
      this.$el
        .find(".background")
        .css("background-image", `url(./img/${data.id}.jpg)`);
      this.$el
        .find(".summary>.header>.header_pic>img")
        .attr("src", `./img/${data.id}.jpg`);
      this.$el
        .find(".summary>.header>.header_content>.title>h2")
        .html(data.title);
    }
  };
  let model = {
    data: {
      songs: []
    },
    getList(id) {
      let url =
        "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type=" +
        id +
        "&size=30&offset=0";
      function getdata(url) {
        return $.ajax({
          url: url,
          type: "GET",
          dataType: "jsonp"
        });
      }
      return getdata(url).then(data => {
        console.log(data);
        Object.assign(this.data.songs, data.song_list);
        this.data.id = data.billboard.billboard_type;
        this.data.title = data.billboard.name;
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
      let id = this.getId();
      this.model.getList(id).then(data => {
        this.view.render(data);
      });
    },
    getId() {
      let search = window.location.search;
      console.log(search);
      // 获取查询参数
      let id = "";
      if (search.indexOf("?") === 0) {
        //  indexOf可返回指定字符在字符串中首次出现的位置
        id = search.substring(1);
        //  substring可输入一个或两个参数，一个参数时可提取参数位置之后的字符串，两个参数时可提取介于两个参数之间的字符串
      }

      return id;
    }
  };
  controller.init(view, model);
}
