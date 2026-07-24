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

    <!-- Register Card -->
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
        <p class="logo-subtitle">ສ້າງບັນຊີຜູ້ໃຊ້ໃໝ່</p>
      </div>

      <!-- Glass Card -->
      <div class="glass-card">
        <div class="card-header">
          <h2 class="card-title">ສ້າງບັນຊີ 🚀</h2>
          <p class="card-desc">ກະລຸນາປ້ອນຂໍ້ມູນຂອງທ່ານໃຫ້ຄົບຖ້ວນ</p>
        </div>

        <form @submit.prevent="submitRegister">
          <!-- Full Name -->
          <div class="field-group" :class="{ focused: focusName, filled: form.user_name }">
            <label class="field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
              ຊື່ ແລະ ນາມສະກຸນ
            </label>
            <input v-model="form.user_name" type="text" class="field-input" placeholder="ທ່ານ ສົມໃຈ ດີລາວ"
              @focus="focusName=true" @blur="focusName=false" required />
          </div>

          <!-- Phone -->
          <div class="field-group" :class="{ focused: focusTel, filled: form.user_tel }">
            <label class="field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              ເບີໂທລະສັບ
            </label>
            <input v-model="form.user_tel" type="text" class="field-input" placeholder="020 XX XXX XXX"
              @focus="focusTel=true" @blur="focusTel=false" required />
          </div>

          <!-- Address -->
          <div class="field-group" :class="{ focused: focusAddr, filled: form.user_address }">
            <label class="field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              ທີ່ຢູ່
            </label>
            <textarea v-model="form.user_address" class="field-input field-textarea" placeholder="ບ້ານ, ເມືອງ, ແຂວງ..."
              @focus="focusAddr=true" @blur="focusAddr=false" rows="2" required></textarea>
          </div>

          <!-- Password -->
          <div class="field-group" :class="{ focused: focusPwd, filled: form.password }">
            <label class="field-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              ລະຫັດຜ່ານ (ຢ່າງໜ້ອຍ 4 ຕົວ)
            </label>
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="field-input"
              placeholder="••••••••" @focus="focusPwd=true" @blur="focusPwd=false" required />
            <button type="button" class="eye-toggle" @click="showPassword = !showPassword" tabindex="-1">
              <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg>
            </button>
          </div>

          <!-- Messages -->
          <transition name="slide-up">
            <div v-if="error" class="error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {{ error }}
            </div>
          </transition>
          <transition name="slide-up">
            <div v-if="success" class="success-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              ສ້າງບັນຊີສຳເລັດ! ກຳລັງນຳທາງ...
            </div>
          </transition>

          <!-- Submit Button -->
          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="!loading">ສ້າງບັນຊີ</span>
            <span v-else class="btn-loader">
              <span class="spinner"></span>
              ກຳລັງບັນທຶກ...
            </span>
          </button>
        </form>

        <p class="register-link">
          ມີບັນຊີຢູ່ແລ້ວ?
          <NuxtLink to="/" class="link-text">ເຂົ້າສູ່ລະບົບ</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ user_name: '', user_tel: '', user_address: '', password: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPassword = ref(false)
const focusName = ref(false)
const focusTel = ref(false)
const focusAddr = ref(false)
const focusPwd = ref(false)

const particleStyle = (i: number) => ({
  width: (Math.random() * 4 + 2) + 'px',
  height: (Math.random() * 4 + 2) + 'px',
  left: (i * 5.5) + '%',
  animationDuration: (Math.random() * 10 + 8) + 's',
  animationDelay: (Math.random() * 5) + 's',
  opacity: Math.random() * 0.5 + 0.1
})

const submitRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  const config = useRuntimeConfig()
  try {
    await $fetch(`${config.public.apiBase}/auth/register`, { method: 'POST', body: form.value })
    success.value = true
    setTimeout(() => router.push('/'), 1500)
  } catch (err: any) {
    error.value = err?.data?.message || 'ສ້າງບັນຊີບໍ່ສຳເລັດ'
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
  padding: 40px 0;
}

.bg-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; animation: orbFloat 15s ease-in-out infinite alternate; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(99,102,241,.4) 0%, transparent 70%); top: -150px; left: -100px; animation-duration: 14s; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(14,165,233,.3) 0%, transparent 70%); bottom: -120px; right: -80px; animation-duration: 10s; animation-direction: alternate-reverse; }
.orb-3 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(139,92,246,.25) 0%, transparent 70%); top: 40%; left: 50%; animation-duration: 18s; }
@keyframes orbFloat { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-40px) scale(1.1); } }

.particles { position: absolute; inset: 0; pointer-events: none; }
.particle { position: absolute; background: rgba(167,139,250,.6); border-radius: 50%; bottom: -10px; animation: particleRise linear infinite; }
@keyframes particleRise { 0% { transform: translateY(0) scale(1); opacity: 0; } 10% { opacity: 1; } 90% { opacity: .3; } 100% { transform: translateY(-100vh) scale(.3); opacity: 0; } }

.login-wrapper { position: relative; z-index: 10; width: 100%; max-width: 440px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; }

.logo-section { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.logo-icon { width: 70px; height: 70px; background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); border-radius: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 40px rgba(99,102,241,.5); animation: logoPulse 3s ease-in-out infinite; }
@keyframes logoPulse { 0%,100% { box-shadow: 0 0 30px rgba(99,102,241,.5); } 50% { box-shadow: 0 0 50px rgba(99,102,241,.8); } }
.logo-title { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #a5b4fc, #67e8f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.logo-subtitle { font-size: 13px; color: rgba(167,139,250,.8); }

.glass-card { width: 100%; background: rgba(255,255,255,.05); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,.12); border-radius: 24px; padding: 32px 32px; box-shadow: 0 25px 50px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.1); }

.card-header { margin-bottom: 24px; }
.card-title { font-size: 22px; font-weight: 700; color: white; margin-bottom: 6px; }
.card-desc { font-size: 13px; color: rgba(148,163,184,.9); }

.field-group { position: relative; margin-bottom: 16px; }
.field-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: rgba(148,163,184,.8); margin-bottom: 7px; text-transform: uppercase; letter-spacing: .5px; transition: color .2s; }
.field-group.focused .field-label { color: #a5b4fc; }

.field-input { width: 100%; padding: 13px 44px 13px 16px; background: rgba(255,255,255,.06); border: 1.5px solid rgba(255,255,255,.1); border-radius: 12px; color: white; font-size: 14px; font-family: 'Noto Sans Lao','Inter',sans-serif; outline: none; transition: all .25s ease; }
.field-textarea { resize: none; }
.field-input::placeholder { color: rgba(148,163,184,.5); }
.field-input:focus { border-color: rgba(99,102,241,.7); background: rgba(99,102,241,.08); box-shadow: 0 0 0 3px rgba(99,102,241,.15); }

.eye-toggle { position: absolute; right: 14px; bottom: 13px; background: none; border: none; cursor: pointer; color: rgba(148,163,184,.6); display: flex; align-items: center; padding: 0; transition: color .2s; }
.eye-toggle:hover { color: #a5b4fc; }

.error-box { display: flex; align-items: center; gap: 8px; background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.3); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #fca5a5; margin-bottom: 12px; }
.success-box { display: flex; align-items: center; gap: 8px; background: rgba(16,185,129,.12); border: 1px solid rgba(16,185,129,.3); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #6ee7b7; margin-bottom: 12px; }

.slide-up-enter-active, .slide-up-leave-active { transition: all .3s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-4px); }

.login-btn { width: 100%; padding: 14px; margin-top: 4px; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; font-family: 'Noto Sans Lao','Inter',sans-serif; color: white; cursor: pointer; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #06b6d4 100%); transition: all .3s ease; position: relative; overflow: hidden; box-shadow: 0 4px 20px rgba(99,102,241,.4); }
.login-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent); transition: left .5s ease; }
.login-btn:hover::before { left: 100%; }
.login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,.6); }
.login-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }

.btn-loader { display: flex; align-items: center; justify-content: center; gap: 10px; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: white; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.register-link { text-align: center; margin-top: 18px; font-size: 13px; color: rgba(148,163,184,.7); }
.link-text { color: #a5b4fc; font-weight: 600; text-decoration: none; margin-left: 4px; transition: color .2s; }
.link-text:hover { color: #c4b5fd; text-decoration: underline; }
</style>
