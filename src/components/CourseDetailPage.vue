<template>
    <div class="course-detail-container">
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

        <div class="course-info">
            <p><strong>Instructor:</strong> {{ course.instructor }}</p>
            <p><strong>Difficulty:</strong> <span :class="course.difficulty.toLowerCase()">{{ course.difficulty
                    }}</span></p>
            <p><strong>Duration:</strong> {{ course.duration }}</p>
            <p><strong>Capacity:</strong> {{ course.capacity }} spots</p>
            <p><strong>Price:</strong> {{ course.price }}</p>
            <p class="course-description">{{ course.long_description }}</p>
        </div>

        <div class="booking-section">
            <!-- Show login message if user is not authenticated -->
            <div v-if="!isAuthenticated" class="auth-message alert alert-warning">
                <i class="fas fa-lock me-2"></i>
                Please <router-link to="/login" class="alert-link">login</router-link> to book this course
            </div>

            <!-- Show already booked message if user has booked -->
            <div v-else-if="hasUserBooked" class="auth-message alert alert-info">
                <i class="fas fa-check-circle me-2"></i>
                You have already enrolled in this course
            </div>

            <!-- Show booking button if user can book -->
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

        <!-- Booking Status Modal -->
        <div v-if="showBookingModal" class="booking-modal">
            <div class="modal-content">
                <h3>{{ bookingModalMessage.title }}</h3>
                <p>{{ bookingModalMessage.text }}</p>
                <button @click="closeModal" class="btn btn-primary">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { availableCourses, completedCourses, createdCourses } from '@/config/course-config';
import { authState } from '@/auth';
import { userBookings } from '@/config/booking-config';

export default {
    name: 'CourseDetailPage',
    setup() {
        const course = ref(null);
        const showBookingModal = ref(false);
        const bookingModalMessage = ref({ title: '', text: '' });

        return {
            course,
            showBookingModal,
            bookingModalMessage
        };
    },
    computed: {
        isAuthenticated() {
            return authState.currentUser !== null;
        },
        currentUserId() {
            return authState.currentUser?.id;
        },
        canBook() {
            return this.course &&
                this.course.status === 'Enrolling' &&
                this.course.capacity > 0 &&
                this.isAuthenticated &&
                !this.hasUserBooked;
        },
        hasUserBooked() {
            if (!this.isAuthenticated || !this.course) return false;

            return userBookings.some(booking =>
                booking.userId === this.currentUserId &&
                booking.courseId === this.course.id
            );
        }
    },
    created() {
        this.loadCourse();
    },
    methods: {
        loadCourse() {
            const courseId = parseInt(this.$route.params.id);
            const allCourses = [...availableCourses, ...completedCourses, ...createdCourses];
            this.course = allCourses.find(course => course.id === courseId);

            if (!this.course) {
                this.$router.push('/not-found');
            }
        },
        async bookCourse() {
            if (!this.isAuthenticated) {
                this.showBookingModal = true;
                this.bookingModalMessage = {
                    title: 'Authentication Required',
                    text: 'Please login to book this course.'
                };
                return;
            }

            if (this.hasUserBooked) {
                this.showBookingModal = true;
                this.bookingModalMessage = {
                    title: 'Already Enrolled',
                    text: 'You have already enrolled in this course.'
                };
                return;
            }

            if (this.canBook) {
                try {
                    userBookings.push({
                        id: Date.now(), // Generate unique ID
                        userId: this.currentUserId,
                        courseId: this.course.id,
                        date: new Date().toISOString(),
                        status: 'enrolled'
                    });

                    this.course.capacity -= 1;

                    if (this.course.capacity === 0) {
                        this.course.status = 'Full';
                    }

                    this.showBookingModal = true;
                    this.bookingModalMessage = {
                        title: 'Booking Successful',
                        text: 'You have successfully enrolled in this course!'
                    };

                } catch (error) {
                    this.showBookingModal = true;
                    this.bookingModalMessage = {
                        title: 'Booking Failed',
                        text: 'There was an error while booking the course. Please try again.'
                    };
                }
            }
        },
        closeModal() {
            this.showBookingModal = false;
        }
    }
};
</script>

<style scoped>
.course-detail-container {
    max-width: 700px;
    margin: 40px auto;
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
