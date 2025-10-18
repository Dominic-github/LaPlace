<script setup >
import Img1 from '../assets/imgRoom/1.jpg'

const rooms =[  { id: 1, name: "Phòng Studio 1N1K", price: "2.500.000", size: "15m2", type: "Phòng trọ", img: Img1, address: "Hà Nội" },
  { id: 2, name: "Phòng nhỏ gọn gần trường", price: "1.800.000", size: "12m2", type: "Phòng trọ", img: Img1, address: "Đà Nẵng" },
  { id: 3, name: "Nhà nguyên căn 2 tầng", price: "5.500.000", size: "60m2", type: "Nhà nguyên căn", img: Img1, address: "TP HCM" },
  { id: 4, name: "Phòng trọ đầy đủ nội thất", price: "3.200.000", size: "18m2", type: "Phòng trọ", img: Img1, address: "Hà Nội" },
  { id: 5, name: "Phòng trọ giá rẻ", price: "1.500.000", size: "10m2", type: "Phòng trọ", img: Img1, address: "Hải Phòng" },
  { id: 6, name: "Căn hộ mini 1PN", price: "4.200.000", size: "25m2", type: "Căn hộ mini", img: Img1, address: "Đà Nẵng" },
  { id: 7, name: "Phòng tập thể", price: "1.000.000", size: "8m2", type: "Phòng trọ", img: Img1, address: "Hà Nội" },
  { id: 8, name: "Nhà nguyên căn gần trung tâm", price: "6.800.000", size: "80m2", type: "Nhà nguyên căn", img: Img1, address: "TP HCM" },
  { id: 9, name: "Phòng trọ có gác", price: "2.800.000", size: "20m2", type: "Phòng trọ", img: Img1, address: "Huế" },
  { id: 10, name: "Căn hộ dịch vụ 1PN", price: "5.000.000", size: "30m2", type: "Căn hộ dịch vụ", img: Img1, address: "Nha Trang" },
  { id: 11, name: "Phòng trọ gần bến xe", price: "2.000.000", size: "14m2", type: "Phòng trọ", img: Img1, address: "Cần Thơ" },
  { id: 12, name: "Nhà nguyên căn 3PN", price: "7.500.000", size: "100m2", type: "Nhà nguyên căn", img: Img1, address: "Đà Nẵng" },
  { id: 13, name: "Phòng đôi rộng rãi", price: "3.500.000", size: "22m2", type: "Phòng trọ", img: Img1, address: "Hà Nội" },
  { id: 14, name: "Phòng mini giá sinh viên", price: "1.200.000", size: "9m2", type: "Phòng trọ", img: Img1, address: "Thái Nguyên" },
  { id: 15, name: "Căn hộ mini full nội thất", price: "4.800.000", size: "28m2", type: "Căn hộ mini", img: Img1, address: "HCM" },
  { id: 16, name: "Phòng trọ có ban công", price: "2.900.000", size: "16m2", type: "Phòng trọ", img: Img1, address: "Số 586 Kim Giang" },

]


</script>
<template>
    <body>
         <div class="flex flex-col w-350 mx-auto my-20 rounded-md shadow-md bg-white "> 
        <H2 class="p-3 font-bold text-4xl mx-4 my-5 text-white bg-[#11cbd7] w-fit rounded-md">PHÒNG TRỌ NỔI BẬT</H2>
        <div  class="flex flex-wrap justify-center gap-7 ">
              <div v-for="room in rooms" :key="room.id" class="rounded-md shadow p-3 bg-white">
        <div class=" w-61 h-fit">
        <img :src="room.img"  class="w-61 h-45 rounded-md ">
        <div class="font-semibold h-6 truncate">{{ room.name }}</div>
       <div class=" flex ">  <div class="font-extrabold text-[#11cbd7]">{{room.price}}</div><div class="font-extrabold text-[#11cbd7]"> ₫</div></div>
        <div class=" flex ">   <div class="bg-[#f4f4f4] w-fit font-medium text-xs p-1">{{room.type}}</div> <div class="bg-[#f4f4f4] w-fit mx-2 font-medium text-xs p-1">{{room.size}}</div>
    </div>
      <div class="flex items-center gap-2">
  <img src="../assets/location.png" alt="location" class="w-4 h-4">
  <span class="text-xs">{{ room.address }}</span>
</div></div></div>
</div>
<a href="/#"
      class="m-5 w-fit  px-4 py-2 border border-[#11cbd7] text-[#11cbd7] rounded 
         hover:bg-[#11cbd7] hover:text-white 
         font-medium transition-colors duration-200"
   >
        Xem thêm
      </a>
</div>




    <div class="flex flex-col w-350 mx-auto my-20 rounded-md shadow-md bg-white"> 
        <H2 class="p-3 font-bold text-4xl mx-4 my-5 text-white bg-[#11cbd7] w-fit rounded-md">PHÒNG TRỌ NỔI BẬT</H2>
        <div  class="flex flex-wrap justify-center gap-7 ">
              <div v-for="room in rooms" :key="room.id" class="rounded-md shadow p-3 bg-white">
        <div class=" w-61 h-fit">
        <img :src="room.img"  class="w-61 h-45 rounded-md ">
        <div class="font-semibold h-6 truncate">{{ room.name }}</div>
       <div class=" flex ">  <div class="font-extrabold text-[#11cbd7]">{{room.price}}</div><div class="font-extrabold text-[#11cbd7]"> ₫</div></div>
        <div class=" flex ">   <div class="bg-[#f4f4f4] w-fit font-medium text-xs p-1">{{room.type}}</div> <div class="bg-[#f4f4f4] w-fit mx-2 font-medium text-xs p-1">{{room.size}}</div>
    </div>
      <div class="flex items-center gap-2">
  <img src="../assets/location.png" alt="location" class="w-4 h-4">
  <span class="text-xs">{{ room.address }}</span>
</div></div></div>
</div>
</div>
    </body>
 


</template>