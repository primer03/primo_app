'use client';
import React, { useState } from 'react';

export default function Changename() {
    const [name, setName] = useState('John Doe');
    const [inputValue, setInputValue] = useState('');
    const [chatbox, setChatbox] = useState([]);
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const changeName = () => {
        setName(inputValue || 'John Doe');
        setChatbox([...chatbox, inputValue]);
    };

    return (
        <div>
            <div className=' container mx-auto'>
                <div className='flex gap-3 w-full justify-center'>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button className='btn btn-primary' onClick={changeName}>Change Name</button>
                </div>

                <div className=' grid grid-cols-5 gap-4'>
                    {chatbox.map((item, index) => (
                        <div className='card animate-zoomIn box-border block p-3 border-2 border-pink-400 rounded-md' style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}