<template>
    <div v-if="course" class="course-detail-container">
        <div class="course-header">
            <img :src="course.icon" alt="Course Icon" class="course-icon" />
            <div class="course-title">
                <h1>{{ course.title }}</h1>
                <p class="course-status"
                    :class="{ enrolling: course.status === 'Enrolling', full: course.status === 'Full' }">
                    {{ course.status }}
                </p>
            </div>
        </div>

        <!-- Add Admin Controls -->
        <div v-if="isAuthenticated && isAdmin" class="admin-controls">
            <button @click="editCourse" class="btn btn-primary me-2">
                <i class="fas fa-edit me-2"></i>
                Edit Course
            </button>
            <button @click="confirmDelete" class="btn btn-danger">
                <i class="fas fa-trash-alt me-2"></i>
                Delete Course
            </button>
        </div>

        <div class="course-info">
            <p><strong>Instructor:</strong> {{ course.instructor }}</p>
            <p><strong>Difficulty:</strong> <span :class="course.difficulty.toLowerCase()">{{ course.difficulty
                    }}</span></p>
            <p><strong>Date:</strong> {{ course.start_date }} {{ course.start_time }} </p>
            <p><strong>Duration:</strong> {{ course.duration }}</p>
            <p><strong>Capacity:</strong> {{ course.capacity }} spots</p>
            <p><strong>Premium:</strong> {{ course.price }}</p>
            <p class="course-description">{{ course.long_description }}</p>
        </div>

        <div class="booking-section">
            <div v-if="!isAuthenticated" class="auth-message alert alert-warning">
                <i class="fas fa-lock me-2"></i>
                Please <router-link to="/login" class="alert-link">login</router-link> to book this course
            </div>

            <div v-else-if="hasUserBooked" class="auth-message alert alert-info">
                <i class="fas fa-check-circle me-2"></i>
                You have already enrolled in this course
            </div>

            <div v-else-if="hasTimeConflict" class="auth-message alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ conflictingCoursesMessage }}
            </div>

            <button v-else @click="bookCourse" class="book-button" :disabled="!canBook"
                :class="{ 'disabled': !canBook }">
                <span v-if="canBook">
                    <i class="fas fa-bookmark me-2"></i>
                    Book Now
                </span>
                <span v-else>
                    <i class="fas fa-ban me-2"></i>
                    Fully Booked
                </span>
            </button>
        </div>
        <div v-if="showModal" class="course-detail-container2">
            <div class="booking-modal">
                <div class="modal-content">
                    <h3>{{ modalMessage.title }}</h3>
                    <p>{{ modalMessage.text }}</p>
                    <div class="modal-buttons">
                        <button v-if="modalType === 'delete'" @click="deleteCourse" class="btn btn-danger me-2">
                            Confirm Delete
                        </button>
                        <button @click="closeModal" class="btn btn-primary">
                            {{ modalType === 'delete' ? 'Cancel' : 'Close' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showBookingModal" class="course-detail-container2">
            <div class="booking-modal">
                <div class="modal-content">
                    <h3>{{ bookingModalMessage.title }}</h3>
                    <p>{{ bookingModalMessage.text }}</p>
                    <button @click="closeModal" class="btn btn-primary">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="loading-container">
        <p>Loading course details...</p>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { availableCourses, completedCourses, createdCourses } from '@/config/course-config';
import { authState } from '@/auth';
import { userBookings } from '@/config/booking-config';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'CourseDetailPage',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const course = ref(null);
        const showModal = ref(false);
        const modalType = ref('booking');
        const modalMessage = ref({ title: '', text: '' });
        const localUserBookings = ref([]);

        const isAuthenticated = computed(() => authState.currentUser !== null);
        const isAdmin = computed(() => authState.currentUser?.role === 'admin');
        const currentUserId = computed(() => authState.currentUser?.id);

        const convertTo24Hour = (timeStr) => {
            if (!timeStr) return '';
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);

            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }

            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        };

        const getDurationInMinutes = (duration) => {
            if (!duration) return 0;
            return parseInt(duration.split(' ')[0]);
        };

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        const hasUserBooked = computed(() => {
            if (!isAuthenticated.value || !course.value || !localUserBookings.value) {
                return false;
            }
            return localUserBookings.value.some(booking =>
                booking.userId === currentUserId.value &&
                booking.courseId === course.value.id
            );
        });

        const hasTimeConflict = computed(() => {
            if (!isAuthenticated.value || !course.value || !localUserBookings.value) {
                return false;
            }

            const currentStartTime = new Date(`${course.value.start_date}T${convertTo24Hour(course.value.start_time)}`);
            const currentEndTime = new Date(currentStartTime.getTime() + getDurationInMinutes(course.value.duration) * 60000);

            const userBookedCourses = localUserBookings.value
                .filter(booking => booking.userId === currentUserId.value)
                .map(booking => {
                    return [...availableCourses, ...completedCourses, ...createdCourses]
                        .find(c => c.id === booking.courseId);
                })
                .filter(Boolean);

            return userBookedCourses.some(bookedCourse => {
                if (!bookedCourse || bookedCourse.start_date !== course.value.start_date) {
                    return false;
                }

                const bookedStartTime = new Date(`${bookedCourse.start_date}T${convertTo24Hour(bookedCourse.start_time)}`);
                const bookedEndTime = new Date(bookedStartTime.getTime() + getDurationInMinutes(bookedCourse.duration) * 60000);

                return (
                    (currentStartTime >= bookedStartTime && currentStartTime < bookedEndTime) ||
                    (currentEndTime > bookedStartTime && currentEndTime <= bookedEndTime) ||
                    (currentStartTime <= bookedStartTime && currentEndTime )
                );
            });
        });

        const conflictingCoursesMessage = computed(() => {
            if (!hasTimeConflict.value || !localUserBookings.value || !course.value) return '';

            const conflictingCourses = localUserBookings.value
                .filter(booking => booking.userId === currentUserId.value)
                .map(booking => {
                    return [...availableCourses, ...completedCourses, ...createdCourses]
                        .find(c => c.id === booking.courseId);
                })
                .filter(conflictCourse => {
                    if (!conflictCourse || conflictCourse.start_date !== course.value.start_date) return false;

                    const courseStartTime = new Date(`${conflictCourse.start_date}T${convertTo24Hour(conflictCourse.start_time)}`);
                    const courseEndTime = new Date(courseStartTime.getTime() + getDurationInMinutes(conflictCourse.duration) * 60000);
                    const currentStartTime = new Date(`${course.value.start_date}T${convertTo24Hour(course.value.start_time)}`);
                    const currentEndTime = new Date(currentStartTime.getTime() + getDurationInMinutes(course.value.duration) * 60000);

                    return (
                        (currentStartTime >= courseStartTime && currentStartTime < courseEndTime) ||
                        (currentEndTime > courseStartTime && currentEndTime <= courseEndTime) ||
                        (currentStartTime <= courseStartTime && currentEndTime >= courseEndTime)
                    );
                });

            if (conflictingCourses.length === 0) return '';

            const courseList = conflictingCourses
                .map(conflictCourse => 
                    `${conflictCourse.title} (${conflictCourse.start_time} on ${formatDate(conflictCourse.start_date)})`
                )
                .join(', ');

            return `Time conflict with: ${courseList}`;
        });

        const canBook = computed(() => {
            return course.value &&
                course.value.status === 'Enrolling' &&
                course.value.capacity > 0 &&
                isAuthenticated.value &&
                !hasUserBooked.value &&
                !hasTimeConflict.value;
        });

        const loadCourse = () => {
            const courseId = parseInt(route.params.id);
            const allCourses = [...availableCourses, ...completedCourses, ...createdCourses];
            const foundCourse = allCourses.find(c => c.id === courseId);

            if (!foundCourse) {
                router.push('/not-found');
                return;
            }

            course.value = foundCourse;
            localUserBookings.value = userBookings.userBook || [];
        };

        const editCourse = () => {
            if (!isAdmin.value) return;
            router.push(`/courses/${course.value.id}/edit`);
        };

        const confirmDelete = () => {
            if (!isAdmin.value) return;
            modalType.value = 'delete';
            showModal.value = true;
            modalMessage.value = {
                title: 'Confirm Delete',
                text: `Are you sure you want to delete the course "${course.value.title}"? This action cannot be undone.`
            };
        };

        const deleteCourse = async () => {
            if (!isAdmin.value) return;

            try {
                let courseFound = false;

                const availableIndex = availableCourses.findIndex(c => c.id === course.value.id);
                if (availableIndex !== -1) {
                    availableCourses.splice(availableIndex, 1);
                    courseFound = true;
                }

                if (!courseFound) {
                    const completedIndex = completedCourses.findIndex(c => c.id === course.value.id);
                    if (completedIndex !== -1) {
                        completedCourses.splice(completedIndex, 1);
                        courseFound = true;
                    }
                }

                if (!courseFound) {
                    const createdIndex = createdCourses.findIndex(c => c.id === course.value.id);
                    if (createdIndex !== -1) {
                        createdCourses.splice(createdIndex, 1);
                    }
                }

                userBookings.userBook = userBookings.userBook.filter(
                    booking => booking.courseId !== course.value.id
                );

                closeModal();
                router.push('/courses');
            } catch (error) {
                console.error('Error deleting course:', error);
                modalType.value = 'error';
                modalMessage.value = {
                    title: 'Error',
                    text: 'Failed to delete the course. Please try again.'
                };
            }
        };

        const closeModal = () => {
            showModal.value = false;
            modalType.value = 'booking';
        };

        const bookCourse = async () => {
            if (!canBook.value) return;

            try {
                const newBooking = {
                    id: Date.now(),
                    userId: currentUserId.value,
                    courseId: course.value.id,
                    date: new Date().toISOString(),
                    status: 'enrolled'
                };

                userBookings.userBook.push(newBooking);
                localUserBookings.value = [...userBookings.userBook];

                course.value.capacity -= 1;
                if (course.value.capacity === 0) {
                    course.value.status = 'Full';
                }

                modalType.value = 'booking';
                showModal.value = true;
                modalMessage.value = {
                    title: 'Booking Successful',
                    text: 'You have successfully enrolled in this course!'
                };
            } catch (error) {
                console.error('Error booking course:', error);
                modalType.value = 'error';
                modalMessage.value = {
                    title: 'Booking Failed',
                    text: 'There was an error while booking the course. Please try again.'
                };
            }
        };

        onMounted(() => {
            loadCourse();
        });

        return {
            course,
            isAuthenticated,
            isAdmin,
            hasUserBooked,
            hasTimeConflict,
            canBook,
            showModal,
            modalType,
            modalMessage,
            editCourse,
            confirmDelete,
            deleteCourse,
            closeModal,
            bookCourse,
            conflictingCoursesMessage
        };
    },
    computed: {
        currentUserId() {
            return authState.currentUser?.id;
        },
        
    },
    methods: {

        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        convertTo24Hour(timeStr) {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours);

            if (period === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period === 'AM' && hours === 12) {
                hours = 0;
            }

            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        },
        getDurationInMinutes(duration) {
            return parseInt(duration.split(' ')[0]);
        },
    }
};
</script>

<style scoped>
.admin-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 0.5rem;
}

.btn {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #0d6efd;
    color: white;
}

.btn-primary:hover {
    background-color: #0b5ed7;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.btn-danger:hover {
    background-color: #bb2d3b;
}

.me-2 {
    margin-right: 0.5rem;
}

.course-detail-container {
    width: 1200px;
    margin: 40px auto;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    font-family: Arial, sans-serif;
    color: #333;
}

.course-detail-container2 {
    max-width: 700px;
    margin: 20px auto;
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    font-family: Arial, sans-serif;
    color: #333;
}

.course-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 20px;
}

.course-icon {
    width: 80px;
    height: 80px;
    margin-right: 20px;
}

.course-title h1 {
    font-size: 1.8em;
    color: #1f3c88;
    margin: 0;
}

.course-status {
    font-size: 1em;
    margin-top: 5px;
    font-weight: bold;
    color: #4CAF50;
}

.course-status.enrolling {
    color: #4CAF50;
}

.course-status.full {
    color: #e57373;
    font-weight: bold;
}

.course-info p {
    margin: 10px 0;
    font-size: 1em;
    color: #555;
}

.course-description {
    margin-top: 15px;
    font-size: 1.1em;
    color: #555;
    line-height: 1.6;
}

.book-button {
    width: 100%;
    padding: 12px;
    font-size: 1.2em;
    margin-top: 20px;
    background-color: #1f3c88;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.book-button:hover {
    background-color: #15326b;
}

.book-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.difficulty {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: bold;
}

.difficulty.beginner {
    background-color: #e8f5e9;
    color: #4CAF50;
}

.difficulty.intermediate {
    background-color: #fff3e0;
    color: #fb8c00;
}

.difficulty.advanced {
    background-color: #fdecea;
    color: #e57373;
}

.tags {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}
</style>
