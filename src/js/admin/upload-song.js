{
    let view = {
        el: '.uploadArea',
        template: ``,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            $(this.view.el).on('click',this.active.bind(this))
        },
        active(){
            window.eventHub.emit('newSong')
            
        }
    }
    controller.init(view, model)
}