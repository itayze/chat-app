const users=[]

//addUser, removeUser, getUser, getUsersInRoom

const addUser=({id,username,room})=>{

    //clean the data
    username= username.trim().toLowerCase()
    room= room.trim().toLowerCase()

    //validate the data
    if(!username || !room)
    {
        return {
            error:'username and room are required'
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
        return user.username===username && user.room===room
    })

    if(existingUser)
    {
        return {
            error:'username is in use'
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
    return {user}

}

const removeUser=(id)=>{
    
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    if(index!=-1)//that means we found at least one match- 0 for 1 match and 1 for more than 1
    {
       return users.splice(index,1)[0] //deletes element at index
    }


}



const getUser=(id)=>{
    const user=users.find((user)=>{
        return user.id===id
    })
    return user

}

const getUsersInRoom=(room)=>{

    const usersInRoom=[]
    users.forEach((user)=>{
        if(user.room===room)
        {
            usersInRoom.push(user)
        }
    })
    return usersInRoom
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

