//front end java scipt //client side
//use get element by id when we have an id in html 
const chatForm = document.getElementById('chat-form'); //gets us the area from the chat.html 
//use quer selector when we want to deal with div class
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get username and room from url
//location.search gives us the whole query string i.e. '?foo=bar'
//qs.parse(location.search) gives us object i.e. {foo:'bar}
const {username,room} = Qs.parse(location.search,{
    // bcoz we don't want ? and & characters
    ignoreQueryPrefix:true
})

const socket = io();

//join chatroom //we got this from the query string 
socket.emit('joinRoom', {username,room}); //now send this to server side

//get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);

});

//message from the server
socket.on('message',message=>{  //message in 2nd argument is the actual msg i.e. welcome... , joined chat.. , left the chat
    console.log(message);
    outputMessage(message);

    //scroll dowm automatically to the most recent msg
    chatMessages.scrollTop = chatMessages.scrollHeight
});

//message submit

chatForm.addEventListener('submit',e=>{
    e.preventDefault(); //when you submit a form it automatically submits to a file and we want to stop that from happening
    
    //get msg text
    let msg = e.target.elements.msg.value; //in chat.html we have id: msg therefore msg.value
    
    //emit msg to server
    //console.log(msg); would have worked here but with console we can only show the msg in console of the browser but with socket.emit('chatMessage,msg) we can send it to console of browser as well as to the server to handle
    socket.emit('chatMessage',msg);  // this is sending from client to server since it is websockets this is possible
    

    //clear input so that new msgs can be written there
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus(); //sets focuses on specified element
});

//output msg to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text} 
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}; 
//${message.text}  bcoz now message is an object

//add room name to DOM 
function outputRoomName(room){
    roomName.innerText = room;
}



//add users to DOM
function outputUsers(users) { // join method converts array into string
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')} 
    `;

    
}

