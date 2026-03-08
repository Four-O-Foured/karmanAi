import { createRootRouteWithContext, createRoute, Router, redirect, lazyRouteComponent } from '@tanstack/react-router'
import App from '../App'
import { authQueryOptions } from '../hooks/useAuth'
import customToast from '../utils/toast'
import { chatsQueryOptions } from '../hooks/useChats'

export const rootRoute = createRootRouteWithContext()({
    component: App,
    // This runs the moment the user hits ANY route in the app
    beforeLoad: async ({ context: { queryClient } }) => {
        const session = await queryClient.fetchQuery(authQueryOptions)
        // Returning data here makes it available to all child routes via `context`
        return { session }
    },
})

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: lazyRouteComponent(() => import('../pages/LandingPage')),
})

export const chatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/chat/$chatId',
    component: lazyRouteComponent(() => import('../pages/ChatPage')),
    beforeLoad: async ({ context: { session } }) => {
        if (!session) {
            customToast.error('Login to continue');
            throw redirect({ to: '/login' })
        }
    }
})

export const chatIndexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/chat',
    beforeLoad: async ({ context: { queryClient, session } }) => {
        if (!session) {
            customToast.error('Login to continue');
            throw redirect({ to: '/login' })
        }
        // Try to fetch chats to redirect to the latest one
        try {
            const chats = await queryClient.ensureQueryData(chatsQueryOptions)
            if (chats && chats.length > 0) {
                throw redirect({
                    to: '/chat/$chatId',
                    params: { chatId: chats[0]._id }
                })
            }
        } catch (error) {
            if (error.status === 307 || error.status === 308) throw error;
            console.error('Failed to fetch chats for redirect', error)
        }
    },
    // If no chats, we can still show the page with a "New Chat" state or handled by component
    component: lazyRouteComponent(() => import('../pages/ChatPage')),
})

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: lazyRouteComponent(() => import('../pages/LoginPage')),
    beforeLoad: ({ context: { session } }) => {
        if (!session) {
            // we let them stay
        } else {
            throw redirect({ to: '/chat' })
        }
    }
})

export const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: lazyRouteComponent(() => import('../pages/RegisterPage')),
    beforeLoad: ({ context: { session } }) => {
        if (!session) {
            // we let them stay
        } else {
            throw redirect({ to: '/chat' })
        }
    }
})

export const router = new Router({
    routeTree: rootRoute.addChildren([indexRoute, chatRoute, chatIndexRoute, loginRoute, registerRoute]),
    context: {
        queryClient: undefined,
    }
})
