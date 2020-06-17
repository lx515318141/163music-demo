{
  let view = {
    el: ".page-2",
    init() {
      this.$el = $(this.el);
    },
    tempalte: `
    <li>
    <a href="./play.html?{{song.id}}">
        <div class="number">{{song.number}}</div>
        <div class="song">
          <div class="info">
            <h3>{{song.title}}</h3>
            <p>
              <svg class="icon icon-sq1" aria-hidden="true">
                <use xlink:href="#icon-sq"></use>
              </svg>
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
      let { songs } = data;
      this.$el.find(".hot_header>.header_wrapper>.update>p").html(data.update);
      songs.map((song) => {
        let $li = $(
          this.tempalte
            .replace("{{song.title}}", song.title)
            .replace("{{song.id}}", song.song_id)
            .replace("{{song.author}}", song.author)
            .replace("{{song.number}}", song.rank)
        );
        this.$el.find(".hotList>ol").append($li);
      });
    },
    show() {
      this.$el.addClass("active");
    },
    hide() {
      this.$el.removeClass("active");
    },
  };
  let model = {
    data: {
      songs: [],
    },
    find(suc, err) {
      commom.find(
        (data) => {
          Object.assign(this.data.songs, data.song_list);
          this.data.update = data.billboard.update_date;
          suc(this.data);
        },
        (errInfor) => {
          alert("获取歌单失败");
          err(ererrInforr);
        },
        "2",
        "20"
      );
    },
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.bindEventHub();
    },

    bindEventHub() {
      window.eventHub.on("selectTab", (tabName) => {
        if (tabName === "page-2") {
          this.model.find(
            (data) => {
              this.view.$el.find(".square-spin").addClass("active");
              this.view.render(data);
            },
            (err) => {
              alert(err);
            }
          );
          this.view.show();
        } else {
          this.view.hide();
        }
      });
    },
  };
  controller.init(view, model);
}
