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
        let liList = songs.map((song)=>$('<li></li>').text(song.name).attr('data-song-id',song.id))
        // 遍历songs找到里面的song，把每一个song变成li，将song中的name中的value作为li中的内容,并给每个li加上歌曲的ID
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
            $(this.el).find('.active').removeClass('active')     //找到el中带有active的元素，将其active去掉
        }
    }
    let model = {
        data: {
            songs: [  ]
        },
        find(){
            return $.ajax({
                url: 'http://localhost:8888/load',
                type: 'get',
            })
        },
        change(data){
            return $.ajax({
                url: 'http://localhost:8888/change',
                type: 'POST',
                data: data,
                heads: { "content-type": "application/x-www-form-urlencoded" }
            })
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
            this.model.find().then((data)=>{
                this.model.data.songs = JSON.parse(data)
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click', 'li', (e)=>{
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-song-id')
                let data
                let songs = this.model.data.songs
                for(let i=0; i<songs.length; i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
            })
            
        },
        bindEventHub(){
            window.eventHub.on('newSong',()=>{
                this.view.clearActive()          //如果发现有上事件发布，就调用clearActive函数
            })
            window.eventHub.on('create', (songData)=>{
                this.model.data.songs.push(songData)
                // 将song-form中提交的数据放到model的data的songs里面
                this.view.render(this.model.data)
                // 调用render
            })
            window.eventHub.on('modify',(changeData)=>{
                let songs = this.model.data.songs
                console.log(songs)
                for(let i=0; i<songs.length; i++){
                    if(songs[i].id === changeData.id){
                        songs[i] = changeData
                        break
                    }
                } 
                this.model.data.songs = songs
                console.log(songs)
                this.view.render(this.model.data)
                this.model.change(changeData).then(()=>{
                    alert('修改成功')
                })
            })
        }
        
    }
    controller.init(view, model);
}