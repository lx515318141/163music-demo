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
      document.title = data.title;
      let { songs } = data;
      songs.map((song) => {
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
    },
  };
  let model = {
    data: {
      songs: [],
    },
    getList(suc, err, id) {
      commom.find(
        (data) => {
          Object.assign(this.data.songs, data.song_list);
          this.data.label = data.billboard.name;
          suc(this.data);
        },
        (errInfor) => {
          alert("获取歌单失败");
          err(errInfor);
        },
        id,
        "30"
      );
    },
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.init();
      this.getId();
      let id = this.getId().id;
      this.model.data.id = id
      let title = this.getId().title;
      this.model.data.title = title;
      this.model.getList(
        (data) => {
          this.view.render(data);
        },
        (err) => {
          allert(err);
        },
        id,
      );
    },
    getId() {
      let search = window.location.search;
      // 获取查询参数
      let serachArray = search.split("&");
      let info = {};
      info.id = serachArray[0].split("=")[1];
      info.title = decodeURIComponent(serachArray[1].split("=")[1]);

      return info;
    },
  };
  controller.init(view, model);
}
