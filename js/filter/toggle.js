
document.addEventListener('DOMContentLoaded', () => {
    const mobileFiltersBtn = document.getElementById('mobileFiltersBtn');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const filtersCloseBtn = document.getElementById('filtersCloseBtn');
    const filtersOverlay = document.getElementById('filtersOverlay');
    

    function openFilters() {
        filtersSidebar.classList.add('active');
        filtersOverlay.classList.add('active');
        document.body.classList.add('filters-open');
    }
    
   
    function closeFilters() {
        filtersSidebar.classList.remove('active');
        filtersOverlay.classList.remove('active');
        document.body.classList.remove('filters-open');
    }
    

    if (mobileFiltersBtn) {
        mobileFiltersBtn.addEventListener('click', openFilters);
    }
    
    if (filtersCloseBtn) {
        filtersCloseBtn.addEventListener('click', closeFilters);
    }
    
    if (filtersOverlay) {
        filtersOverlay.addEventListener('click', closeFilters);
    }
    

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filtersSidebar.classList.contains('active')) {
            closeFilters();
        }
    });
});