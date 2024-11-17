<template>
    <div class="form-container">
        <h2 class="form-title">Edit Course</h2>
        <form @submit.prevent="handleSubmit" class="course-form" v-if="formData">
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

                <div class="form-group">
                    <label for="status">Status*</label>
                    <select id="status" v-model="formData.status" required>
                        <option value="Enrolling">Enrolling</option>
                        <option value="Full">Full</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="submit-btn">Update Course</button>
                <button type="button" class="cancel-btn" @click="cancelEdit">Cancel</button>
            </div>
        </form>
        <div v-else class="loading-message">
            Loading course data...
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { availableCourses, completedCourses, createdCourses } from '@/config/course-config';

import { useRoute, useRouter } from 'vue-router';

export default {
    name: 'CourseEditForm',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const formData = ref(null);

        const convertTo24Hour = (timeStr) => {
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

        const loadCourseData = () => {
            const courseId = parseInt(route.params.id);
            const allCourses = [...availableCourses, ...completedCourses, ...createdCourses];
            const course = allCourses.find(c => c.id === courseId);

            if (!course) {
                router.push('/not-found');
                return;
            }

            formData.value = JSON.parse(JSON.stringify(course));

            if (formData.value.start_time) {
                formData.value.start_time = convertTo24Hour(formData.value.start_time);
            }

            if (formData.value.duration) {
                formData.value.duration = parseInt(formData.value.duration.split(' ')[0]);
            }
        };

        const handleSubmit = () => {
            try {
                const courseId = parseInt(route.params.id);
                const allCourses = [availableCourses, completedCourses, createdCourses];

                for (let courseArray of allCourses) {
                    const index = courseArray.findIndex(c => c.id === courseId);
                    if (index !== -1) {
                        // Format duration back to "X minutes"
                        const updatedData = {
                            ...formData.value,
                            duration: `${formData.value.duration} minutes`
                        };
                        courseArray[index] = updatedData;
                        break;
                    }
                }

                router.push(`/courses/${courseId}`);
            } catch (error) {
                console.error('Error updating course:', error);
                alert('Failed to update course. Please try again.');
            }
        };

        onMounted(() => {
            loadCourseData();
        });

        return {
            formData,
            handleSubmit,
            cancelEdit: () => router.back()
        };
    }
};
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

.loading-message {
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    padding: 2rem;
}
</style>