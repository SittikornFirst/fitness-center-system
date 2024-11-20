<!-- eslint-disable no-undef -->
<template>
    <div class="courses-container">
        <div class="courses-header">
            <nav class="navigation-tabs">
                <button class="nav-tab" :class="{ active: activeTab === 'available' }" @click="activeTab = 'available'">
                    <i class="fas fa-dumbbell"></i> Available Courses
                </button>
                <button class="nav-tab" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">
                    <i class="fas fa-check-circle"></i> Completed Courses
                </button>
                <button class="nav-tab" :class="{ active: activeTab === 'created' }" @click="activeTab = 'created'">
                    <i class="fas fa-plus-circle"></i> Created Courses
                </button>
            </nav>
        </div>

        <div class="courses-grid" v-if="activeTab === 'available'">
            <CourseCard v-for="course in availableCourses" :key="course.id" :course="course" />
        </div>

        <div class="courses-grid" v-if="activeTab === 'completed'">
            <CourseCard v-for="course in completedCourses" :key="course.id" :course="course" />
        </div>

        <div class="courses-grid" v-if="activeTab === 'created'">
            <CourseCreation v-if="activeTab === 'created'" />
        </div>
    </div>
</template>

<script>
import { authState } from '@/auth';
import CourseCard from './layout/CourseCard.vue';
import CourseCreation from './CourseCreatePage.vue';
import { ref, onMounted, watch, computed } from 'vue';
import { loadCoursesFromStorage } from '@/config/course-config';
import router from '../router';

export default {
    name: 'CoursesPage',
    components: { CourseCard, CourseCreation },
    setup() {
        const activeTab = ref('available');
        const coursesData = ref({
            availableCourses: [],
            completedCourses: [],
            createdCourses: []
        });

        const loadCourses = () => {
            const data = loadCoursesFromStorage();
            coursesData.value = data;
        };

        const checkAdminAuth = () => {
            if (!authState.currentUser) {
                alert('You must be logged in to access this page.');
                router.push({ name: 'SignUp' });
                return;
            } else if(authState.currentUser.role === 'admin') {
                console.log('Admin access granted.');
            } else {
                alert('You must contact the admin to access this page.');
                activeTab.value = 'available';
                router.push({ name: 'CoursesPage' });
            }
        };

        onMounted(() => {
            loadCourses();
        });

        watch(activeTab, (newTab) => {
            if (newTab === 'created') {
                checkAdminAuth();
            }
        });

        return {
            activeTab,
            availableCourses: computed(() => coursesData.value.availableCourses),
            completedCourses: computed(() => coursesData.value.completedCourses),
            createdCourses: computed(() => coursesData.value.createdCourses),
            checkAdminAuth
        };
    }
};
</script>




<style scoped>
.courses-container {
    margin: 0px auto;
    padding: 20px;
}

.courses-header {
    margin-bottom: 30px;
}

.navigation-tabs {
    width: 1200px;
    display: flex;
    gap: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
}

.nav-tab {
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    color: #eee;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-tab.active {
    color: #ff6767;
    border-bottom: 2px solid #ff6767;
    margin-bottom: -12px;
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
</style>