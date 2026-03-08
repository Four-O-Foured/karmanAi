import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export const messagesQueryOptions = (chatId) => ({
    queryKey: ['messages', chatId],
    queryFn: async () => {
        if (!chatId) return [];
        const response = await api.get(`/chat/${chatId}/messages`);
        return response.data;
    },
    enabled: !!chatId,
    staleTime: 1000 * 60, // 1 min
});

export const useMessages = (chatId) => {
    return useQuery(messagesQueryOptions(chatId));
};
