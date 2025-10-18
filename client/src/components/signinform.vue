<script setup>
import { defineEmits, ref, onMounted, defineProps  } from 'vue'

const emit = defineEmits(['closelogin'])
const props = defineProps({ShowRegister: Boolean}) 
const visible = ref(false)
const invisible= ref(false)
onMounted(() => {
  if(props.ShowRegister)
{invisible.value = true}
else{visible.value = true}
  
})

const closeForm = () => {
 
  if (visible.value) visible.value = false


  if (invisible.value) invisible.value = false

  setTimeout(() => emit('closelogin'), 400)
}

const openloginForm = () =>{
   visible.value=false
 
    setTimeout(() => {
    invisible.value = true
  }, 200)
  
 
}
const opensigninForm = () =>{
   invisible.value=false
 
    setTimeout(() => {
    visible.value = true
  }, 200)
  
 
}

</script>

<template>
  <!-- Toàn bộ modal (nền + form) nằm trong transition -->
   <div>
  <transition name="slide">
   
    <div 
      v-if="visible"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div 
        class="bg-white w-[420px] p-6 rounded-2xl shadow-2xl relative transform border border-white/40"
      >
        <!-- Nút đóng -->
        <button 
          @click="closeForm" 
          class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl cursor-pointer"
        >
          ✕
        </button>

        <form class="space-y-6">
              <div class="mb-12">
                <h1 class="text-slate-900 text-3xl font-semibold">Sign in</h1>
                <p class="text-slate-600 text-[15px] mt-6 leading-relaxed">Sign in to your account and explore a world of possibilities. Your journey begins here.</p>
              </div>

              <div>
                <label class="text-slate-900 text-sm font-medium mb-2 block">User name</label>
                <div class="relative flex items-center">
                  <input name="username" type="text" required class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600" placeholder="Enter user name" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div>
                <label class="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                <div class="relative flex items-center">
                  <input name="password" type="password" required class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600" placeholder="Enter password" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                  <label for="remember-me" class="ml-3 block text-sm text-slate-900">
                    Remember me
                  </label>
                </div>
                <div class="text-sm">
                  <a href="jajvascript:void(0);" class="text-[#11cbd7] hover:underline font-medium">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div class="!mt-12">
                <button type="button" class="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-[#11cbd7] hover:bg-white hover:text-[#11cbd7] border border-[#11cbd7]  focus:outline-none cursor-pointer">
                  Sign in
                </button>
                <p  @click="openloginForm"  class="text-sm !mt-6 text-center text-slate-600">Don't have an account ? <a href="javascript:void(0);" class="text-[#11cbd7] font-medium hover:underline ml-1 whitespace-nowrap">Register here</a></p>
              </div>
            </form>
      </div>
    </div>
     </transition>
<!-- sigin ------------------------------------------------------------------------------------------------------------------------->
   <transition name="slide">
 <div 
      v-if="invisible"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div 
        class="bg-white w-[420px] p-6 rounded-2xl shadow-2xl relative transform border border-white/40"
      >
        <!-- Nút đóng -->
        <button 
          @click="closeForm" 
          class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl cursor-pointer"
        >
          ✕
        </button>

        <form class="space-y-6">
              <div class="mb-12">
                <h1 class="text-slate-900 text-3xl font-semibold">Register</h1>
                <p class="text-slate-600 text-[15px] mt-6 leading-relaxed">Sign in to your account and explore a world of possibilities. Your journey begins here.</p>
              </div>

              <div>
                <label class="text-slate-900 text-sm font-medium mb-2 block">User name</label>
                <div class="relative flex items-center">
                  <input name="username" type="text" required class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600" placeholder="Email/PhoneNumber" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
              <div>
                <label class="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                <div class="relative flex items-center">
                  <input name="password" type="password" required class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600" placeholder="Enter password" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>
                <div>
                <label class="text-slate-900 text-sm font-medium mb-2 block">RePassword</label>
                <div class="relative flex items-center">
                  <input name="password" type="password" required class="w-full text-sm text-slate-900 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600" placeholder="Enter password" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>

              <div class="!mt-12">
                <button type="button" class="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-[#11cbd7] hover:bg-white hover:text-[#11cbd7] border border-[#11cbd7]  focus:outline-none cursor-pointer">
                  Sign up
                </button>
                <p  @click="opensigninForm"  class="text-sm !mt-6 text-center text-slate-600">Do you have an account? <a href="javascript:void(0);" class="text-[#11cbd7] font-medium hover:underline ml-1 whitespace-nowrap">Login here</a></p>
              </div>
            </form>
      </div>
    </div>

   
  </transition>
   </div>
</template>

<style scoped>
/* --- Hiệu ứng slide (toàn bộ modal) --- */
.slide-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
