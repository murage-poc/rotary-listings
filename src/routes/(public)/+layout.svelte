<script lang="ts">
  let { children } = $props();
  // Simple globe SVG for user controls
  const globeIcon = `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-5 h-5'><circle cx='12' cy='12' r='9' stroke='currentColor' stroke-width='1.5'/><path stroke='currentColor' stroke-width='1.5' d='M2.5 12h19M12 2.5c2.5 2.5 2.5 16.5 0 19M12 2.5c-2.5 2.5-2.5 16.5 0 19'/></svg>`;
</script>

<header class="w-full bg-white sticky top-0 z-30">
  <div class="max-w-7xl mx-auto flex flex-col gap-0 px-6 pt-6 pb-2">
    <!-- Top nav: logo, nav links, user controls -->
    <div class="flex items-center justify-between w-full mb-4">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">A</div>
        <span class="font-bold text-xl tracking-tight text-gray-800">airbnb</span>
      </div>
      <!-- Navigation Links -->
      <nav class="hidden md:flex gap-8 text-gray-700 font-light text-[16px]">
        <button class="hover:text-black">Stays</button>
        <button class="hover:text-black">Experiences</button>
        <button class="hover:text-black">Online Experiences</button>
      </nav>
      <!-- User Controls -->
      <div class="flex items-center gap-4 ml-6">
        <button class="text-gray-700 hover:text-black font-light hidden md:inline text-[16px]">Airbnb your home</button>
        <button class="p-2 rounded-full hover:bg-gray-100" aria-label="Favorites">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
        <button class="p-2 rounded-full hover:bg-gray-100" aria-label="User profile">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </button>
      </div>
    </div>
    <!-- Search Bar -->
    <div class="flex justify-center w-full relative z-10">
      <form class="relative w-full max-w-2xl">
        <div class="relative flex bg-white rounded-full shadow-lg overflow-hidden h-16 items-center divide-x divide-gray-200 border border-gray-200">
          <button type="button" class="w-48 pl-8 py-3 bg-transparent focus:outline-none flex flex-col items-start justify-center text-left">
            <span class="text-[15px] font-semibold text-gray-700 leading-tight">Where</span>
            <span class="text-xs text-gray-400 leading-tight">Search destinations</span>
          </button>
          <button type="button" class="w-40 px-8 py-3 bg-transparent focus:outline-none flex flex-col items-start justify-center text-left">
            <span class="text-[15px] font-semibold text-gray-700 leading-tight">Check in</span>
            <span class="text-xs text-gray-400 leading-tight">Add dates</span>
          </button>
          <button type="button" class="w-40 px-8 py-3 bg-transparent focus:outline-none flex flex-col items-start justify-center text-left">
            <span class="text-[15px] font-semibold text-gray-700 leading-tight">Check out</span>
            <span class="text-xs text-gray-400 leading-tight">Add dates</span>
          </button>
          <button type="button" class="w-48 pl-8 pr-16 py-3 bg-transparent focus:outline-none flex flex-col items-start justify-center text-left">
            <span class="text-[15px] font-semibold text-gray-700 leading-tight">Who</span>
            <span class="text-xs text-gray-400 leading-tight">Add guests</span>
          </button>
          <button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg w-8 h-8 flex items-center justify-center focus:outline-none z-20" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</header>

<main class="bg-[#f7f7fa] min-h-screen">
  {@render children()}
</main> 