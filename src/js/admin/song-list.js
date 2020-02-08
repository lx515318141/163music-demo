{
    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList">
        
        </ul>
        `,
        render(data){
        let $el = $(this.el)            
        $el.html(this.template)
        let {songs} = data
        // 声明一个对象将data传给它
        let liList = songs.map((song)=>$('<li></li>').text(song.name))
        // 遍历songs找到里面的song，把每一个song变成li，将song中的name中的value作为li中的内容
        $el.find('ul').empty()
        // 将ul清空
        liList.map((domLi)=>{
            $el.find('ul').append(domLi)
            // 遍历liList，找到里面的domli将domli放到ul里面
        })
        },
        activeItem(li){
            let $li = $(li)
                $li.addClass('active').siblings('.active').removeClass('active')
        },
        clearActive(){
            $(this.el).find('.active').removeactive('.active')     //找到el中带有active的元素，将其active去掉
        }
    }
    let model = {
        data: {
            songs: [  ]
        },
        find(){
            return $.ajax({
                type: 'GET',
                url: 'http://localhost:8888/load'
            })
            // return query.find().then((songs)=>{
            //     this.data.songs = songs.map((song)=>{
            //         return {id: song.id, ...song.attributes}
            //     })
            //     return songs
            // })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
        getAllSongs(){
            this.model.find().then(()=>{
                console.log(1)
                console.log(request.responseText)
                this.model.data.songs.push(request.responseText)
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click', 'li', (e)=>{
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                let data
                let songs = this.model.data.songs
                for(let i=0; i<songs.lenght; i++){
                    if(song[i] === songId){
                        data = song[i]
                        break
                    }
                }
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
            })
            
        },
        bindEventHub(){
            window.eventHub.on('upload', ()=>{
                this.view.clearActive()          //如果发现有上事件发布，就调用clearActive函数
            })
            window.eventHub.on('create', (songData)=>{
                this.model.data.songs.push(songData)
                // 将song-form中提交的数据放到model的data的songs里面
                this.view.render(this.model.data)
                // 调用render
            })
        }
        
    }
    controller.init(view, model);
}