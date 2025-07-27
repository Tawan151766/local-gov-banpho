// UI logic for navigation, sliders, tabs, voting, etc. (modularized for React)
// --- NAVIGATION & MENU ---
export function toggleLangDropdown() {
  const dropdown = document.getElementById("langDropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

export function scrollServices(direction) {
  const grid = document.getElementById("servicesGrid");
  const scrollAmount = 300;
  if (!grid) return;
  if (direction === "left") {
    grid.scrollLeft -= scrollAmount;
  } else {
    grid.scrollLeft += scrollAmount;
  }
}

// --- MEDIA & VIDEO CONTROLS ---
export function changeVideo(direction) {
  const dots = document.querySelectorAll(".video-dot");
  const videoPlayer = document.querySelector(".video-player");
  let currentActive = 0;
  dots.forEach((dot, index) => {
    if (dot.classList.contains("active")) {
      currentActive = index;
      dot.classList.remove("active");
    }
  });
  if (direction === "next") {
    currentActive = (currentActive + 1) % dots.length;
  } else {
    currentActive = (currentActive - 1 + dots.length) % dots.length;
  }
  const newVideoUrl = dots[currentActive].dataset.video;
  dots[currentActive].classList.add("active");
  if (videoPlayer) videoPlayer.src = newVideoUrl;
}

export function selectVideo(index) {
  const dots = document.querySelectorAll(".video-dot");
  const videoPlayer = document.querySelector(".video-player");
  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[index]) dots[index].classList.add("active");
  const newVideoUrl = dots[index]?.dataset.video;
  if (videoPlayer && newVideoUrl) videoPlayer.src = newVideoUrl;
}

export function changeContact(direction) {
  // Placeholder for contact sliding
  // Implement as needed
}

// --- TAB MANAGEMENT ---
export function switchTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });
  if (tabName === "activities") {
    document.getElementById("activitiesContent")?.classList.remove("hidden");
    document.querySelector(".tab-btn:first-child")?.classList.add("active");
  } else if (tabName === "news") {
    document.getElementById("newsContent")?.classList.remove("hidden");
    document.querySelector(".tab-btn:last-child")?.classList.add("active");
  }
}

export function switchECPTab(tabName, event) {
  document.querySelectorAll(".ecp-tab").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (event && event.target) event.target.classList.add("active");
}

export function switchRightTab(tabName) {
  document.querySelectorAll(".right-tab").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".right-tab-content").forEach((content) => {
    content.classList.add("hidden");
  });
  if (tabName === "local") {
    document.getElementById("localContent")?.classList.remove("hidden");
    document.querySelector(".right-tab:first-child")?.classList.add("active");
  } else if (tabName === "promotion") {
    document.getElementById("promotionContent")?.classList.remove("hidden");
    document.querySelector(".right-tab:last-child")?.classList.add("active");
  }
}

// --- SURVEY & VOTING SYSTEM ---
export function submitVote() {
  const checkedOptions = document.querySelectorAll('input[name="opinion"]:checked');
  if (checkedOptions.length === 0) {
    alert("กรุณาเลือกความคิดเห็นอย่างน้อย 1 ข้อ");
    return;
  }
  const selectedValues = Array.from(checkedOptions).map((option) => option.value);
  alert("ขอบคุณสำหรับความคิดเห็นของท่าน\nตัวเลือกที่เลือก: " + selectedValues.join(", "));
  checkedOptions.forEach((option) => {
    option.checked = false;
  });
}

// --- SIDEBAR & SCROLLING ---
export function scrollSidebar(direction) {
  const sidebar = document.getElementById("sidebarContent");
  const scrollAmount = 100;
  if (!sidebar) return;
  if (direction === "up") {
    sidebar.scrollTop -= scrollAmount;
  } else {
    sidebar.scrollTop += scrollAmount;
  }
}

// --- PROMOTIONAL BANNERS ---
export function closePromoBanner() {
  const banner = document.getElementById("promoBanner");
  if (banner) banner.style.display = "none";
}

export function handlePromoImageUpload() {
  const banner = document.getElementById("promoBanner");
  if (!banner) return;
  const placeholder = banner.querySelector(".upload-placeholder");
  if (placeholder) {
    placeholder.innerHTML = `
      <div class="upload-icon">🖼️</div>
      <p>รูปภาพถูกเลือกแล้ว</p>
      <p class="upload-subtitle">ทองผาภูมิ</p>
    `;
  }
}

// --- TOURISM SLIDER ---
let currentTourismSlide = 0;
export function showTourismSlide(index) {
  const slider = document.getElementById("tourismSlider");
  const dots = document.querySelectorAll(".tourism-dot");
  const slideWidth = 400;
  dots.forEach((dot) => dot.classList.remove("active"));
  if (dots[index]) dots[index].classList.add("active");
  if (slider) slider.scrollLeft = index * slideWidth;
  currentTourismSlide = index;
}

export function initTourismSlider() {
  const slider = document.getElementById("tourismSlider");
  if (!slider) return;
  let isDown = false;
  let startX;
  let scrollLeft;
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });
  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener("touchmove", (e) => {
    if (!startX) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
}

// --- MAP & LOCATION FILTERING ---
export function filterPlaces(type, event) {
  document.querySelectorAll(".map-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (event && event.target) {
    event.target.closest(".map-btn")?.classList.add("active");
  }
  // Add logic to highlight specific places on the map as needed
}
