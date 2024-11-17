<template>
    <!-- Admin View -->
    <div class="card-body">
        <h3 class="h4 mb-4">All Bookings</h3>
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th>User</th>
                        <th>Trainer</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Court</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr v-for="booking in bookings" :key="booking.id" class="align-middle">
                        <td>{{ getUserName(booking.userId) }}</td>
                        <td>{{ getTrainerName(booking.trainerId) }}</td>
                        <td>{{ formatDate(booking.date) }}</td>
                        <td>{{ booking.time }}</td>
                        <td>{{ getCourtName(booking.courtId) }}</td>
                        <td >
                            <span :class="[
                                'badge',
                                {
                                    'bg-warning status': booking.bookingStatus === 'pending',
                                    'bg-success status': booking.bookingStatus === 'approved',
                                    'bg-danger status': booking.bookingStatus === 'rejected'
                                }
                            ]">
                                {{ booking.bookingStatus }}
                            </span>
                        </td>
                        <td class="action-td">
                            <div v-if="booking.bookingStatus === 'pending'" class="btn-group">
                                <button @click="approveBooking(booking.id)"
                                    class="btn btn-sm btn-success action-button">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button @click="rejectBooking(booking.id)" class="btn btn-sm btn-danger action-button">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { trainers } from '@/config/trainer-config.js';
import { courts } from '@/config/court-config.js';
import { bookingConfig } from '@/config/booking-config.js';
import { userConfig } from '@/config/user-config.js';

export default {
    name: 'AdminBookingPage',
    emits: ['booking-updated'],

    setup() {
        const bookings = ref([...bookingConfig.bookings]);

        const formatDate = (dateString) =>
            new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

        const getUserName = (userId) => {
            const user = userConfig.users.find((u) => u.id === userId);
            return user ? user.username : 'Unknown';
        };

        const getTrainerName = (trainerId) => {
            const trainer = trainers.find((t) => t.id === trainerId);
            return trainer ? trainer.name : 'Unknown';
        };

        const getCourtName = (courtId) => {
            const court = courts.find((c) => c.id === courtId);
            return court ? court.courtName : 'Unknown';
        };

        const updateConfigBookings = () => {
            bookingConfig.bookings = [...bookings.value];
        };

        const approveBooking = async (bookingId) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const bookingIndex = bookings.value.findIndex((b) => b.id === bookingId);
            if (bookingIndex !== -1) {
                bookings.value[bookingIndex] = {
                    ...bookings.value[bookingIndex],
                    bookingStatus: 'approved'
                };
                updateConfigBookings();
            }
        };

        const rejectBooking = async (bookingId) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const bookingIndex = bookings.value.findIndex((b) => b.id === bookingId);
            if (bookingIndex !== -1) {
                bookings.value[bookingIndex] = {
                    ...bookings.value[bookingIndex],
                    bookingStatus: 'rejected'
                };
                updateConfigBookings();
            }
        };

        return {
            bookings,
            formatDate,
            getUserName,
            getTrainerName,
            getCourtName,
            approveBooking,
            rejectBooking
        };
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
.action-td{
    width: 200px;
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

.btn-group .btn {
    padding: 0.375rem 1rem;
    display: flex;
    justify-content: center;
    align-items:center;
}
</style>