//Book trainer and court
export const bookingConfig = {
    bookings: [
        {
            id: 1,
            userId: 2,
            trainerId: 1,
            date: '2023-05-15',
            time: '10:00 AM',
            courtId: 1,
            bookingStatus: 'pending',
        },
        {
            id: 2,
            userId: 3,
            trainerId: 2,
            date: '2023-05-16',
            time: '2:00 PM',
            courtId: 2,
            bookingStatus: 'approved',
        },
    ],
};

//BookCourse
export const userBookings = {
    userBook:[
        {
            id: 1,
            userId: 2,
            courseId: 1,
            date: '2023-05-15',
            time: '10:00 AM',
            courtId: 1,
            bookingStatus: 'pending',
    }]

}

export const saveBookingsToStorage = (bookings) => {
    localStorage.setItem('user_bookings', JSON.stringify(bookings));
};

export const loadBookingsFromStorage = () => {
    const storedBookings = localStorage.getItem('user_bookings');
    return storedBookings ? JSON.parse(storedBookings) : [];
};
