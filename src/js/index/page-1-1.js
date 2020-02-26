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
            this.bindEvent()
        },
        bindEvent(){
            this.view.$el.on('click', 'a', (e)=>{
                console.log(e.currentTarget.innerText)
                window.eventHub.emit('getTitle', e.currentTarget.innerText)
            })
            window.eventHub.on('getTitle', (title)=>{
                console.log('title')
                console.log(title)
            })
        },
    }
    controller.init(view, model)
}