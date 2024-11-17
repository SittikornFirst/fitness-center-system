<template>
    <div class="review-slider">
        <div class="slider-container" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div v-for="review in reviews" :key="review.id" class="slide">
                <div class="review-card">
                    <img :src="review.image" :alt="review.name" class="reviewer-image">
                    <div class="review-content">
                        <h3>{{ review.name }}</h3>
                        <div class="stars">
                            <span v-for="n in review.rating" :key="n" class="star">⭐</span>
                        </div>
                        <p>{{ review.comment }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="slider-controls">
            <button @click="prevSlide" :disabled="currentSlide === 0">&lt;</button>
            <div class="dots">
                <span v-for="(_, index) in reviews" :key="index" :class="['dot', { active: currentSlide === index }]"
                    @click="goToSlide(index)"></span>
            </div>
            <button @click="nextSlide" :disabled="currentSlide === reviews.length - 1">&gt;</button>
        </div>
    </div>
</template>

<script>
import { reviews } from '@/config/review-config.js';

export default {
    name: 'ReviewSlider',
    data() {
        return {
            reviews,
            currentSlide: 0,
            autoplayInterval: null
        };
    },
    methods: {
        nextSlide() {
            if (this.currentSlide < this.reviews.length - 1) {
                this.currentSlide++;
            }
        },
        prevSlide() {
            if (this.currentSlide > 0) {
                this.currentSlide--;
            }
        },
        goToSlide(index) {
            this.currentSlide = index;
        },
        startAutoplay() {
            this.autoplayInterval = setInterval(() => {
                if (this.currentSlide === this.reviews.length - 1) {
                    this.currentSlide = 0;
                } else {
                    this.nextSlide();
                }
            }, 5000);
        },
        stopAutoplay() {
            clearInterval(this.autoplayInterval);
        }
    },
    mounted() {
        this.startAutoplay();
    },
    // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
    beforeDestroy() {
        this.stopAutoplay();
    }
};
</script>

<style scoped>
*{
    color:gray;
}
.review-slider {
    width: 100%;
    max-width: 1200px;
    margin: 2rem auto;
    overflow: hidden;
    position: relative;
}

.slider-container {
    display: flex;
    transition: transform 0.5s ease;
}

.slide {
    min-width: 100%;
    padding: 0 1rem;
}

.review-card {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 2rem;
}

.reviewer-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}

.review-content {
    flex: 1;
}

.stars {
    color: gold;
    margin: 0.5rem 0;
}

.slider-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
}

.slider-controls button {
    background: #333;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
}

.slider-controls button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.dots {
    display: flex;
    gap: 0.5rem;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ccc;
    cursor: pointer;
}

.dot.active {
    background: #333;
}

@media (max-width: 768px) {
    .review-card {
        flex-direction: column;
        text-align: center;
    }
}
</style>