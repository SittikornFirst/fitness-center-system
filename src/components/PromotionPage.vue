// src/components/PromotionPage.vue
<template>
    <div class="promotion-page">
        <h1>Current Promotions</h1>

        <div class="search-filter-section">
            <input v-model="searchQuery" placeholder="Search promotions..." class="search-input"
                @input="filterPromotions" />
            <select v-model="filterType" @change="filterPromotions" class="filter-select">
                <option value="all">All Promotions</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
            </select>
        </div>

        <div v-if="isAdmin" class="admin-controls">
            <button @click="showAddPromotionForm = true" class="admin-button ">
                Add New Promotion
            </button>
        </div>

        <div v-if="filteredPromotions.length > 0" class="promotions-grid">
            <div v-for="promotion in filteredPromotions" :key="promotion.id" class="promotion-card"
                :class="{ 'expired': isExpired(promotion) }">
                <div class="promotion-header">
                    <h2>{{ promotion.title }}</h2>
                    <span :class="getStatusClass(promotion)" class="status-badge">
                        {{ getStatusText(promotion) }}
                    </span>
                </div>
                <img v-if="promotion.image" :src="promotion.image" :alt="promotion.title" class="promotion-image" />
                <p class="promotion-description">{{ promotion.description }}</p>
                <div class="promotion-details">
                    <p><strong>Discount:</strong> {{ promotion.discount }}%</p>
                    <p><strong>Valid Until:</strong> {{ formatDate(promotion.endDate) }}</p>
                    <p v-if="promotion.code"><strong>Code:</strong> {{ promotion.code }}</p>
                </div>

                <!-- Admin Controls per promotion -->
                <div v-if="isAdmin" class="promotion-admin-controls">
                    <button @click="editPromotion(promotion)" class="edit-button">
                        Edit
                    </button>
                    <button @click="deletePromotion(promotion.id)" class="delete-button">
                        Delete
                    </button>
                </div>
            </div>
        </div>
        <p v-else class="no-promotions">No promotions found matching your criteria.</p>

        <!-- Add/Edit Promotion Modal -->
        <div v-if="showAddPromotionForm" class="modal">
            <div class="modal-content">
                <h2>{{ editingPromotion ? 'Edit' : 'Add' }} Promotion</h2>
                <form @submit.prevent="savePromotion">
                    <div class="form-group">
                        <label>Title:</label>
                        <input v-model="promotionForm.title" required />
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea v-model="promotionForm.description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Discount (%):</label>
                        <input type="number" v-model="promotionForm.discount" required min="0" max="100" />
                    </div>
                    <div class="form-group">
                        <label>Start Date:</label>
                        <input type="date" v-model="promotionForm.startDate" required />
                    </div>
                    <div class="form-group">
                        <label>End Date:</label>
                        <input type="date" v-model="promotionForm.endDate" required />
                    </div>
                    <div class="form-group">
                        <label>Promotion Code:</label>
                        <input v-model="promotionForm.code" />
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="save-button">Save</button>
                        <button type="button" @click="closeModal" class="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { hasRole } from '@/auth';
import { promotions,initializePromotions  } from '@/config/promotion-config';

const PROMOTIONS_STORAGE_KEY = 'promotions_data';

initializePromotions();

export default {
    name: "PromotionPage",
    setup() {
        const searchQuery = ref('');
        const filterType = ref('all');
        const showAddPromotionForm = ref(false);
        const editingPromotion = ref(null);
        const promotionsData = ref([]);

        const promotionForm = ref({
            title: '',
            description: '',
            discount: 0,
            startDate: '',
            endDate: '',
            code: ''
        });
        const isAdmin = computed(() => {
            return hasRole('admin');
        });
        const loadPromotions = () => {
            try {
                const storedPromotions = localStorage.getItem(PROMOTIONS_STORAGE_KEY);
                if (storedPromotions) {
                    promotionsData.value = JSON.parse(storedPromotions);
                } else {
                    promotionsData.value = promotions; 
                    localStorage.setItem(PROMOTIONS_STORAGE_KEY, JSON.stringify(promotions));
                }
            } catch (error) {
                console.error('Error loading promotions:', error);
                promotionsData.value = promotions;
            }
        };


        // Filter promotions based on search and filter criteria
        const filteredPromotions = computed(() => {
            let filtered = [...promotionsData.value];

            // Apply search filter
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                filtered = filtered.filter(promo =>
                    promo.title.toLowerCase().includes(query) ||
                    promo.description.toLowerCase().includes(query)
                );
            }

            // Apply type filter
            switch (filterType.value) {
                case 'active':
                    filtered = filtered.filter(promo =>
                        new Date(promo.startDate) <= new Date() &&
                        new Date(promo.endDate) >= new Date()
                    );
                    break;
                case 'upcoming':
                    filtered = filtered.filter(promo =>
                        new Date(promo.startDate) > new Date()
                    );
                    break;
                case 'expired':
                    filtered = filtered.filter(promo =>
                        new Date(promo.endDate) < new Date()
                    );
                    break;
            }

            return filtered;
        });

        const savePromotionsToStorage = () => {
            localStorage.setItem(PROMOTIONS_STORAGE_KEY, JSON.stringify(promotionsData.value));
        };

        const methods = {
            formatDate(date) {
                return new Date(date).toLocaleDateString();
            },

            isExpired(promotion) {
                return new Date(promotion.endDate) < new Date();
            },

            getStatusClass(promotion) {
                const now = new Date();
                const startDate = new Date(promotion.startDate);
                const endDate = new Date(promotion.endDate);

                if (now < startDate) return 'status-upcoming';
                if (now > endDate) return 'status-expired';
                return 'status-active';
            },

            getStatusText(promotion) {
                const now = new Date();
                const startDate = new Date(promotion.startDate);
                const endDate = new Date(promotion.endDate);

                if (now < startDate) return 'Upcoming';
                if (now > endDate) return 'Expired';
                return 'Active';
            },

            async savePromotion() {
                try {
                    if (editingPromotion.value) {
                        const index = promotionsData.value.findIndex(p => p.id === editingPromotion.value.id);
                        if (index !== -1) {
                            promotionsData.value[index] = {
                                ...promotionsData.value[index],
                                ...promotionForm.value
                            };
                        }
                    } else {
                        const newPromotion = {
                            id: Date.now().toString(),
                            ...promotionForm.value
                        };
                        promotionsData.value.push(newPromotion);
                    }
                    savePromotionsToStorage();
                    methods.closeModal();
                } catch (error) {
                    console.error('Error saving promotion:', error);
                }
            },

            editPromotion(promotion) {
                editingPromotion.value = promotion;
                promotionForm.value = { ...promotion };
                showAddPromotionForm.value = true;
            },

            async deletePromotion(id) {
                if (confirm('Are you sure you want to delete this promotion?')) {
                    try {
                        promotionsData.value = promotionsData.value.filter(p => p.id !== id);
                        savePromotionsToStorage();
                    } catch (error) {
                        console.error('Error deleting promotion:', error);
                    }
                }
            },

            closeModal() {
                showAddPromotionForm.value = false;
                editingPromotion.value = null;
                promotionForm.value = {
                    title: '',
                    description: '',
                    discount: 0,
                    startDate: '',
                    endDate: '',
                    code: ''
                };
            }
        };

        onMounted(() => {
            loadPromotions();
        });



        return {
            searchQuery,
            filterType,
            showAddPromotionForm,
            promotionForm,
            editingPromotion,
            isAdmin,
            filteredPromotions,
            ...methods
        };
    },
};

</script>

<style scoped>
/* Previous styles remain the same */
</style>

<style scoped>
.promotion-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.search-filter-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
}

.search-input {
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 300px;
}

.filter-select {
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.promotions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}

.promotion-card {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: transform 0.2s;
    color: #666;
}

.promotion-card:hover {
    transform: translateY(-5px);
}

.promotion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8em;
}

.status-active {
    background-color: #4CAF50;
    color: white;
}

.status-upcoming {
    background-color: #2196F3;
    color: white;
}

.status-expired {
    background-color: #f44336;
    color: white;
}

.promotion-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 10px;
}

.promotion-description {
    margin: 10px 0;
    color: #666;
}

.promotion-details {
    margin-top: 10px;
}

.admin-controls {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.admin-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
}

.reset-button {
    background-color: #ff3939;
}

.promotion-admin-controls {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.edit-button,
.delete-button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.edit-button {
    background-color: #2196F3;
    color: white;
}

.delete-button {
    background-color: #f44336;
    color: white;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    color: #666;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.save-button,
.cancel-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.save-button {
    background-color: #4CAF50;
    color: white;
}

.cancel-button {
    background-color: #f44336;
    color: white;
}

@media (max-width: 768px) {
    .search-filter-section {
        flex-direction: column;
    }

    .search-input,
    .filter-select {
        width: 100%;
    }

    .promotions-grid {
        grid-template-columns: 1fr;
    }
}
</style>