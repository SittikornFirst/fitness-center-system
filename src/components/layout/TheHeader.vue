<template>
    <header class="header">
        <div class="logo">
            <i class="fas fa-dumbbell logo-icon"></i>
            <span>FITNESS CENTER SYSTEM</span>
        </div>
        <nav class="nav">
            <router-link to="/home" class="nav-link" active-class="active">Home</router-link>
            <router-link to="/promotion" class="nav-link" active-class="active">Promotion</router-link>
            <router-link to="/courses" class="nav-link" active-class="active">Courses</router-link>
            <router-link to="/booking" class="nav-link" active-class="active">Booking</router-link>
        </nav>
        <div class="signup">
            <router-link v-if="!isLoggedIn" to="/signup" class="signup-link" active-class="active">Sign Up</router-link>
            <div v-else class="signup-container" @click="toggleDropdown">
                <span class="signup-name">{{ name }}</span>
                <i class="fa-solid fa-right-from-bracket" :class="{ open: isDropdownOpen }"></i>
                <div v-if="isDropdownOpen" class="dropdown">
                    <a href="#" @click.prevent="logout">Logout</a>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { logout } from '@/auth.js'; // Adjust the import path as needed

export default {
    name: 'TheHeader',
    data() {
        return {
            isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
            userRole: localStorage.getItem('userRole') || null,
            name: localStorage.getItem('userName') || '',
            isDropdownOpen: false,
        };
    },
    watch: {
        // eslint-disable-next-line no-unused-vars
        $route(to, from) {
            this.checkLoginStatus();
        }
    },
    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        async logout() {
            try {
                const success = await logout();
                if (success) {
                    this.isLoggedIn = false;
                    this.userRole = null;
                    this.name = '';
                    this.$router.push("/home");
                }
            } catch (error) {
                console.error("Logout failed:", error);
            }
        },
        checkLoginStatus() {
            this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            this.userRole = localStorage.getItem('userRole');
            this.name = localStorage.getItem('userName') || '';
        },
    },
    created() {
        this.checkLoginStatus();
    }
};
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    margin: 20px 50px;
    padding: 10px;
    font-size: 18px;
}

.header a {
    color: #fff;
    text-decoration: none;
}

.logo {
    flex: 1;
    display: flex;
    align-items: center;
}

.logo-icon {
    font-size: 24px;
    color: #fff;
    transition: transform 0.3s ease;
}

.logo:hover .logo-icon {
    transform: rotate(15deg);
}

.logo span {
    margin-left: 1vh;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.nav {
    flex: 2;
    display: flex;
    justify-content: center;
    gap: 20px;
}

.nav-link,
.signup-link {
    position: relative;
    padding: 5px 10px;
    transition: all 0.3s ease;
}

.nav-link::after,
.signup-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #fff;
    transition: width 0.3s ease;
}

.nav-link:hover,
.signup-link:hover {
    transform: scale(1.1);
}

.nav-link:hover::after,
.signup-link:hover::after {
    width: 100%;
}

.nav-link.active,
.signup-link.active {
    color: #ffd700;
    font-weight: 600;
}

.nav-link.active::after,
.signup-link.active::after {
    background-color: #ffd700;
    width: 100%;
}

.signup {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
}

.signup-container {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.signup-name {
    margin-right: 10px;
}

.dropdown-icon {
    transition: transform 0.3s ease;
    animation: fadeIn 0.3s ease-in-out;
}

.dropdown-icon.open {
    transform: rotate(180deg);
}

.dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #333;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 100;
    animation: fadeIn 0.3s ease-in-out;
}

.dropdown a {
    display: block;
    color: #fff;
    text-decoration: none;
    padding: 5px 10px;
    transition: background-color 0.3s ease;
    animation: fadeInItem 0.3s ease-in-out;
}

.dropdown a:hover {
    color: red;
}


@keyframes fadeInItem {
    from {
        opacity: 0;
        transform: translateX(10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}


@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.nav-link:nth-child(1) {
    animation-delay: 0.2s;
}

.nav-link:nth-child(2) {
    animation-delay: 0.2s;
}

.nav-link:nth-child(3) {
    animation-delay: 0.2s;
}

.nav-link:nth-child(4) {
    animation-delay: 0.2s;
}

.signup-link {
    animation-delay: 0.2s;
}

/* Add pulse animation for active links */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

.nav-link.active,
.signup-link.active {
    animation: pulse 2s infinite;
}

/* Optional: Add glow effect for active items */
.nav-link.active,
.signup-link.active {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
</style>