{
    let view = {
        el: '.page-3',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        },
        addClass(){
            this.$el.find('.label').addClass('active')
            this.$el.find('.right>svg').addClass('active')
        },
        clearClass(){
            this.$el.find('.label').removeClass('active')
            this.$el.find('.right>svg').removeClass('active')
        }
    }
    let model = {
        data:{},
        find(){
            return $.ajax({
                url: "http://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.search.catalogSug&query="
                type: "get",
                dataType: "jsonp"
            })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('selectTab', (tabName)=>{
                if(tabName === 'page-3'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
            this.view.$el.on('keydown', 'form', ()=>{
                let value = this.view.$el.find('input').val()
                console.log(value)
                if(!value){
                    this.view.clearClass()
                }else{
                    this.view.addClass()
                }
            })
            this.view.$el.on('submit', 'form', (e)=>{
                console.log(e)
                this.model.find().then((data)=>{
                    console.log(data)
                })
            })
        }
    }
    controller.init(view, model)
}