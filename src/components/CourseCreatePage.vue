<template>
    <div class="form-container">
        <h2 class="form-title">Create New Course</h2>
        <form @submit.prevent="handleSubmit" class="course-form">
            <div class="form-grid">
                <div class="form-group">
                    <label for="title">Course Title*</label>
                    <input type="text" id="title" v-model="formData.title" required
                        placeholder="e.g., Yoga Fundamentals">
                </div>

                <div class="form-group">
                    <label for="short_description">Short Description*</label>
                    <input type="text" id="short_description" v-model="formData.short_description" required
                        placeholder="Brief course overview">
                </div>

                <div class="form-group full-width">
                    <label for="long_description">Long Description*</label>
                    <textarea id="long_description" v-model="formData.long_description" required rows="4"
                        placeholder="Detailed course description"></textarea>
                </div>

                <div class="form-group">
                    <label for="icon">Icon URL*</label>
                    <input type="url" id="icon" v-model="formData.icon" placeholder="https://example.com/image.png">
                </div>

                <div class="form-group">
                    <label for="bgColor">Background Color*</label>
                    <input type="color" id="bgColor" v-model="formData.bgColor" required>
                </div>

                <div class="form-group">
                    <label for="difficulty">Difficulty Level*</label>
                    <select id="difficulty" v-model="formData.difficulty" required>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="duration">Duration (minutes)*</label>
                    <input type="number" id="duration" v-model="formData.duration" required min="1">
                </div>

                <div class="form-group">
                    <label for="capacity">Capacity*</label>
                    <input type="number" id="capacity" v-model="formData.capacity" required min="1">
                </div>

                <div class="form-group">
                    <label>Premium*</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="price" value="Free" v-model="formData.price" required>
                            Free
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="price" value="Premium" v-model="formData.price" required>
                            Premium
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="instructor">Instructor Name*</label>
                    <input type="text" id="instructor" v-model="formData.instructor" required>
                </div>

                <div class="form-group">
                    <label for="start_date">Start Date*</label>
                    <input type="date" id="start_date" v-model="formData.start_date" required 
                           :min="getCurrentDate()">
                </div>

                <div class="form-group">
                    <label for="start_time">Start Time*</label>
                    <input type="time" id="start_time" v-model="formData.start_time" required>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="submit-btn">Create Course</button>
                <button type="button" class="cancel-btn" @click="handleCancel">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loadCoursesFromStorage, saveCoursesToStorage } from '@/config/course-config';

export default {
    name: 'CourseCreationForm',
    setup() {
        const router = useRouter();
        const formData = ref({
            title: '',
            short_description: '',
            long_description: '',
            icon: '',
            bgColor: '#E8F5E9',
            difficulty: 'Beginner',
            duration: '',
            capacity: '',
            price: 'Free',
            status: 'Enrolling',
            instructor: '',
            start_date: '',
            start_time: ''
        });

        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const validateForm = () => {
            // Check all required fields
            const requiredFields = [
                'title', 'short_description', 'long_description', 'icon',
                'bgColor', 'difficulty', 'duration', 'capacity', 'price',
                'instructor', 'start_date', 'start_time'
            ];

            const missingFields = requiredFields.filter(field => !formData.value[field]);
            
            if (missingFields.length > 0) {
                alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
                return false;
            }

            // Validate numeric fields
            if (isNaN(formData.value.duration) || formData.value.duration <= 0) {
                alert('Duration must be a positive number');
                return false;
            }

            if (isNaN(formData.value.capacity) || formData.value.capacity <= 0) {
                alert('Capacity must be a positive number');
                return false;
            }

            // Validate date
            const selectedDate = new Date(formData.value.start_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                alert('Start date cannot be in the past');
                return false;
            }

            return true;
        };

        const handleSubmit = () => {
            if (!validateForm()) return;

            try {
                const coursesData = loadCoursesFromStorage();

                const allCourses = [
                    ...coursesData.availableCourses,
                    ...coursesData.completedCourses,
                    ...coursesData.createdCourses
                ];
                const maxId = allCourses.reduce((max, course) => Math.max(max, course.id), 0);
                
                const courseData = {
                    ...formData.value,
                    id: maxId + 1,
                    duration: `${formData.value.duration} min`,
                    capacity: parseInt(formData.value.capacity),
                    start_time: convertTo12Hour(formData.value.start_time)
                };

                // Add to availableCourses
                coursesData.availableCourses.push(courseData);

                // Save to localStorage
                saveCoursesToStorage(coursesData);

                alert('Course created successfully!');
                router.push('/home');
            } catch (error) {
                console.error('Error creating course:', error);
                alert('Failed to create course. Please try again.');
            }
        };

        const convertTo12Hour = (time24) => {
            if (!time24) return '';
            
            const [hours, minutes] = time24.split(':');
            const hour = parseInt(hours);
            const period = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            
            return `${hour12}:${minutes} ${period}`;
        };

        const handleCancel = () => {
            if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
                router.push('/home');
            }
        };

        return {
            formData,
            handleSubmit,
            handleCancel,
            getCurrentDate
        };
    }
}
</script>

<style scoped>
.form-container {
    width: 1200px;
    margin: 2rem auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: #333;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
}

input,
select,
textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

textarea {
    resize: vertical;
}

.form-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.submit-btn,
.cancel-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-btn {
    background-color: #ff6767;
    color: white;
}

.submit-btn:hover {
    background-color: #ff4f4f;
}

.cancel-btn {
    background-color: #eee;
    color: #333;
}

.cancel-btn:hover {
    background-color: #ddd;
}

.radio-group {
    display: flex;
    gap: 1.5rem;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.radio-label input[type="radio"] {
    cursor: pointer;
}

</style>