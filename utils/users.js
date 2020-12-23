//not database, but using memory here

const users = [];



//join user to chat
function userJoin(id,username,room){
    const user = {id,username,room};  //user object with attributes as id, username, room

    users.push(user); //adding this user object to the array

    return user; //again returning that user

}

//get current user
function getCurrentUser(id){ 
    return users.find(user => user.id===id); //find is high level method that uses arrow function
}

//user leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id ===id);

    //if we found that user
    if(index!== -1) //return -1 if it does not finds it in array
    return users.splice(index,1)[0] //this says at index = index remove 1 element and rest remains same
    //splice method changes the array // splice(index,0,shi,deh) specifies that at index = index remove 0 element and add shi and deh
    //splice method returns the removed item and therefore we used [0]
}

//get room users 
function getRoomUsers (room){
    return users.filter(user => user.room ===room);
// filter method returns true or false. also this method returns an array that only return true 
}

module.exports ={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}