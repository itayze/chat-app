const generateMessage=(text,username='Admin')=>{

    return {
        text,
        username,
        createdAt:new Date().getTime()
    }
}

const generateLocationMessage=(username,latitude,longitude)=>{

    return {
        username,
        text:`https://google.com/maps?q=${latitude},${longitude}`,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMessage,
    generateLocationMessage
}