<template>
    <div class="container py-4">
        <div class="card mx-auto" style="max-width: 1000px;">
            <div class="card-header border-bottom d-flex justify-content-between align-items-center">
                <div>
                    <h1 class="h3 mb-0">Booking Page</h1>
                </div>
                <div v-if="!isAdmin" class="text-end">
                    <button @click="showHistory = !showHistory" class="btn btn-outline-primary">
                        <i class="fas fa-history me-2"></i>
                        {{ showHistory ? 'New Booking' : 'Booking History' }}
                    </button>
                </div>
            </div>

            <div v-if="!isAdmin" class="card-body">
                <!-- User Booking History -->
                <div v-if="showHistory">
                    <h4 class="mb-4">Your Booking History</h4>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Trainer</th>
                                    <th>Court</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="booking in userBookings" :key="booking.id">
                                    <td>{{ booking.id }}</td>
                                    <td>{{ formatDate(booking.date) }}</td>
                                    <td>{{ booking.time }}</td>
                                    <td>{{ getTrainerName(booking.trainerId) }}</td>
                                    <td>{{ getCourtName(booking.courtId) }}</td>
                                    <td>
                                        <span :class="[
                                            'badge',
                                            {
                                                'bg-warning': booking.bookingStatus === 'pending',
                                                'bg-success': booking.bookingStatus === 'approved',
                                                'bg-danger': booking.bookingStatus === 'rejected'
                                            }
                                        ]">
                                            {{ booking.bookingStatus.charAt(0).toUpperCase() +
                                                booking.bookingStatus.slice(1) }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Booking Form -->
                <div v-if="!showHistory">
                    <ul class="nav nav-pills nav-fill mb-4">
                        <li class="nav-item mx-1" v-for="tab in ['trainer', 'time', 'court']" :key="tab">
                            <button @click="activeTab = tab" :class="['nav-link', activeTab === tab ? 'active' : '']">
                                <i :class="[
                                    'fas me-2',
                                    {
                                        'fa-user': tab === 'trainer',
                                        'fa-clock': tab === 'time',
                                        'fa-map-marker-alt': tab === 'court'
                                    }
                                ]"></i>
                                {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
                            </button>
                        </li>
                    </ul>

                    <div class="booking-steps">
                        <!-- Updated Trainer Selection -->
                        <div v-if="activeTab === 'trainer'" class="mb-3">
                            <label class="form-label h5">Select Trainer</label>
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle w-100 text-start p-3"
                                    @click="toggleTrainerDropdown">
                                    <div v-if="selectedTrainerObj" class="d-flex align-items-center">
                                        <div class="trainer-avatar me-3">
                                            <i class="fas fa-user-circle fa-2x"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">{{ selectedTrainerObj.name }}</h6>
                                            <small class="text-muted">{{ selectedTrainerObj.specialty }}</small>
                                        </div>
                                    </div>
                                    <span v-else>Choose a trainer</span>
                                </button>

                                <ul v-if="isTrainerDropdownOpen" class="dropdown-menu show w-100">
                                    <li v-for="trainer in trainers" :key="trainer.id">
                                        <a class="dropdown-item p-3" @click="selectTrainer(trainer.id)"
                                            :class="{ 'text-danger': !hasAvailabilityToday(trainer) }">
                                            <div class="d-flex align-items-center justify-content-between">
                                                <div class="d-flex align-items-center">
                                                    <div class="trainer-avatar me-3">
                                                        <i class="fas fa-user-circle fa-2x"></i>
                                                    </div>
                                                    <div>
                                                        <span class="d-block fw-bold">{{ trainer.name }}</span>
                                                        <small class="text-muted">{{ trainer.specialty }}</small>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span v-if="!hasAvailabilityToday(trainer)"
                                                        class="badge bg-danger">No availability today</span>
                                                    <span v-else class="badge bg-success">Available today</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <!-- New Trainer Schedule Display -->
                            <div v-if="selectedTrainerObj" class="mt-4">
                                <h6 class="mb-3">Today's Schedule - {{ getCurrentDay() }}</h6>
                                <div class="trainer-schedule p-3 border rounded">
                                    <div v-if="hasAvailabilityToday(selectedTrainerObj)">
                                        <div class="d-flex flex-wrap gap-2">
                                            <div v-for="time in getTrainerTodayAvailability(selectedTrainerObj)"
                                                :key="time" class="schedule-slot">
                                                <span class="badge bg-primary p-2">{{ time }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-danger">
                                        <i class="fas fa-exclamation-circle me-2"></i>
                                        No available time slots today
                                    </div>
                                    <!-- Weekly Availability -->
                                    <div class="mt-3">
                                        <h6 class="mb-2">Weekly Availability</h6>
                                        <div class="weekly-schedule">
                                            <div v-for="day in selectedTrainerObj.availability" :key="day.day"
                                                class="day-schedule mb-2">
                                                <span class="fw-bold me-2">{{ day.day }}:</span>
                                                <span v-if="day.times.length">
                                                    {{ day.times.join(', ') }}
                                                </span>
                                                <span v-else class="text-muted">No availability</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Time Selection -->
                        <div v-if="activeTab === 'time'" class="mb-3">
                            <label class="form-label h5">Select Time</label>
                            <div class="row g-3">
                                <div class="col-md-4" v-for="time in availableTimes" :key="time">
                                    <button @click="selectedTime = time"
                                        :class="['btn w-100 p-3', selectedTime === time ? 'btn-primary' : 'btn-outline-secondary']">
                                        <i class="far fa-clock me-2"></i>
                                        {{ time }}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- Court Selection -->
                        <div v-if="activeTab === 'court'" class="mb-3">
                            <label class="form-label h5">Select Court</label>
                            <div class="row g-3">
                                <div class="col-md-6" v-for="court in courts" :key="court.id">
                                    <button @click="selectedCourt = court.id"
                                        :class="['btn w-100 p-3', selectedCourt === court.id ? 'btn-primary' : 'btn-outline-secondary']">
                                        <i class="fas fa-map-marker-alt me-2"></i>
                                        {{ court.courtName }}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button @click="confirmBooking()"
                            :disabled="!selectedCourt || !selectedTime || !selectedTrainer"
                            class="btn btn-primary w-100 mt-4 p-3">
                            <i class="fas fa-check me-2"></i>
                            Confirm Booking
                        </button>
                    </div>
                </div>

                <!-- Booking Status Display -->
                <div v-if="bookingStatus && !showHistory">
                    <div class="card bg-light mb-4">
                        <div class="card-body">
                            <h5 class="card-title">Booking Details</h5>
                            <div class="mt-3">
                                <p class="mb-2">
                                    <i class="fas fa-user me-2"></i>
                                    Trainer: {{ selectedTrainerObj?.name }}
                                </p>
                                <p class="mb-2">
                                    <i class="far fa-clock me-2"></i>
                                    Time: {{ selectedTime }}
                                </p>
                                <p class="mb-2">
                                    <i class="fas fa-map-marker-alt me-2"></i>
                                    Court: {{ selectedCourtName }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-if="bookingStatus === 'pending'" class="alert alert-warning text-center p-4 d-flex flex-column align-items-center justify-content-center">
                        <i class="fas fa-clock fa-3x mb-3"></i>
                        <h5>Awaiting Approval</h5>
                        <p class="mb-0">Your booking is pending admin approval.</p>
                    </div>
                </div>
            </div>
            <AdminBookingPage v-if="isAdmin"></AdminBookingPage>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { trainers } from '@/config/trainer-config.js';
import { courts } from '@/config/court-config.js';
import { bookingConfig } from '@/config/booking-config.js';
import { userConfig } from '@/config/user-config.js';
import { authState } from '@/auth';
import AdminBookingPage from './AdminBookingPage.vue';

export default {
    name: 'BookingPage',
    setup() {
        const showHistory = ref(false);
        const activeTab = ref('trainer');
        const selectedTrainer = ref(null);
        const selectedTrainerObj = ref(null);
        const selectedTime = ref(null);
        const selectedCourt = ref(null);
        const selectedCourtName = ref('');
        const availableTimes = ref([]);
        const isTrainerDropdownOpen = ref(false);
        const bookingStatus = ref(null);

        const isLoggedIn = computed(() => localStorage.getItem('isLoggedIn') === 'true');
        const isAdmin = computed(() => authState.currentUser?.role === 'admin');
        const userBookings = computed(() => {
            return bookingConfig.bookings
                .filter(booking => booking.userId === authState.currentUser?.id)
        });

        return {
            showHistory,
            activeTab,
            trainers,
            courts,
            selectedTrainer,
            selectedTrainerObj,
            selectedTime,
            selectedCourt,
            selectedCourtName,
            availableTimes,
            isTrainerDropdownOpen,
            bookingStatus,
            userBookings,
            bookings: computed(() => bookingConfig.bookings),
            isLoggedIn,
            isAdmin
        };
    },
    components: {
        AdminBookingPage
    },
    computed: {
        currentUser() {
            return authState.currentUser;
        }
    },
    methods: {
        async confirmBooking() {
            if (!this.currentUser?.email) {
                console.error('User not authenticated');
                return;
            }

            const userInfo = userConfig.users.find(u => u.email === this.currentUser.email);
            if (!userInfo) {
                console.error('User information not found');
                return;
            }

            const court = this.courts.find(c => c.id === this.selectedCourt);
            this.selectedCourtName = court?.courtName || '';

            const newBooking = {
                id: this.bookings.length + 1,
                userId: userInfo.id, // Use the correct user ID from userConfig
                trainerId: this.selectedTrainer,
                date: new Date().toISOString().split('T')[0],
                time: this.selectedTime,
                courtId: this.selectedCourt,
                bookingStatus: 'pending'
            };

            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                bookingConfig.bookings.push(newBooking);
                this.bookingStatus = 'pending';
                this.$emit('booking-updated');
                this.resetForm();
            } catch (error) {
                console.error('Error creating booking:', error);
            }
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        getCurrentDay() {
            return new Date().toLocaleString('en-us', { weekday: 'long' });
        },

        hasAvailabilityToday(trainer) {
            const today = this.getCurrentDay();
            const todaySchedule = trainer.availability.find(a => a.day === today);
            return todaySchedule && todaySchedule.times.length > 0;
        },

        getTrainerTodayAvailability(trainer) {
            const today = this.getCurrentDay();
            const todaySchedule = trainer.availability.find(a => a.day === today);
            return todaySchedule ? todaySchedule.times : [];
        },

        selectTrainer(trainerId) {
            this.selectedTrainer = trainerId;
            this.selectedTrainerObj = this.trainers.find(t => t.id === trainerId);
            this.updateAvailableTimes();
            this.isTrainerDropdownOpen = false;
        },
        toggleTrainerDropdown() {
            this.isTrainerDropdownOpen = !this.isTrainerDropdownOpen;
        },
        updateAvailableTimes() {
            const today = new Date().toLocaleString('en-us', { weekday: 'long' });
            const availability = this.selectedTrainerObj?.availability.find(a => a.day === today);
            this.availableTimes = availability ? availability.times : [];
        },
        getTrainerName(trainerId) {
            const trainer = this.trainers.find(t => t.id === trainerId);
            return trainer ? trainer.name : 'Unknown';
        },
        getCourtName(courtId) {
            const court = this.courts.find(c => c.id === courtId);
            return court ? court.courtName : 'Unknown';
        },
        getUserName(userId) {
            const user = userConfig.users.find(u => u.id === userId);
            return user ? user.username : 'Unknown';
        },
        resetForm() {
            this.selectedTrainer = null;
            this.selectedTrainerObj = null;
            this.selectedTime = null;
            this.selectedCourt = null;
            this.selectedCourtName = '';
            this.activeTab = 'trainer';
            this.availableTimes = [];
        }
    },
    watch: {
        isLoggedIn: {
            immediate: true,
            handler(isLoggedIn) {
                if (!isLoggedIn) {
                    this.$router.push('/home'); // Redirect to home if not logged in
                }
            }
        },
        isAdmin: {
            immediate: true,
            handler(isAdmin) {
                if (!isAdmin && this.$route.name === 'AdminBookingPage') {
                    this.$router.push('/home'); // Redirect to home if not admin
                }
            }
        }
    }
};
</script>


<style scoped>
.status,
.action-button {
    text-align: center;
    align-items: center;
    width: 80px;
    height: 30px;
}

.dropdown-menu {
    display: block;
    max-height: 300px;
    overflow-y: auto;
}

.fa-3x {
    font-size: 3em;
    display: block;
    margin-bottom: 1rem;
}

.card {
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
    border: none;
}

.nav-pills .nav-link {
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    transition: all 0.3s ease;
}

.nav-pills .nav-link:not(.active):hover {
    background-color: #f8f9fa;
}

.trainer-avatar {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border-radius: 50%;
}

.dropdown-item {
    transition: background-color 0.2s ease;
}

.dropdown-item:hover {
    background-color: #f8f9fa;
}

.btn {
    transition: all 0.3s ease;
}

.table th {
    font-weight: 600;
    background-color: #f8f9fa;
}

.badge {
    padding: 0.5rem 0.75rem;
}

.booking-steps {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.table-responsive {
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.alert {
    border: none;
    border-radius: 0.5rem;
}

.btn-group .btn {
    padding: 0.375rem 1rem;
}
</style>