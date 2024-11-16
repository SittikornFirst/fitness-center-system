<template>
    <div class="promotion-page">
        <h1>Current Promotions</h1>
        <div v-if="promotions.length > 0">
            <div v-for="promotion in promotions" :key="promotion.id" class="promotion-card">
                <h2>{{ promotion.title }}</h2>
                <p>{{ promotion.description }}</p>
                <p><strong>Discount:</strong> {{ promotion.discount }}%</p>
                <p><strong>Valid Until:</strong> {{ promotion.endDate }}</p>
            </div>
        </div>
        <p v-else>No current promotions available.</p>
    </div>
</template>

<script>
import { promotions } from '@/config/promotion-config.js';

export default {
    name: "PromotionDetails",
    data() {
        return {
            promotions 
        };
    },
};
</script>

<style scoped>

.promotion-page {
    text-align: center;
    font-family: Arial, sans-serif;
    height: 100vh;
}

.promotion-card {
    border: 1px solid #ddd;
    padding: 16px;
    margin: 16px auto;
    max-width: 500px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    color: #2a5298;
}

h1 {
    color: white;
    font: bold 48px Arial, sans-serif;
    margin-top: 1vh;
}
h2 {
    color: #2a5298;
    font: bold 24px Arial, sans-serif;
    margin-bottom: 1vh;
}

</style>