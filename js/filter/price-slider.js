
document.addEventListener('DOMContentLoaded', () => {
    const minSlider = document.getElementById('minPrice');
    const maxSlider = document.getElementById('maxPrice');
    const range = document.getElementById('sliderRange');
    const minValue = document.getElementById('minValue');
    const maxValue = document.getElementById('maxValue');
    
    const MAX_PRICE = 2600;

    function updateSlider() {
        let min = parseInt(minSlider.value);
        let max = parseInt(maxSlider.value);
        
       
        if (min > max - 10) {
            min = max - 10;
            minSlider.value = min;
        }
        if (max < min + 10) {
            max = min + 10;
            maxSlider.value = max;
        }
        
        
        minValue.textContent = "$" + min.toLocaleString();
        maxValue.textContent = "$" + max.toLocaleString();
        
        
        const percentMin = (min / MAX_PRICE) * 100;
        const percentMax = (max / MAX_PRICE) * 100;
        
        
        range.style.left = percentMin + "%";
        range.style.width = (percentMax - percentMin) + "%";
    }

    minSlider.addEventListener("input", updateSlider);
    maxSlider.addEventListener("input", updateSlider);
    
    updateSlider();
});