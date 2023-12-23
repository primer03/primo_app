'use client'
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function SelectChanel() {
    const [borders, setBorders] = useState(new Array(5).fill('border-2 border-pink-400 rounded-md'));
    const socketRef = useRef(null); // ใช้ useRef เพื่อเก็บค่า socket

    useEffect(() => {
        // กำหนด socket และเก็บไว้ใน socketRef.current
        socketRef.current = io('https://primo-server.onrender.com/', { transports: ['websocket'] });
        socketRef.current.on("connect", () => {
            console.log(`ID: ${socketRef.current.id}`);
        });

        socketRef.current.on('message', (data) => {
            console.log(`Message: ${data}`);
        });

        socketRef.current.on('chanel', (data) => {
            console.log(`Chanel ${data} Connect`);
            setBorders(borders => {
                const newBorders = [...borders];
                newBorders[data - 1] = 'border-2 border-green-400 rounded-md';
                return newBorders;
            });
        });

        socketRef.current.on('chanelDis', (data) => {
            console.log(`Chanel ${data} Disconnect`);
            setBorders(borders => {
                const newBorders = [...borders];
                newBorders[data - 1] = 'border-2 border-pink-400 rounded-md';
                return newBorders;
            });
        });

        return () => {
            // ทำการทำลาย socket เมื่อ component unmount
            socketRef.current.off('connect');
            socketRef.current.off('message');
            socketRef.current.off('chanel');
            socketRef.current.off('chanelDis');
            socketRef.current.disconnect();
        };
    }, []);

    // ฟังก์ชันสำหรับการจัดการการคลิก ที่ใช้ socketRef.current
    const handleClick = () => {
        if (socketRef.current) {
            socketRef.current.emit('send message', 'Hello');
        }
    }

    return (
        <div>
            <div className='container mx-auto'>
                <button className='btn btn-accent' onClick={handleClick}>Send</button>
                <div className='grid grid-cols-2 gap-4'>
                    {borders.map((border, index) => (
                        <Link href={`/Chanel/${index + 1}`} key={index}>
                            <div className={`card animate-zoomIn box-border block p-3 ${border}`} style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                <p>Chanel {index + 1}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}