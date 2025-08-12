const countdown = () => {
    const countDate = new Date('August 13, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const gap = countDate - now;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const textDay = Math.floor(gap / day);
    const textHour = Math.floor((gap % day) / hour);
    const textMinute = Math.floor((gap % hour) / minute);
    const textSecond = Math.floor((gap % minute) / second);

    document.getElementById('days').innerText = textDay.toString().padStart(2, '0');
    document.getElementById('hours').innerText = textHour.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = textMinute.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = textSecond.toString().padStart(2, '0');
};

setInterval(countdown, 1000);
countdown();

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

let currentGallery = 0;
let currentCategory = 'highlight';
const allGalleryItems = document.querySelectorAll('.gallery-item');
let visibleGalleryItems = [];
const galleryWrapper = document.getElementById('galleryWrapper');
const galleryDotsContainer = document.getElementById('galleryDots');
let isTransitioning = false;

function cloneGalleryItems() {
    const existingClones = galleryWrapper.querySelectorAll('.gallery-item-clone');
    existingClones.forEach(clone => clone.remove());
    
    if (visibleGalleryItems.length > 1) {
        const firstClone = visibleGalleryItems[0].cloneNode(true);
        firstClone.classList.add('gallery-item-clone');
        galleryWrapper.appendChild(firstClone);
        
        const lastClone = visibleGalleryItems[visibleGalleryItems.length - 1].cloneNode(true);
        lastClone.classList.add('gallery-item-clone');
        galleryWrapper.insertBefore(lastClone, galleryWrapper.firstChild);
    }
}

function updateGalleryItems() {
    visibleGalleryItems = Array.from(allGalleryItems).filter(item => 
        item.dataset.category === currentCategory
    );
    
    allGalleryItems.forEach(item => {
        if (visibleGalleryItems.includes(item)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    cloneGalleryItems();
    
    currentGallery = 0;
    updateGalleryDots();
    updateGallery();
    
    if (currentCategory === 'highlight') {
        handleVideoAutoplay();
    } else {
        pauseAllVideos();
    }
}

function updateGalleryDots() {
    galleryDotsContainer.innerHTML = '';
    visibleGalleryItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === currentGallery) dot.classList.add('active');
        dot.addEventListener('click', () => goToGallery(index));
        galleryDotsContainer.appendChild(dot);
    });
}

function updateGallery() {
    if (isTransitioning) return;
    
    const offset = visibleGalleryItems.length > 1 ? 1 : 0;
    const translateX = -(currentGallery + offset) * 100;
    galleryWrapper.style.transform = `translateX(${translateX}%)`;
    
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentGallery);
    });
    
    if (currentCategory === 'highlight') {
        handleVideoAutoplay();
    }
}

function goToGallery(index) {
    if (isTransitioning) return;
    currentGallery = index;
    updateGallery();
}

function changeGallery(direction) {
    if (isTransitioning || visibleGalleryItems.length <= 1) return;
    
    isTransitioning = true;
    currentGallery += direction;
    
    const offset = 1;
    const translateX = -(currentGallery + offset) * 100;
    galleryWrapper.style.transform = `translateX(${translateX}%)`;
    
    setTimeout(() => {
        if (currentGallery >= visibleGalleryItems.length) {
            currentGallery = 0;
            galleryWrapper.style.transition = 'none';
            galleryWrapper.style.transform = `translateX(-${offset * 100}%)`;
            setTimeout(() => {
                galleryWrapper.style.transition = 'transform 0.5s ease';
            }, 50);
        } else if (currentGallery < 0) {
            currentGallery = visibleGalleryItems.length - 1;
            galleryWrapper.style.transition = 'none';
            galleryWrapper.style.transform = `translateX(-${(currentGallery + offset) * 100}%)`;
            setTimeout(() => {
                galleryWrapper.style.transition = 'transform 0.5s ease';
            }, 50);
        }
        
        updateGalleryDots();
        isTransitioning = false;
        
        if (currentCategory === 'highlight') {
            handleVideoAutoplay();
        }
    }, 500);
    
    updateGalleryDots();
}

function switchGalleryTab(category) {
    if (isTransitioning) return;
    
    currentCategory = category;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateGalleryItems();
}

function pauseAllVideos() {
    const allVideos = document.querySelectorAll('.gallery-item video');
    allVideos.forEach(video => {
        video.pause();
    });
}

function handleVideoAutoplay() {
    pauseAllVideos();
    
    if (currentCategory === 'highlight') {
        const currentVideo = visibleGalleryItems[currentGallery]?.querySelector('video');
        if (currentVideo) {
            currentVideo.currentTime = 0;
            currentVideo.play().catch(e => {
                console.log('Autoplay prevented:', e);
            });
        }
    }
}

let galleryInterval = setInterval(() => changeGallery(1), 5000);

const galleryContainer = document.querySelector('.gallery-container');
if (galleryContainer) {
    galleryContainer.addEventListener('mouseenter', () => {
        clearInterval(galleryInterval);
    });

    galleryContainer.addEventListener('mouseleave', () => {
        galleryInterval = setInterval(() => changeGallery(1), 5000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateGalleryItems();
});

let startX = 0;
let endX = 0;

if (galleryWrapper) {
    galleryWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    galleryWrapper.addEventListener('touchmove', (e) => {
        e.preventDefault();
    });

    galleryWrapper.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = startX - endX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            changeGallery(1);
        } else {
            changeGallery(-1);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.gallery-item video');
    videos.forEach(video => {
        video.addEventListener('error', (e) => {
            console.log('Video could not be loaded:', e);
        });

        video.muted = true;
        video.loop = true;
        
        const galleryItem = video.closest('.gallery-item');
        if (galleryItem && galleryItem.dataset.category === 'highlight') {
            video.autoplay = true;
        }
    });
});