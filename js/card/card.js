
document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-image');
    const prevBtn = document.querySelector('.gallery-nav--prev');
    const nextBtn = document.querySelector('.gallery-nav--next');
    const thumbs = document.querySelectorAll('.thumb');

    const galleryData = Array.from(thumbs).map(thumb => ({
        src: thumb.querySelector('img').src,
        alt: thumb.querySelector('img').alt.replace('Thumbnail', 'View')
    }));

    let currentIndex = 0;


    const updateGallery = (index) => {
        if (index < 0) index = galleryData.length - 1;
        if (index >= galleryData.length) index = 0;
        currentIndex = index;

        mainImage.style.opacity = '0';

        setTimeout(() => {
            mainImage.src = galleryData[currentIndex].src;
            mainImage.alt = galleryData[currentIndex].alt;
            mainImage.style.opacity = '1';
        }, 150);

        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentIndex);
        });
    };

    prevBtn.addEventListener('click', () => updateGallery(currentIndex - 1));
    nextBtn.addEventListener('click', () => updateGallery(currentIndex + 1));

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => updateGallery(index));
    });
});