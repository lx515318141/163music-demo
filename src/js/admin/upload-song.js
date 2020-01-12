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
            
        }
    }
    controller.init(view, model)
}