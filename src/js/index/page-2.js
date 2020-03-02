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
      songs.map(song => {
        let $li = $(
          this.tempalte
            .replace("{{song.title}}", song.title)
            .replace("{{song.id}}", song.song_id)
            .replace("{{song.author}}", song.author)
            .replace("{{song.number}}", song.rank)
        );
        this.$el.find('.hotList>ol').append($li)
      });
    },
    show() {
      this.$el.addClass("active");
    },
    hide() {
      this.$el.removeClass("active");
    }
  };
  let model = {
    data: {
      songs: []
    },
    find() {
      function getHotSong() {
        return $.ajax({
          url:
            "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type=2&size=20&offset=0",
          type: "get",
          dataType: "jsonp"
        });
      }
      return getHotSong().then(data => {
        console.log(data);
        Object.assign(this.data.songs, data.song_list);
        this.data.update = data.billboard.update_date;
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
        if (tabName === "page-2") {
          this.model.find().then(data => {
            this.view.$el.find(".square-spin").addClass('active')
            this.view.render(data);
          });
          this.view.show();
        } else {
          this.view.hide();
        }
      });
    }
  };
  controller.init(view, model);
}
