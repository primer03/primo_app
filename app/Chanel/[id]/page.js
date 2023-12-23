'use client';
import { redirect } from 'next/router'; // นำเข้า useRouter
import { io } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react'; // นำเข้า useRef
import { usePathname, useSearchParams,useRouter } from 'next/navigation';

export default function Page({ params }) {
    const [inputValue, setInputValue] = useState('');
    const [border, setBorder] = useState({});
    const socketRef = useRef(null); // ใช้ useRef สำหรับ socket
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        const regex = new RegExp('^[0-5]+$');
        if (!regex.test(params.id)) {
            router.push('/'); // ใช้ router.push เพื่อนำทาง
            return;
        }
        socketRef.current = io('https://primo-server.onrender.com/', { transports: ['websocket'] });
        socketRef.current.emit('send chanel', params.id);

        const handleBeforeUnload = () => {
            console.log('beforeunload');
            socketRef.current.emit('chanel disconnect', params.id);
            socketRef.current.close();
        };

        window.onbeforeunload = () => {
            console.log('beforeunload');
            socketRef.current.emit('chanel disconnect', params.id);
            socketRef.current.close();
        };
    
        return () => {
            // ลบ event listener และทำการทำลาย socket เมื่อ component unmount
            // window.removeEventListener('beforeunload', handleBeforeUnload);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [params.id,pathname,searchParams,router]);
    return (
        <div>
            <h1>Slug: {params.id}</h1>
            <input
                type="text"
                placeholder="Type here"
                className={`input input-bordered w-full max-w-xs ${border[params.id - 1] || ''}`}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
            />
            <button
                className='btn btn-accent'
                onClick={() => {
                    if (socketRef.current) {
                        socketRef.current.emit('send message', inputValue);
                    }
                }}
            >
                Send
            </button>
        </div>
    );
}
