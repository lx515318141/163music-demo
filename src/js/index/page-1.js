{
    let view = {
        el: '.page-1',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.bindEventHub()
            this.loadModule1()
            this.loadModule2()
        },
        bindEventHub(){
            window.eventHub.on('selectTab', (tabName)=>{
                if(tabName === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        loadModule1(){
            let script1 = document.createElement('script')
            script1.src = './js/index/page-1-1.js'   
            //这里的路径因为是添加到HTML里，所有要以HTML所在位置为准
            script1.onload = function(){
                console.log('模块1加载成功')
            }
            document.body.appendChild(script1)
        },
        // 模块1和模块2加载完成的顺序是不一定的，在网络出现波动的情况下模块2可能会比模块1先加载完成
        loadModule2(){
            let script2 = document.createElement('script')
            script2.src = './js/index/page-1-2.js'
            script2.onload = function(){
                console.log('模块2加载成功')
            }
            document.body.appendChild(script2)
        }
    }
    controller.init(view, model)
}