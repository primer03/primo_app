'use client';
import { redirect } from 'next/router'; // นำเข้า useRouter
import { io } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react'; // นำเข้า useRef
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function Page({ params }) {
    const [inputValue, setInputValue] = useState('');
    const [border, setBorder] = useState({});
    const socketRef = useRef(null); // ใช้ useRef สำหรับ socket
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [msgblock, setMsgBlock] = useState([]);
    const [countmsg, setCountmsg] = useState(0);
    const [row, setRow] = useState(1);
    useEffect(() => {
        const regex = new RegExp('^[0-5]+$');
        if (!regex.test(params.id)) {
            router.push('/'); // ใช้ router.push เพื่อนำทาง
            return;
        }

        socketRef.current = io('https://primo-server.onrender.com/', { transports: ['websocket'] });
        socketRef.current.emit('send chanel', params.id);
        socketRef.current.on('message', (data) => {
            let dataz = JSON.parse(data);
            console.log(dataz.Channel);
            if (params.id == dataz.Channel) {
                setMsgBlock(msgblock => [...msgblock, dataz]);
            }
        });
        const handleBeforeUnload = () => {

            console.log('beforeunload');
            socketRef.current.emit('send message', 'Disconnect');
            socketRef.current.emit('chanel disconnect', params.id);
            // socketRef.current.close();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // ลบ event listener และทำการทำลาย socket เมื่อ component unmount
            // window.removeEventListener('beforeunload', handleBeforeUnload);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [params.id, pathname, searchParams, router]);
    return (
        <div className='p-3 w-full h-screen overflow-hidden bg-slate-50'>
            <div className='flex w-full gap-3 flex-col-reverse h-full justify-start items-end'>
                <div className=' w-full'>
                    <div className=' flex flex-row gap-3 items-center justify-end'>
                        <div className=' w-full grid grid-cols-5 gap-3'>

                            {Array.isArray(msgblock) && msgblock.map((item, index) => (
                                <div key={index} className='animate-zoomIn w-full flex bg-white shadow-md rounded-md p-3'>
                                    <div className='image h-14 w-14 border border-red-500 rounded-full'>
                                        <img src={item.Image} className='w-full h-full rounded-full object-cover' />
                                    </div>
                                    <div className=' justify-center box-border p-1 flex flex-col gap-1'>
                                        <p className='text-sm font-semibold'>{item.Username}</p>
                                        <p className='text-xs'>{item.Message}</p>
                                    </div>
                                </div>
                                // <div key={index} className=' h-24 flex flex-row gap-2 items-center card animate-zoomIn box-border block p-3 bg-white shadow-lg rounded-md' style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                //     <img src={item.Image} className='w-10 h-10 rounded-full object-cover' />
                                //     <div className=' w-full flex flex-col justify-start items-start gap-1'>
                                //         <p>{item.Username}</p>
                                //         <p>{item.Message}</p>
                                //     </div>
                                // </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* <div className=' w-full'>
                    <div className=' flex flex-row gap-3 items-center justify-end'>
                        <div className=' w-full grid grid-cols-5 gap-3'>
                            {Array.from({ length: 2 }, (_, index) => (
                                <div key={`card-${index}`} className='w-full shadow-lg card p-4 w-full bg-white'>
                                    <p>{index + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}
                {/* <div className=' grid grid-cols-5 gap-3  justify-end'>
                        {Array.isArray(msgblock) && msgblock.map((item, index) => (
                            <div key={index} className=' flex flex-row gap-2 items-center card animate-zoomIn box-border block p-3 bg-white shadow-lg rounded-md' style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                <img src={item.Image} className='w-10 h-10 rounded-full' />
                                <p>{item.Message}</p>
                            </div>
                        ))}
                    </div> */}
                {/* <div className=' flex flex-row  gap-3 flex-wrap items-center justify-end'>
                       
                    </div> */}
                {/* </div> */}
            </div>
        </div >
    );
}
