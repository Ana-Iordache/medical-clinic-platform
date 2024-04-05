import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/main_pages/HomePage'
import UsersList from '@/views/main_pages/UsersList'
import Appointments from '@/views/main_pages/Appointments'
import Feedback from '@/views/main_pages/Feedback'
import Earnings from '@/views/main_pages/Earnings'
import Services from '@/views/main_pages/Services'
import Payments from '@/views/main_pages/Payments'
import Profile from '@/views/account_section/Profile'
import Settings from '@/views/account_section/Settings'
import RateApplication from '@/views/account_section/RateApplication'
import Login from '@/views/authentication_forms/Login'
import SignUp from '@/views/authentication_forms/SignUp'
import ResetPassword from '@/views/authentication_forms/ResetPassword'

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/logout', redirect: '/home' },
    { path: '/home', component: HomePage },
    { path: '/patients', component: UsersList },
    { path: '/doctors', component: UsersList },
    { path: '/appointments', component: Appointments },
    { path: '/feedback', component: Feedback },
    { path: '/earnings', component: Earnings },
    { path: '/services', component: Services },
    { path: '/payments', component: Payments },
    { path: '/profile', component: Profile },
    { path: '/settings', component: Settings },
    { path: '/rate_application', component: RateApplication },
    { path: '/login', component: Login },
    { path: '/sign_up', component: SignUp },
    { path: '/reset_password', component: ResetPassword },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;