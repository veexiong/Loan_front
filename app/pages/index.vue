<template>
  <div class="login-root">
    <!-- Animated Background Orbs -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>

    <!-- Floating Particles -->
    <div class="particles">
      <span v-for="i in 18" :key="i" class="particle" :style="particleStyle(i)"></span>
    </div>

    <!-- Login Card -->
    <div class="login-wrapper">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M12 7v10M7 9.5l5 2.5 5-2.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="logo-title">LoanPro</h1>
        <p class="logo-subtitle">ລະບົບຈັດການເງິນກູ້ ແລະ ບັນຊີ</p>
      </div>

      <!-- Glass Card -->
      <div class="glass-card">
        <div class="card-header">
          <h2 class="card-title">ຍິນດີຕ້ອນຮັບກັບຄືນ 👋</h2>
          <p class="card-desc">ເຂົ້າສູ່ລະບົບດ້ວຍຂໍ້ມູນຂອງທ່ານ</p>
        </div>

        <!-- Phone Input -->
        <div class="field-group" :class="{ focused: focusTel, filled: form.user_tel }">
          <label class="field-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            ເບີໂທລະສັບ
          </label>
          <input
            v-model="form.user_tel"
            type="text"
            class="field-input"
            placeholder="020 XX XXX XXX"
            @focus="focusTel = true"
            @blur="focusTel = false"
            @keyup.enter="handleLogin"
          />
        </div>

        <!-- Password Input -->
        <div class="field-group" :class="{ focused: focusPwd, filled: form.password }">
          <label class="field-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            ລະຫັດຜ່ານ
          </label>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="field-input"
            placeholder="••••••••"
            @focus="focusPwd = true"
            @blur="focusPwd = false"
            @keyup.enter="handleLogin"
          />
          <button type="button" class="eye-toggle" @click="showPassword = !showPassword" tabindex="-1">
            <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg>
          </button>
        </div>

        <!-- Error Message -->
        <transition name="slide-up">
          <div v-if="error" class="error-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            {{ error }}
          </div>
        </transition>

        <!-- Login Button -->
        <button class="login-btn" @click="handleLogin" :disabled="loading">
          <span v-if="!loading">ເຂົ້າສູ່ລະບົບ</span>
          <span v-else class="btn-loader">
            <span class="spinner"></span>
            ກຳລັງເຂົ້າລະບົບ...
          </span>
        </button>

        <!-- Register Link -->
        <p class="register-link">
          ຍັງບໍ່ມີບັນຊີ?
          <NuxtLink to="/register" class="link-text">ສ້າງບັນຊີໃໝ່</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

const router = useRouter()
const form = ref({ user_tel: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const focusTel = ref(false)
const focusPwd = ref(false)

let api = null

onMounted(() => {
  const nuxtApp = useNuxtApp()
  api = nuxtApp.$api || nuxtApp.api
})

const particleStyle = (i) => {
  const size = Math.random() * 4 + 2
  return {
    width: size + 'px',
    height: size + 'px',
    left: (i * 5.5) + '%',
    animationDuration: (Math.random() * 10 + 8) + 's',
    animationDelay: (Math.random() * 5) + 's',
    opacity: Math.random() * 0.5 + 0.1
  }
}

const handleLogin = async () => {
  if (!api) { error.value = 'API ຍັງບໍ່ພ້ອມ'; return }
  loading.value = true
  error.value = ''
  try {
    const res = await api.post('/auth/login', {
      user_tel: form.value.user_tel.trim(),
      password: form.value.password
    })
    if (res.data.status === '00' && res.data.user?.token) {
      localStorage.setItem('token', res.data.user.token)
      localStorage.setItem('user_name', res.data.user.user_name)
      router.push('/dashboard')
    } else {
      error.value = res.data.message || 'ບໍ່ສາມາດເຂົ້າລະບົບໄດ້'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'ເບີໂທ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.login-root {
  min-height: 100vh;
  background: linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Noto Sans Lao', 'Inter', sans-serif;
}

/* Animated background orbs */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  animation: orbFloat 15s ease-in-out infinite alternate;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
  top: -150px; left: -100px;
  animation-duration: 14s;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
  bottom: -120px; right: -80px;
  animation-duration: 10s; animation-direction: alternate-reverse;
}
.orb-3 {
  width: 450px; height: 450px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
  top: 40%; left: 50%;
  animation-duration: 18s;
}
@keyframes orbFloat {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(30px, -40px) scale(1.1); }
}

/* Floating particles */
.particles { position: absolute; inset: 0; pointer-events: none; }
.particle {
  position: absolute;
  background: rgba(167, 139, 250, 0.6);
  border-radius: 50%;
  bottom: -10px;
  animation: particleRise linear infinite;
}
@keyframes particleRise {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 0.3; }
  100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
}

/* Login wrapper */
.login-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

/* Logo section */
.logo-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.logo-icon {
  width: 70px; height: 70px;
  background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.5), 0 0 80px rgba(99, 102, 241, 0.2);
  animation: logoPulse 3s ease-in-out infinite;
}
@keyframes logoPulse {
  0%, 100% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.5), 0 0 60px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 50px rgba(99, 102, 241, 0.8), 0 0 100px rgba(99, 102, 241, 0.3); }
}
.logo-title {
  font-size: 28px;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #a5b4fc, #67e8f9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.logo-subtitle {
  font-size: 13px;
  color: rgba(167, 139, 250, 0.8);
  font-weight: 400;
}

/* Glass Card */
.glass-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);
}

.card-header { margin-bottom: 28px; }
.card-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
}
.card-desc {
  font-size: 14px;
  color: rgba(148, 163, 184, 0.9);
}

/* Field groups */
.field-group {
  position: relative;
  margin-bottom: 18px;
  transition: all 0.2s ease;
}
.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.8);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.2s;
}
.field-group.focused .field-label { color: #a5b4fc; }

.field-input {
  width: 100%;
  padding: 14px 46px 14px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-family: 'Noto Sans Lao', 'Inter', sans-serif;
  outline: none;
  transition: all 0.25s ease;
}
.field-input::placeholder { color: rgba(148, 163, 184, 0.5); }
.field-input:focus {
  border-color: rgba(99, 102, 241, 0.7);
  background: rgba(99, 102, 241, 0.08);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.eye-toggle {
  position: absolute;
  right: 14px;
  bottom: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(148, 163, 184, 0.6);
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
}
.eye-toggle:hover { color: #a5b4fc; }

/* Error */
.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #fca5a5;
  margin-bottom: 16px;
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-4px); }

/* Login button */
.login-btn {
  width: 100%;
  padding: 15px;
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Noto Sans Lao', 'Inter', sans-serif;
  color: white;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%);
  background-size: 200% 200%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}
.login-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.5s ease;
}
.login-btn:hover::before { left: 100%; }
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.6);
}
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-loader { display: flex; align-items: center; justify-content: center; gap: 10px; }
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Register link */
.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: rgba(148, 163, 184, 0.7);
}
.link-text {
  color: #a5b4fc;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
  transition: color 0.2s;
}
.link-text:hover { color: #c4b5fd; text-decoration: underline; }
</style>
