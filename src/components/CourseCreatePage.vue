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
                            <input type="radio" name="price" value="free" v-model="formData.price" required>
                            Free
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="price" value="premium" v-model="formData.price" required>
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
                    <input type="date" id="start_date" v-model="formData.start_date" required>
                </div>

                <div class="form-group">
                    <label for="start_time">Start Time*</label>
                    <input type="time" id="start_time" v-model="formData.start_time" required>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="submit-btn">Create Course</button>
                <button type="button" class="cancel-btn" @click="resetForm">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script>
import { availableCourses } from '@/config/course-config';

export default {
    name: 'CourseCreationForm',
    data() {
        return {
            formData: {
                title: '',
                short_description: '',
                long_description: '',
                icon: '',
                bgColor: '#E8F5E9', // Default color
                difficulty: 'Beginner',
                duration: '',
                capacity: '',
                price: '',
                status: 'Enrolling',
                instructor: '',
                start_date: '',
                start_time: ''
            }
        }
    },
    methods: {
        validateForm() {
            // Basic validation
            if (!this.formData.title || !this.formData.short_description) {
                alert('Please fill in all required fields');
                return false;
            }
            return true;
        },
        handleSubmit() {
            if (!this.validateForm()) return;

            try {
                const courseData = {
                    ...this.formData,
                    id: availableCourses.length + 1,
                    duration: `${this.formData.duration} min`
                };

                availableCourses.push(courseData);
                alert('Course created successfully!');
                this.$router.push('/courses');
                this.resetForm();
            } catch (error) {
                console.error('Error creating course:', error);
                alert('Failed to create course. Please try again.');
            }
        },
        resetForm() {
            this.formData = {
                title: '',
                short_description: '',
                long_description: '',
                icon: '',
                bgColor: '#E8F5E9',
                difficulty: 'Beginner',
                duration: '',
                capacity: '',
                price: '',
                status: 'Enrolling',
                instructor: '',
                start_date: '',
                start_time: ''
            };
        }
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