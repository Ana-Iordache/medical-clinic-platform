import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/main_pages/HomePage'
import UsersList from '@/views/main_pages/UsersList'
import DoctorInfo from '@/views/secondary_pages/DoctorInfo'
import PatientInfo from '@/views/secondary_pages/PatientInfo'
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
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/logout',
        redirect: '/home'
    },
    {
        path: '/home',
        component: HomePage
    },
    // TODO: this call should be available only for users with role of doctor
    {
        path: '/patients',
        component: UsersList,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/patients/:id',
        name: 'PatientInfo',
        component: PatientInfo,
        meta: {
            requiredAuth: true
        }
    },
    // TODO: this call should be available only for users with role of patient
    {
        path: '/doctors',
        component: UsersList
    },
    {
        path: '/doctors/:id',
        name: 'DoctorInfo',
        component: DoctorInfo
    },
    {
        path: '/appointments',
        component: Appointments,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/feedback',
        component: Feedback,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/earnings',
        component: Earnings,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/services',
        component: Services
    },
    {
        path: '/payments',
        component: Payments,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/profile',
        component: Profile,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/settings',
        component: Settings,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/rate_application',
        component: RateApplication,
        meta: {
            requiredAuth: true
        }
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/sign_up',
        component: SignUp
    },
    {
        path: '/reset_password',
        component: ResetPassword
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// without this, when we hit refresh, even if we are logged in because by the time the refresh page happens
// firebase current user doesn't exists (firebase isn't initialized yet)
const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(getAuth(), user => {
            removeListener();
            resolve(user);
        }, reject);
    })
}

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiredAuth)) {
        if (await getCurrentUser()) {
            next();
        } else {
            next("/login");
        }
    } else {
        next();
    }
})

export default router;