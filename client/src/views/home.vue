<script setup>
import Slide from '../components/slide.vue'
import Navbar from '../components/navbar.vue'
import Banner from '../components/banner.vue'
import ReviewRoom from '../components/reviewRoom.vue';
import Footers  from '../components/footers.vue';
import loginform from '../components/signinform.vue';
import { ref } from 'vue';
 const showloginform = ref(false)
const ShowRegister = ref(false)
</script>

<template>
   <body class="bg-[#ffebd6]">
    
       <Navbar @openlogin="showloginform = true; ShowRegister = false"    @openregister="showloginform = true; ShowRegister = true"/>
       <Banner/>
       <Slide/> 
       <ReviewRoom/>
       <Footers/>
         <loginform v-if="showloginform"  :ShowRegister="ShowRegister" @closelogin="showloginform=false"/>
   </body>
</template>