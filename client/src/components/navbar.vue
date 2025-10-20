<script setup>
import { ref } from 'vue'
import loginLogo from '../assets/login.png'
import loginHover from '../assets/login-hover.png'
import signinLogo from '../assets/signin.png'
import signinHover from '../assets/signin-hover.png'

const hoverLogoLG = ref(false)
const hoverLogoSI = ref(false)

const emit = defineEmits()

const toggleHoverLogoLG = () => {
  hoverLogoLG.value = !hoverLogoLG.value
}
const toggleHoverLogoSI = () => {
  hoverLogoSI.value = !hoverLogoSI.value
}

const handleOpenLogin = () => {
  emit('openlogin')
}

const handleOpenRegister = () => {
  emit('openregister')
}
</script>
<template>
  <nav
    class="bg-white shadow-md px-6 py-3 flex items-center justify-center gap-40"
  >
    <div class="text-2xl font-bold text-[#11cbd7]">LaSpace</div>
    <div class="flex space-x-6">
      <a href="/" class="font-medium hover:text-[#11cbd7]">Trang chủ</a>
      <a href="/phong-tro" class="font-medium hover:text-[#11cbd7]"
        >Phòng trọ</a
      >
      <a href="/nha-nguyen-can" class="font-medium hover:text-[#11cbd7]"
        >Nhà nguyên căn</a
      >
      <a href="/can-ho" class="font-medium hover:text-[#11cbd7]">Căn hộ</a>
      <a href="/review" class="font-medium hover:text-[#11cbd7]">Review</a>
      <a href="/blog" class="font-medium hover:text-[#11cbd7]">Blog</a>
    </div>
    <div class="flex items-center space-x-3">
      <button
        class="px-4 py-2 bg-[#11cbd7] text-white font-medium border border-transparent rounded hover:bg-white hover:text-[#11cbd7] hover:border-[#11cbd7] duration-200 cursor-pointer"
      >
        Đăng tin
      </button>
      <a
        href="/#"
        @click.prevent="handleOpenLogin"
        @mouseover="toggleHoverLogoLG"
        @mouseout="toggleHoverLogoLG"
        class="flex items-center gap-2 px-4 py-2 border border-[#11cbd7] text-[#11cbd7] rounded hover:bg-[#11cbd7] hover:text-white font-medium transition-colors duration-200 cursor-pointer"
      >
        <img
          :src="!hoverLogoLG ? loginLogo : loginHover"
          alt="login"
          class="w-5 h-5"
        />
        Đăng nhập
      </a>

      <button
        @click.prevent="handleOpenRegister"
        @mouseover="toggleHoverLogoSI"
        @mouseout="toggleHoverLogoSI"
        class="flex items-center gap-2 px-4 py-2 border border-[#11cbd7] text-[#11cbd7] rounded hover:bg-[#11cbd7] hover:text-white font-medium transition-colors duration-200 cursor-pointer"
      >
        <img
          :src="!hoverLogoSI ? signinLogo : signinHover"
          alt="SignIn"
          class="w-5 h-5"
        />
        Đăng kí
      </button>
    </div>
  </nav>
</template>
