<template>
    <form class="signup-form" @submit.prevent="handleSignUp">
        <div class="form-group">
            <label>Username</label>
            <input type="text" v-model="username" required placeholder="Enter your username" />
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" required placeholder="Enter your email" />
            <span v-if="!isEmailValid" class="error-message">Please enter a valid email address.</span>
            <span v-if="isEmailTaken" class="error-message">This email is already registered.</span>
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" required placeholder="Create a password" />
        </div>
        <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" v-model="confirmPassword" required placeholder="Confirm your password" />
            <span v-if="!passwordsMatch" class="error-message">Passwords do not match.</span>
        </div>
        <button type="submit" class="button" :disabled="!isFormValid">Sign Up</button>
    </form>
</template>

<script>
import { userConfig } from '@/config/user-config.js';

export default {
    name: 'SignUpForm',
    data() {
        return {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            isEmailTaken: false
        };
    },
    computed: {
        passwordsMatch() {
            return this.password === this.confirmPassword;
        },
        isEmailValid() {
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            return emailRegex.test(this.email);
        },
        isFormValid() {
            return this.passwordsMatch &&
                this.isEmailValid &&
                !this.isEmailTaken &&
                this.username.length > 0 &&
                this.password.length > 0;
        }
    },
    watch: {
        email() {
            this.checkEmailAvailability();
        }
    },
    methods: {
        checkEmailAvailability() {
            this.isEmailTaken = userConfig.users.some(user => user.email === this.email);
        },
        async handleSignUp() {
            if (!this.isFormValid) {
                this.$emit('show-message', {
                    text: 'Please check all fields are valid.',
                    type: 'error'
                });
                return;
            }

            try {
                // Create new user object
                const newUser = {
                    id: userConfig.users.length + 1,
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    role: 'user'
                };

                // Add to users array
                userConfig.users.push(newUser);

                // Store user session
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('userName', newUser.username);

                this.$emit('show-message', {
                    text: 'Sign up successful!',
                    type: 'success'
                });

                // Redirect to home page
                this.$router.push({ name: 'HomePage' });
            } catch (error) {
                console.error('Sign up error:', error);
                this.$emit('show-message', {
                    text: 'Sign up failed. Please try again.',
                    type: 'error'
                });
            }
        },
    },
};
</script>

<style scoped>
.container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    width: 100%;
    max-width: 400px;
    margin: 40px auto;
}

.tabs {
    display: flex;
    background: #f8f9fa;
}

.tab {
    flex: 1;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
    color: #666;
    transition: all 0.3s ease;
}

.tab.active {
    background: white;
    color: #2a5298;
    transition: all 0.3s ease;
}

.form-container {
    padding: 30px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
}

input {
    width: 89%;
    padding: 12px;
    border: 2px solid #e1e1e1;
    border-radius: 8px;
    font-size: 16px;
    margin: 5px;
    transition: border-color 0.3s ease;
}

input:focus {
    outline: none;
    border-color: #2a5298;
}

.button {
    width: 100%;
    padding: 14px;
    background: #2a5298;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
    margin-bottom: 5px;
}

.button:hover {
    background: #1e3c72;
}

.button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}

.error-message {
    color: #dc3545;
    font-size: 14px;
    margin-top: 5px;
}

.success-message {
    color: #28a745;
    text-align: center;
    margin-top: 10px;
}


.logo {
    text-align: center;
    margin-bottom: 20px;
}

.logo h1 {
    color: #2a5298;
    font-size: 24px;
    font-weight: bold;
}
</style>