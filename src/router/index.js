import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import PromotionPage from '@/components/PromotionPage.vue';
import BookingPage from '@/components/BookingPage.vue';
import CoursesPage from '@/components/CoursesPage.vue';
import CourseDetailPage from '@/components/CourseDetailPage.vue';
import AuthenticationPage from '@/components/AuthenticationPage.vue';
import CourseEditForm from '@/components/CourseEditPage.vue';
import { authState } from '@/auth'; // Import the global auth state

const routes = [
    { path: '/', redirect: { name: 'HomePage' } },
    { path: '/home', name: 'HomePage', component: HomePage, meta: { title: 'Home' } },
    { path: '/promotion', name: 'PromotionPage', component: PromotionPage, meta: { title: 'Promotion' } },
    { path: '/booking', name: 'BookingPage', component: BookingPage, meta: { title: 'Booking', requiresAuth: true } },
    { path: '/courses', name: 'CoursesPage', component: CoursesPage, meta: { title: 'Courses' } },
    {
        path: '/courses/:id',
        name: 'CourseDetailPage',
        component: CourseDetailPage,
        props: true,
        meta: { title: 'Course Detail' }
    }, {
        path: '/courses/:id/edit',
        name: 'CourseEdit',
        props: true,
        requiresAdmin: true,
        component: CourseEditForm,
        meta: {
            title: 'Edit Course'
        }
    },
    {
        path: '/signup',
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
    if (to.name === 'CourseEdit' && (!authState.currentUser || authState.currentUser.role !== 'admin')) {
        alert('Only administrators can edit courses.');
        return next({ name: 'HomePage' });
    }
    next();
});

export default router;