<script lang="ts">
  import '../../app.css';
  let { children } = $props();
</script>

<header class="w-full border-b bg-white sticky top-0 z-30">
  <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <!-- TODO: Replace with Airbnb SVG logo -->
      <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">A</div>
      <span class="font-bold text-xl tracking-tight text-gray-800">airbnb</span>
    </div>
    <!-- Navigation Links -->
    <nav class="hidden md:flex gap-6 text-gray-700 font-medium">
      <a href="#" class="hover:text-black">Stays</a>
      <a href="#" class="hover:text-black">Experiences</a>
      <a href="#" class="hover:text-black">Online Experiences</a>
    </nav>
    <!-- Search Bar -->
    <div class="flex-1 flex justify-center">
      <div class="flex bg-white border rounded-full shadow-sm overflow-hidden w-full max-w-xl">
        <input class="px-4 py-2 w-32 focus:outline-none" placeholder="Where" />
        <input class="px-4 py-2 w-28 focus:outline-none border-l" placeholder="Check in" />
        <input class="px-4 py-2 w-28 focus:outline-none border-l" placeholder="Check out" />
        <input class="px-4 py-2 w-24 focus:outline-none border-l" placeholder="Who" />
        <button class="bg-rose-500 text-white px-4 py-2 flex items-center justify-center border-l">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
      </div>
    </div>
    <!-- User Controls -->
    <div class="flex items-center gap-4 ml-6">
      <a href="#" class="text-gray-700 hover:text-black font-medium hidden md:inline">Airbnb your home</a>
      <button class="p-2 rounded-full hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <!-- TODO: Add user avatar/profile dropdown -->
      <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
</header>

<main class="bg-gray-50 min-h-screen">
  {@render children()}
</main> 