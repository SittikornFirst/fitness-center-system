import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import PromotionPage from '@/components/PromotionPage.vue';
import BookingPage from '@/components/BookingPage.vue';
import CoursesPage from '@/components/CoursesPage.vue';
import CourseDetailPage from '@/components/CourseDetailPage.vue';
import AuthenticationPage from '@/components/AuthenticationPage.vue';
import { authState } from '@/auth'; // Import the global auth state

const routes = [
    { path: '/', redirect: { name: 'HomePage' } },
    { path: '/Home', name: 'HomePage', component: HomePage, meta: { title: 'Home' } },
    { path: '/Promotion', name: 'PromotionPage', component: PromotionPage, meta: { title: 'Promotion' } },
    { path: '/Booking', name: 'BookingPage', component: BookingPage, meta: { title: 'Booking', requiresAuth: true } },
    { path: '/Courses', name: 'CoursesPage', component: CoursesPage, meta: { title: 'Courses' } },
    {
        path: '/Courses/:id',
        name: 'CourseDetailPage',
        component: CourseDetailPage,
        props: true,
    },
    {
        path: '/Signup',
        name: 'SignUp',
        component: AuthenticationPage,
        meta: { title: 'Sign Up' },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const { title, requiresAuth, requiresAdmin } = to.meta;
    document.title = title || 'Default Title';

    if (requiresAuth && !authState.currentUser) {
        alert('You must be logged in to access this page.');
        return next({ name: 'SignUp', query: { redirect: to.fullPath } });
    }

    if (requiresAdmin && (!authState.currentUser || authState.currentUser.role !== 'admin')) {
        alert('Contact the admin for access.');
        return next({ name: 'HomePage' });
    }

    next();
});

export default router;