<template>
    <div class="course-card">
        <router-link class='course-link' :to="{ name: 'CourseDetailPage', params: { id: course.id } }">
            <div class="course-icon" :style="{ backgroundColor: course.bgColor }">
                <img :src="course.icon" :alt="course.title">
            </div>
            <div class="course-content">
                <h3>{{ course.title }}</h3>
                <p>{{ course.short_description }}</p>
                <div class="course-meta">
                    <span class="difficulty" :class="course.difficulty.toLowerCase()">
                        <i class="fas fa-signal"></i> {{ course.difficulty }}
                    </span>
                    <div class="course-details">
                        <span class="detail">
                            <i class="fas fa-calendar-alt"></i> {{ course.start_date }} {{ course.start_time }}
                        </span>
                        <span class="detail">
                            <i class="fas fa-clock " ></i> {{ course.duration }}
                            <i class="fas fa-users mgl-1"></i> {{ course.capacity }} spots
                        </span>
                    </div>
                    <div class="tags">
                        <span class="tag price">{{ course.price }}</span>
                        <span class="tag status" :class="course.status.toLowerCase()">
                            {{ course.status }}
                        </span>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'CourseCard',
    props: {
        course: Object,
    },
};
</script>

<style scoped>
.course-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    height: 25rem; 
    display: flex;
    flex-direction: column;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.course-icon {
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
}

.course-icon img {
    width: 80px;
    height: 80px;
    object-fit: contain;
}

.course-content {
    padding: 20px;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.course-content h3 {
    margin: 0 0 10px 0;
    color: #2a5298;
    font-size: 1.3rem;
}

.course-content p {
    margin: 0 0 15px 0;
    color: #666;
    font-size: 0.95rem;
    line-height: 1.5;
}

.course-link {
    text-decoration: none;
}

.course-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.course-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.detail {
    font-size: 0.9rem;
    color: #666;
}

.difficulty {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.difficulty.beginner {
    background: #E8F5E9;
    color: #2E7D32;
}

.difficulty.intermediate {
    background: #FFF3E0;
    color: #E65100;
}

.difficulty.advanced {
    background: #FFEBEE;
    color: #C62828;
}

.tags {
    display: flex;
    gap: 10px;
    margin-top: 5px;
}

.tag {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.tag.price {
    background: #E3F2FD;
    color: #1565C0;
}

.tag.status {
    background: #F3E5F5;
    color: #7B1FA2;
}

.tag.status.full {
    background: #FFEBEE;
    color: #C62828;
}

.completed {
    opacity: 0.7;
}
</style>
