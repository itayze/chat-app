const path=require('path')//core library
const http=require('http')//core library
const express= require('express')

const sockeio=require('socket.io')
const Filter= require('bad-words')

const app= express()
const server = http.createServer(app)
const io=sockeio(server)

const port= process.env.PORT || 3000
const publicPath=path.join(__dirname,'../public')

const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')

app.use(express.static(publicPath))


io.on('connection',(socket)=>{
    console.log('new connection')
    
  
    

    socket.on('join',({username,room},callback)=>{

        const {error,user}=addUser({id:socket.id,username,room})

        if(error)
        {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage('Wellcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
       
        callback()//everything went well
    }) 

    socket.on('sendMessage',(message,callback)=>{
        const filter= new Filter()
        if (filter.isProfane(message))
        {
            return callback('profanity is not allowed')
        }
        const user=getUser(socket.id) 
        io.to(user.room).emit('message',generateMessage(message,user.username))
        
        callback()

    })

    socket.on('sendLocation',(location,callback)=>{
        const user=getUser(socket.id)

        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,location.latitude,location.longitude))
        callback()
    })

    socket.on('disconnect',()=>{
        const user= removeUser(socket.id)

        if(user)
        {
            io.to(user.room).emit('message',generateMessage(`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
})



server.listen(port,()=>{
    console.log('server is running at port '+port)
})