{
  let view = {
    el: ".page-3",
    init() {
      this.$el = $(this.el);
    },
    template: `
        <li>
          <a href="./play.html?{{song.id}}">
            <div class="song">
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
            </div>
          </a>
        </li>
    `,
    render(data) {
      let { songs } = data;
      songs.map(song => {
        let $li = $(
          this.template
            .replace("{{song.id}}", song.songid)
            .replace("{{song.title}}", song.songname)
            .replace("{{song.author}}", song.artistname)
        );
        this.$el.find("ol").append($li);
      });
    },
    show() {
      this.$el.addClass("active");
    },
    hide() {
      this.$el.removeClass("active");
    },
    addClass() {
      this.$el.find(".right>svg").addClass("active");
    },
    clearClass() {
      this.$el.find(".right>svg").removeClass("active");
    },
    clearContent() {
      this.$el.find("input").val("");
    },
    clearList() {
      this.$el.find("li").remove();
    }
  };
  let model = {
    data: {
      songs: []
    },
    find(suc, err, id) {
      commom.find(
        (data) => {
          this.data.songs = data.song
          suc(this.data)
        },
        (errInfor) => {
          alert('获取歌曲失败')
          err(errInfor)
        },
        id
      )
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.bindEventHub();
    },
    bindEventHub() {
      window.eventHub.on("selectTab", tabName => {
        if (tabName === "page-3") {
          this.view.show();
        } else {
          this.view.hide();
        }
      });
      this.view.$el.on("keydown", "form", () => {
        let value = this.view.$el.find("input").val();
        if (!value) {
          this.view.clearClass();
        } else {
          this.view.addClass();
        }
      });
      this.view.$el.on("submit", "form", e => {
        let content = this.view.$el.find("input").val();
        this.model.find(
          data => {
            if (this.view.$el.find("ol").html()) {
              this.view.clearList();
              this.view.render(data)
            } else {
              this.view.render(data);
            }
          },
          (err) => {
            alert(err)
          },
          content
          );
      });
      this.view.$el.on("click", "div.right", e => {
        this.view.clearContent();
        this.view.clearClass();
        this.view.clearList();
      });
    }
  };
  controller.init(view, model);
}
