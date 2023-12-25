'use client';
import React, { useState, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
export default function MessageUser() {
    const [image, setImage] = useState(null);
    const [showIcon, setShowIcon] = useState('block');
    const [showImage, setShowImage] = useState('hidden');
    const [username, setUsername] = useState('');
    const [animate, setAnimate] = useState('');
    const [showblock, setShowblock] = useState('block');
    const [message, setMessage] = useState('');
    const [showboxmessage, setShowboxmessage] = useState('hidden');
    const socketRef = useRef(null);
    useEffect(() => {
        socketRef.current = io('https://primo-server.onrender.com/', { transports: ['websocket'] });
        const localStorageData = localStorage.getItem('user');
        if (localStorageData != null) {
            const data = JSON.parse(localStorageData);
            setUsername(data.Username);
            setImage(data.Image);
            if (data.Image) {
                setShowIcon('hidden');
                setShowImage('block');
                setAnimate('animate-zoomOut');
                setTimeout(() => {
                    setShowblock('hidden');
                }, 400);
                setTimeout(() => {
                    setShowboxmessage('block');
                }, 500);
            }
        }
        socketRef.current.on('connect', () => {
            console.log(`ID: ${socketRef.current.id}`);
        });
        socketRef.current.on('your id', (id) => {
            console.log(id);
        });
        return () => {
            socketRef.current.off('connect');
            socketRef.current.disconnect();
        };
    }, []);

    const handleImageChange = (e) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = (e) => {
            setImage(e.target.result);
            setShowIcon('hidden');
            setShowImage('block');
        };
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSend = () => {
        if (!username) {
            alert('Please Enter Username');
            return;
        } else if (!image) {
            alert('Please Select Image');
            return;
        } else {
            const data = {
                Username: username,
                Image: image,
            };
            setAnimate('animate-zoomOut');
            setTimeout(() => {
                setShowblock('hidden');
            }, 400);
            localStorage.setItem('user', JSON.stringify(data));
            console.log(data);
            setTimeout(() => {
                setShowboxmessage('block');
            }, 500);
            // Additional logic to send data or update UI
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (!message) {
            alert('Please Enter Message');
            return;
        } else {
            const data = {
                Message: message,
                Channel: Math.floor(Math.random() * 5) + 1,
                Image: image,
                Username: username,
            };
            socketRef.current.emit('send message', JSON.stringify(data));
            console.log(data);
            // Additional logic to send data or update UI
        }
    };

    return (
        <div className='container mx-auto'>
            <div className="w-full h-screen flex justify-center items-center">
                <div className={`${animate} ${showblock} justify-center items-center flex-col w-96 border-2 border-violet-600 p-3 flex gap-3`}>
                    <div className={` flex justify-center items-center rounded-full overflow-hidden w-32 h-32 border-2 border-violet-600 relative`}>
                        <FontAwesomeIcon icon={faCamera} className={`${showIcon} text-4xl text-violet-600`} />
                        <input onChange={handleImageChange} type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        {image && <img src={image} alt="User" className={`${showImage} w-full h-full object-cover`} />}
                    </div>
                    <div className="flex justify-center items-center">
                        <input onChange={handleUsernameChange} value={username} type="text" className="input input-bordered w-full max-w-xs" placeholder="Username" />
                        <button onClick={handleSend} className="btn btn-primary ml-2">CONFIRM</button>
                    </div>
                </div>
                <div className={`${showboxmessage} justify-center items-center flex-col w-96 border-2 border-violet-600 p-3 flex gap-3`}>
                    <div className="flex justify-center items-center">
                        <input onChange={handleMessageChange} value={message} type="text" className="input input-bordered w-full max-w-xs" placeholder="Message" />
                        <button onClick={handleSendMessage} className="btn btn-info ml-2">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
