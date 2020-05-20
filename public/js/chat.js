const socket= io()

//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    //new message element
    const $newMessage=$messages.lastElementChild

    //height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

    //visible height
    const visableHeight=$messages.offsetHeight

    //height of messages container
    const containerHeight=  $messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset= $messages.scrollTop+visableHeight

    if(containerHeight-newMessageHeight<=scrollOffset)
    {
        $messages.scrollTop=$messages.scrollHeight
    }

}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(data)=>{
    const html=Mustache.render(locationTemplate,{
        username:data.username,
        url:data.text,
        createdAt:moment(data.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

const sendMessageForm=document.querySelector('#message-form')

sendMessageForm.addEventListener('submit',(e)=>{
e.preventDefault()

//disable
$messageFormButton.setAttribute('disabled','disabled')

const message= document.querySelector('#message').value

socket.emit('sendMessage',message,(error)=>{
   //enable button regardless of succucful send or not-successful
   $messageFormButton.removeAttribute('disabled')
   //clear previos value and focus
   $messageFormInput.value=''
   $messageFormInput.focus()

    if(error)
    {
        return console.log(error)
    }
    console.log('message delivered')
})
})

$sendLocationButton.addEventListener('click',()=>{
    if (!navigator.geolocation)
    {
        return alert('geolocation is not supported by your browser')
    }
    //disable send location BUTTON
    $sendLocationButton.setAttribute('disabled','disabled')
    
    navigator.geolocation.getCurrentPosition((position)=>{
        let {coords}=position
        let {latitude,longitude}=coords
    socket.emit('sendLocation',{latitude,longitude},()=>{
        //enable send location BUTTON
        $sendLocationButton.removeAttribute('disabled')
        console.log('the location was shared succesfully')
    })
        
    })

})

socket.emit('join',{username,room},(error)=>{
      if(error)
      {
          alert(error)
          location.href="/"
      }
})