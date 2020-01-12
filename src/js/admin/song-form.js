{
  let view = {
    el: ".page > main",
    init() {
      this.$el = $(this.el);
    },
    template: `

        <h1>歌曲信息</h1>
        <form class="form">
            <div class="row">
                <label>
                    歌名
                </label>
                <input name="name" type="text" value="__name__">
            </div>
            <div class="row">
                <label>
                    歌手
                </label>
                <input name="singer" type="text">
            </div>
            <div class="row">
                <label>
                    外链
                </label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row actions">
                <button type="submit">提交</button>
            </div>
        </form>
        `,
    render(data = {}) {
      // 上面括号里的是es6新语法，如果用户没有传data或传的data是undefined，则默认执行data等于一个空对象
      let placeholders = ["name", "singer", "url", "id"];
      let html = this.template;
      placeholders.map(string => {
        html = html.replace(`__${string}__`, data[string] || "");
      });
      $(this.el).html(html);
    },
    reset(){
        this.render({})
    }
  };
  let model = {
    data: {
      name: "",
      singer: "",
      url: "",
      id: ""
    },
    create(data) {
      var Song = AV.Object.extend("Song");
      var song = new Song();
      song.set("name", data.name);
      song.set("singer", data.singer);
      song.set("url", data.url);
      return song.save().then(
        (newSong)=>{
          let {id, attributes} = newSong
          Object.assign(this.data, {        //assign会把右边的对象的属性赋给左边对象的属性
              id,
              ...attributes,    //等价于后面三句，表示把attribute里面的所有属性拷贝过来
            //   上面两个等于下面四行,
            // id: id   因为key和value相同，所有可以只写一个id，es6新语法
            // name: attributes.name    
            // singer: attributes.singer
            // url: attributes.url
          })
        },
        (error)=>{
          console.log(error)
        }
      );
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.view.init();
      this.model = model;
      this.view.render(this.model.data);
      this.bindEvents();
      window.eventHub.on("upload", data => {
        this.model.data = data;
        this.view.render(this.model.data)
      });
    },
    bindEvents() {
      this.view.$el.on(".submit", 'form', e => {
        e.preventDefault();
        let needs = "name singer url".split(" ");
        let data = {};
        needs.map(string => {
          data[string] = this.view.$el.find(`[name="${string}"]`).val();
        });
        this.model.create(data).then(()=>{
            this.view.reset()
            let string = JSON.stringify(this.model.data)
            let object = JSON.parse(string)
            window.eventHub.emit('create', object)
        });
      });
    }
  };
  controller.init(view, model);
}
