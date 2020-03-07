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
      console.log(songs);
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
    find(data) {
      let url =
        "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.search.catalogSug&query=" +
        data;
      function getsongs(url) {
        return $.ajax({
          type: "GET",
          dataType: "jsonp",
          url: url
        });
      }
      return getsongs(url).then(data => {
        console.log(data.song);
        // Object.assign(this.data.songs, data.song);
        this.data.songs = data.song
        console.log(this.data.songs)
        return this.data;
      });
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
        this.model.find(content).then(data => {
          console.log("0");
          if (this.view.$el.find("ol").html()) {
            this.view.clearList();
            this.view.render(data)
          } else {
            this.view.render(data);
          }
        });
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
