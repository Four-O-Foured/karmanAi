import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import api from '../api/client';
import customToast from '../utils/toast';

/**
 * Hook to handle user login.
 */
export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post('/auth/login', credentials);
            return response.data; // Expected { token: '...', user: { username: '...', ... } }
        },
        onSuccess: (data) => {
            // 1. Save token
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            // 2. STITCH the data into the cache immediately
            // This makes the 'authUser' query instant on the next screen
            if (data.user) {
                queryClient.setQueryData(['authUser'], data.user);
            }

            customToast.success('Login Successful');
            router.navigate({ to: '/chat' });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to login.';
            customToast.error(message);
        },
    });
};

/**
 * Hook to get the current authenticated user.
 */
export const authQueryOptions = {
    queryKey: ['authUser'],
    queryFn: async () => {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    staleTime: 1000 * 60 * 30, // 30 mins
    retry: false,
};

/**
 * Hook to get the current authenticated user.
 */
export const useAuth = () => {
    return useQuery(authQueryOptions);
};

/**
 * Hook to logout.
 */
export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return async () => {
        try {
            await api.get('/auth/logout');
            queryClient.setQueryData(['authUser'], null);
            queryClient.clear(); // Wipe all data for safety
            customToast.success('Logged out');
            router.navigate({ to: '/login' });
        } catch (error) {
            customToast.error('Failed to logout');
        }
    };
};

export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post('/auth/register', credentials);
            return response.data; // Expected { token: '...', user: { username: '...', ... } }
        },
        onSuccess: (data) => {
            // 1. Save token
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            // 2. STITCH the data into the cache immediately
            // This makes the 'authUser' query instant on the next screen
            if (data.user) {
                queryClient.setQueryData(['authUser'], data.user);
            }

            customToast.success('Register Successful');
            router.navigate({ to: '/chat' });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to register.';
            customToast.error(message);
        },
    });
};
