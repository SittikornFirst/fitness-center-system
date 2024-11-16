<template>
    <form class="signin-form" @submit.prevent="handleSignIn">
        <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" required placeholder="Enter your email" />
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" required placeholder="Enter your password" />
        </div>
        <button type="submit" class="button">Sign In</button>
    </form>
</template>

<script>
import { login } from '@/auth';

export default {
    name: 'SignInForm',
    data() {
        return {
            email: '',
            password: '',
            error: null
        };
    },
    methods: {
        async handleSignIn() {
            try {
                const user = login(this.email, this.password);
                
                if (!user) {
                    this.$emit('show-message', { 
                        text: 'Invalid email or password.', 
                        type: 'error' 
                    });
                    return;
                }

                // Store necessary information
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userName', user.name);

                this.$emit('show-message', { 
                    text: 'Sign in successful!', 
                    type: 'success' 
                });

                // Navigate to home page
                this.$router.push({ name: 'HomePage' });
            } catch (error) {
                console.error('Sign in error:', error);
                this.$emit('show-message', { 
                    text: 'An error occurred. Please try again.', 
                    type: 'error' 
                });
            }
        }
    }
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
    color:black ;
}

input:focus {
    outline: none;
    border-color: #2a5298;
    color:black ;
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