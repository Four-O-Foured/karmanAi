import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import { useParams } from '@tanstack/react-router';
import { io } from 'socket.io-client';

const ChatPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { chatId } = useParams({ strict: false });
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketUrl = 'https://karmanai.onrender.com'

        const Socket = io(socketUrl, {
            withCredentials: true,
        });
        setSocket(Socket);
        Socket.on('connect', () => {
            console.log('Connected to server');
        });
        return () => {
            Socket.disconnect();
        };
    }, []);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-karman-bg text-karman-text font-body antialiased karman-noise relative">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="flex-1 flex p-2 md:p-3 min-w-0">
                <ChatInterface
                    socket={socket}
                    chatId={chatId}
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                />
            </div>
        </div>
    );
};

export default ChatPage;