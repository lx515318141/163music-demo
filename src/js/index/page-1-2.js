{
  let view = {
    el: "section.songs",
    init() {
      this.$el = $(this.el);
    },
    render(data) {
        let songs = data
        songs.map((song)=>{
            let $li = $(`
                <li>
                    <h3>${song.name}</h3>
                    <p>
                        <svg class="icon icon-sq" aria-hidden="true">
                            <use xlink:href="#icon-sq"></use>
                        </svg>
                        ${song.singer}
                    </p>
                    <a class="playButton" href="#">
                        <svg class="icon icon-bofang" aria-hidden="true">
                            <use xlink:href="#icon-bofang"></use>
                        </svg>
                    </a>
                </li>
            `)
            this.$el.find(ol.list).append($li)
        })
        
    }
  };
  let model = {
    data: {
      songs: []
    },
    find(){
      return $.ajax({
        type: 'GET',
        url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type=1&size=10&offset=0'
      })
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.model.find().then(() => {
        console.log(1)
        this.model.data.songs.push(request.responseText)
        this.view.render(this.model.data);
      });
    }
  };
  controller.init(view, model);
}
