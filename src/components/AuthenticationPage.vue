<template>
  <div class="container">
    <div class="tabs">
      <div class="tab" :class="{ active: activeTab === 'signin' }" @click="activeTab = 'signin'">
        Sign In
      </div>
      <div class="tab" :class="{ active: activeTab === 'signup' }" @click="activeTab = 'signup'">
        Sign Up
      </div>
    </div>

    <div class="form-container">
      <div class="logo">
        <h1>FITNESS CENTER SYSTEM</h1>
      </div>

      <SignInForm v-if="activeTab === 'signin'" @sign-in-success="redirectToHome" @show-message="showMessage" />
      <SignUpForm v-if="activeTab === 'signup'" @sign-up-success="redirectToHome" @show-message="showMessage" />

      <div v-if="message" :class="['success-message', { 'error-message': message.type === 'error' }]">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import SignInForm from './layout/SignInForm.vue';
import SignUpForm from './layout/SignUpForm.vue';

export default {
  name: 'AuthenticationPage',
  components: {
    SignInForm,
    SignUpForm,
  },
  data() {
    return {
      activeTab: 'signin',
      message: null,
    };
  },
  methods: {
    redirectToHome() {
      this.$router.push('/home');
    },
    showMessage(message) {
      this.message = message;
      setTimeout(() => {
        this.message = null;
      }, 5000);
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

.button#google {
  background: white;
  color: #2a5298;
}

.button:hover {
  background: #1e3c72;
}

.button#google:hover {
  background: rgb(237, 237, 237);
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

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.form-footer a {
  color: #2a5298;
  text-decoration: none;
  font-weight: 500;
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