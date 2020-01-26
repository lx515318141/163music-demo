window.eventHub = {
    events: {} , //hash
    emit(eventName, data){    //发布
        for(let key in this.events){
            if(key === eventName){ 
                let fnList = this.events[key]
                fnList.map((fn) => {
                    fn.call(undefined, data)
                })
                // 遍历events如果有events的key等于eventname，就把events的value里的函数都赋给fnList
                // 遍历fnList，并把里面的函数都执行一遍
            }
        }
    },
    on(eventName, fn){          //订阅
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
            // 如果不存在这个eventName，那么就初始化这个数组
        }
        this.events[eventName].push(fn)
        // 然后把函数放到eventName这个组的value里面
    },
}