import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export const chatsQueryOptions = {
    queryKey: ['chats'],
    queryFn: async () => {
        const response = await api.get('/chat');
        console.log(response.data);
        return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 mins
};

export const useChats = () => {
    return useQuery(chatsQueryOptions);
}
