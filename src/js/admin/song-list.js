{
    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>8</li>
        </ul>
        `,
        render(data){
        let $el = $(this.el)            
        $el.html(this.template)
        let {songs} = data
        let liList = songs.map((song)=>{$('<li></li>').text(song.name).attr('data-song-id', song.id)})
        $el.find('ul')
        liList.map((domLi)=>{
            $el.find('ul').append(domLi)
        })
        },
        activeItem(li){
            let $li = $(li)
                $li.addClass('active').siblings('.active').removeClass('active')
        },
        clearActive(){
            $(this.el).find('.active').removeactive('.active')
        }
    }
    let model = {
        data: {
            songs: [  ]
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id: song.id, ...song.attributes}
                })
                return songs
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
            this.model.find().then(()=>{
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
                this.view.clearActive()
            })
            window.eventHub.on('create', (songData)=>{
                this.model.data.song.push(songData)
                this.view.render(this.model.data)
            })
        }
        
    }
    controller.init(view, model)
}