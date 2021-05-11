import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../Infobar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

import './Chat.css'

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState(''); 
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT  = 'localhost:5000'

    // for joining users to room
    useEffect(() =>{
        const { name, room } = queryString.parse(location.search);

        socket =io(ENDPOINT);

        setName(name);
        setRoom(room);

        console.log(socket);

        socket.emit('join', {name, room}, ()=>{

        
        })

        //unmounting or disconnecting
        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }
    ,[ENDPOINT, location.search]);

    // for messages    
    useEffect(() => {
        socket.on('message', (message) =>{
            setMessages([...messages, message]) // using spread operator inorder to not mutate state 
            
        })



    },[messages]);


        



      
    // FUNCTION FOR SENDING MESSAGES  
    const sendMessage = (event) =>{
        event.preventDefault();

        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);

    return ( 
    <div className='outerContainer'>
        <div className='container'>
            <InfoBar room={room}/>
            <Messages messages={messages} name={name}/>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

        </div>
    </div>
        )
}

 export default Chat;