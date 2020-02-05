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
                <input name="singer" type="text" value="__singer__">
            </div>
            <div class="row">
                <label>
                    外链
                </label>
                <input name="url" type="text" value="__url__">
            </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
    render(data = {}) {
      let placeholders = ['name', 'singer', 'url']
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
    },
    reset(){
        this.render({})
    }
  };
  let model = {
    data: {
    },
    create(data){
      return $.ajax({
        type: 'POST',
        url: 'http://localhost:8888/uptoken',
        data: data,
        heads: {'content-type' : 'application/x-www-form-urlencoded'}
      })
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
      window.eventHub.on('select', (data)=>{
        this.model.data = data
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      this.view.$el.on("submit", 'form', e => {
        e.preventDefault();   //不执行默认操作
        let needs = "name singer url".split(" ");      
        //split会将字符串分割成数组，第一个参数用了指定以什么作为间隔，“”中为空格，就是以空格为间隔，返回一个有name，singer，url的数组
        let data = {};     //声明一个空的data，这个data需要name，singer，url这三个值
        needs.map(string => {
          data[string] = this.view.$el.find(`[name="${string}"]`).val();
          //遍历needs，得到字符串，找到el里面name的值和字符串一致的value，即输入框中输入的内容，将其放到data里面
        });
        this.model.data = data     
        this.model.create(data).then(()=>{
            this.view.reset()
            window.eventHub.emit('create', JSON.parse(JSON.stringify(this.model.data)))
        });
      });
    }
  };
  controller.init(view, model);
}
