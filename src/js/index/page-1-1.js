{
    let view = {
        el: 'section.playList',
        init(){
            this.$el = $(this.el)
        },
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            // this.bindEvent()
        },
        bindEvent(){
            // this.view.$el.on('click', 'a', (e)=>{
            //     window.eventHub.emit('getTitle', e.currentTarget.innerText)
            // })
            // window.eventHub.on('getTitle', (title)=>{
            // })
        },
    }
    controller.init(view, model)
}