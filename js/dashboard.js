document.addEventListener('DOMContentLoaded', () => {
    const flightSearchForm = document.getElementById('flight-search-form');
    const dashboard = document.getElementById('results-dashboard');
    const mainSections = document.querySelectorAll('body > section, body > footer');
    const backBtn = document.getElementById('back-to-main');
    
    // We also need to attach to Hotel and Car forms from services.html / index.html structure
    // The current search panel only has the form in #flights, so let's attach to the whole submit button
    const searchForms = document.querySelectorAll('.search-panel form');
    
    if(searchForms.length === 0 && flightSearchForm) {
        searchForms = [flightSearchForm];
    }
    
    // Intercept form submissions
    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const loadingOverlay = document.querySelector('.search-loading-overlay');
            if(loadingOverlay) loadingOverlay.classList.add('active');
            
            // Determine which tab is active to show appropriate results
            const activeTab = document.querySelector('.search-tabs .nav-link.active').getAttribute('data-bs-target');
            
            setTimeout(() => {
                if(loadingOverlay) loadingOverlay.classList.remove('active');
                openDashboard(activeTab.replace('#', ''));
            }, 800);
        });
    });
    
    // Listen to grid buttons
    const btnFlights = document.getElementById('btn-grid-flights');
    const btnHotels = document.getElementById('btn-grid-hotels');
    const btnCars = document.getElementById('btn-grid-cars');
    
    const setupGridBtn = (btn, type) => {
        if(btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openDashboard(type);
            });
        }
    };
    
    setupGridBtn(btnFlights, 'flights');
    setupGridBtn(btnHotels, 'hotels');
    setupGridBtn(btnCars, 'cars');

    // Handle return to main
    if(backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dashboard.classList.add('d-none');
            mainSections.forEach(sec => sec.classList.remove('d-none'));
            window.scrollTo(0, 0);
        });
    }

    function openDashboard(type) {
        // Hide main content, show dashboard
        mainSections.forEach(sec => sec.classList.add('d-none'));
        dashboard.classList.remove('d-none');
        window.scrollTo(0, 0);
        
        renderDashboard(type);
    }

    function renderDashboard(type) {
        // --- Dynamic Data Extraction ---
        let tripType = 'Round-trip';
        let from = 'Cairo'; let fromCode = 'CAI';
        let to = 'Dubai'; let toCode = 'DXB';
        let departure = '15 <small>Jun 2026</small>';
        let returnDate = '22 <small>Jun 2026</small>';
        let passengers = '1 Adult - Economy';
    
        let hotelDest = 'Cairo, Egypt';
        let hotelCheckin = 'Jun 15, 2026';
        let hotelCheckout = 'Jun 22, 2026';
        let hotelGuests = '2 Adults &middot; 1 Room';
    
        let carLoc = 'Cairo Airport (CAI)';
        let carLocShort = 'Cairo Airport';
        let carDates = 'Jun 15 - Jun 22';
    
        const formatDt = (dateStr, fmt) => {
            if(!dateStr) return '';
            const d = new Date(dateStr);
            if(isNaN(d)) return dateStr;
            if (fmt === 'short') {
                return d.toLocaleDateString('en-GB', { day: 'numeric' }) + ' <small>' + d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) + '</small>';
            }
            return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
        };
        const parseCityCode = (val) => {
            const m = val.match(/(.*?)\s*\((.*?)\)/);
            if (m) return { city: m[1].trim(), code: m[2].trim() };
            return { city: val, code: val.substring(0,3).toUpperCase() };
        };
    
        if (type === 'flights') {
            const fEl = document.getElementById('flight-from'); if(fEl && fEl.value) { const p = parseCityCode(fEl.value); from = p.city; fromCode = p.code; }
            const tEl = document.getElementById('flight-to'); if(tEl && tEl.value) { const p = parseCityCode(tEl.value); to = p.city; toCode = p.code; }
            const dEl = document.getElementById('flight-departure'); if(dEl && dEl.value) departure = formatDt(dEl.value, 'short');
            const rEl = document.getElementById('flight-return'); if(rEl && rEl.value) returnDate = formatDt(rEl.value, 'short');
            const pEl = document.getElementById('flight-passengers'); if(pEl && pEl.value) passengers = pEl.value;
            const rRad = document.getElementById('roundTrip'); if(rRad && !rRad.checked) tripType = 'One-way';
        } else if (type === 'hotels') {
            const dEl = document.getElementById('hotel-destination'); if(dEl && dEl.value) hotelDest = dEl.value;
            const iEl = document.getElementById('hotel-checkin'); if(iEl && iEl.value) hotelCheckin = formatDt(iEl.value);
            const oEl = document.getElementById('hotel-checkout'); if(oEl && oEl.value) hotelCheckout = formatDt(oEl.value);
            const gEl = document.getElementById('hotel-guests'); if(gEl && gEl.value) hotelGuests = gEl.value.replace(',', ' &middot;');
        } else if (type === 'cars') {
            const lEl = document.getElementById('car-location'); if(lEl && lEl.value) { carLoc = lEl.value; carLocShort = parseCityCode(lEl.value).city; }
            const pEl = document.getElementById('car-pickup'); const dpEl = document.getElementById('car-dropoff');
            if(pEl && dpEl && pEl.value && dpEl.value) {
                const pd = new Date(pEl.value); const dd = new Date(dpEl.value);
                carDates = pd.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }) + ' - ' + dd.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
            }
        }

        const headerSummary = document.getElementById('dashboard-search-summary');
        const breadcrumbs = document.getElementById('dashboard-breadcrumbs');
        const filtersContent = document.getElementById('dashboard-filters-content');
        const resultsHeader = document.getElementById('dashboard-results-header');
        const sortArea = document.getElementById('dashboard-sort-area');
        const resultsList = document.getElementById('dashboard-results-list');
        const rightSidebar = document.getElementById('dashboard-right-sidebar');

        // Clear all
        headerSummary.innerHTML = ''; breadcrumbs.innerHTML = ''; filtersContent.innerHTML = '';
        resultsHeader.innerHTML = ''; sortArea.innerHTML = ''; resultsList.innerHTML = '';
        rightSidebar.innerHTML = '';
        rightSidebar.classList.remove('d-xl-block');
        rightSidebar.classList.add('d-none');

        if (type === 'flights') {
            rightSidebar.classList.remove('d-none');
            rightSidebar.classList.add('d-xl-block');
            
            headerSummary.innerHTML = `
                <div class="d-flex flex-column"><span class="text-white-50 small">TRIP</span><span class="text-white fw-bold"><i class="bi bi-arrow-left-right me-1"></i> ${tripType}</span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">FROM</span><span class="text-white fw-bold">${from} <small>${fromCode}</small></span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">TO</span><span class="text-white fw-bold">${to} <small>${toCode}</small></span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">DEPARTURE</span><span class="text-white fw-bold">${departure}</span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">RETURN</span><span class="text-white fw-bold">${returnDate}</span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">PASSENGERS</span><span class="text-white fw-bold"><i class="bi bi-person me-1"></i> ${passengers}</span></div>
            `;
            
            breadcrumbs.innerHTML = `<a href="#" class="text-blue text-decoration-none">Home</a> &rsaquo; <a href="#" class="text-blue text-decoration-none">Flights</a> &rsaquo; <span>${from} (${fromCode}) &mdash; ${to} (${toCode})</span>`;
            
            filtersContent.innerHTML = `
                <div class="mb-4">
                    <label class="text-white fw-bold mb-3 d-flex justify-content-between">Price Range <i class="bi bi-chevron-up"></i></label>
                    <input type="range" class="form-range dashboard-range mb-2" min="50" max="500" value="50">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="bg-dark rounded px-3 py-1 text-white border border-white-5">$50</div>
                        <span class="text-muted">&mdash;</span>
                        <div class="bg-dark rounded px-3 py-1 text-white border border-white-5">$500+</div>
                    </div>
                </div>
                <hr class="border-secondary">
                <div class="mb-4">
                    <label class="text-white fw-bold mb-3 d-flex justify-content-between">Stops <i class="bi bi-chevron-up"></i></label>
                    <div class="form-check dashboard-check mb-2 d-flex justify-content-between">
                        <div><input class="form-check-input" type="checkbox" checked id="s1"><label class="form-check-label text-white ms-2" for="s1">Non-stop</label></div>
                        <span class="text-success small fw-bold">156</span>
                    </div>
                    <div class="form-check dashboard-check mb-2 d-flex justify-content-between">
                        <div><input class="form-check-input" type="checkbox" checked id="s2"><label class="form-check-label text-white ms-2" for="s2">1 Stop</label></div>
                        <span class="text-warning small fw-bold">89</span>
                    </div>
                    <div class="form-check dashboard-check mb-2 d-flex justify-content-between">
                        <div><input class="form-check-input" type="checkbox" id="s3"><label class="form-check-label text-muted ms-2" for="s3">2+ Stops</label></div>
                        <span class="text-danger small fw-bold">34</span>
                    </div>
                </div>
                <hr class="border-secondary">
                <div class="mb-4">
                    <label class="text-white fw-bold mb-3 d-flex justify-content-between">Airlines <i class="bi bi-chevron-up"></i></label>
                    <div class="form-check dashboard-check mb-2 d-flex justify-content-between">
                        <div><input class="form-check-input" type="checkbox" checked><label class="form-check-label text-white ms-2"><span class="badge bg-danger me-1">G9</span> Air Arabia</label></div>
                        <span class="text-muted small">14</span>
                    </div>
                    <div class="form-check dashboard-check mb-2 d-flex justify-content-between">
                        <div><input class="form-check-input" type="checkbox" checked><label class="form-check-label text-white ms-2"><span class="badge bg-primary me-1">MS</span> EgyptAir</label></div>
                        <span class="text-muted small">45</span>
                    </div>
                    <div class="form-check dashboard-check mb-2 d-flex justify-content-between">
                        <div><input class="form-check-input" type="checkbox" checked><label class="form-check-label text-white ms-2"><span class="badge bg-info me-1">FZ</span> flydubai</label></div>
                        <span class="text-muted small">22</span>
                    </div>
                </div>
            `;
            
            resultsHeader.innerHTML = `<i class="bi bi-airplane me-2"></i> ${from} (${fromCode}) &mdash; ${to} (${toCode})<br><small class="text-muted fw-normal fs-6">6 flights found &middot; ${departure} - ${returnDate} &middot; ${passengers}</small>`;
            sortArea.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <span class="text-muted small">Sort by</span>
                    <div class="d-flex">
                        <button class="sort-btn active">Cheapest</button>
                        <button class="sort-btn">Fastest</button>
                        <button class="sort-btn">Best Value</button>
                        <button class="sort-btn">Recommended</button>
                    </div>
                </div>
            `;
            
            resultsList.innerHTML = `
                <!-- Flight 1 -->
                <div class="flight-card p-4">
                    <div class="flight-badge bg-cheapest"><i class="bi bi-tag-fill me-1"></i> CHEAPEST</div>
                    <div class="row align-items-center text-center text-md-start">
                        <div class="col-md-2 col-4 mx-auto mb-3 mb-md-0 d-flex flex-column align-items-center justify-content-center">
                            <div class="airline-logo" style="background:#e11d48;">G9</div>
                            <small class="text-muted mt-2 fw-medium">Air Arabia</small>
                        </div>
                        <div class="col-md-7 mb-4 mb-md-0">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="text-end" style="width: 30%;">
                                    <h4 class="text-white fw-bold mb-0">08:30</h4>
                                    <small class="text-muted">${fromCode} ${from}</small>
                                </div>
                                <div class="px-3 text-center" style="width: 40%;">
                                    <small class="text-white-50 d-block mb-1">3h 30m</small>
                                    <div class="flight-timeline my-2">
                                        <div class="flight-timeline-line"></div>
                                        <div class="flight-timeline-dot"><i class="bi bi-airplane-fill"></i></div>
                                    </div>
                                    <span class="badge rounded-pill text-success" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">Non-stop</span>
                                </div>
                                <div class="text-start" style="width: 30%;">
                                    <h4 class="text-white fw-bold mb-0">13:00</h4>
                                    <small class="text-muted">${toCode} ${to}</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 text-md-end border-start border-white-5 ps-md-4">
                            <small class="text-muted">FROM</small>
                            <h2 class="text-blue fw-bold mb-0">$139</h2>
                            <small class="text-muted d-block mb-3">per person</small>
                            <button class="btn btn-primary w-100 fw-bold py-2 rounded-3">Select <i class="bi bi-arrow-right"></i></button>
                            <a href="#" class="d-block text-center mt-2 small text-muted text-decoration-none"><i class="bi bi-chevron-down me-1"></i>Flight details</a>
                        </div>
                    </div>
                </div>
                
                <!-- Flight 2 -->
                <div class="flight-card p-4">
                    <div class="row align-items-center text-center text-md-start">
                        <div class="col-md-2 col-4 mx-auto mb-3 mb-md-0 d-flex flex-column align-items-center justify-content-center">
                            <div class="airline-logo" style="background:#0284c7;">MS</div>
                            <small class="text-muted mt-2 fw-medium">EgyptAir</small>
                        </div>
                        <div class="col-md-7 mb-4 mb-md-0">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="text-end" style="width: 30%;">
                                    <h4 class="text-white fw-bold mb-0">10:00</h4>
                                    <small class="text-muted">${fromCode} ${from}</small>
                                </div>
                                <div class="px-3 text-center" style="width: 40%;">
                                    <small class="text-white-50 d-block mb-1">4h 30m</small>
                                    <div class="flight-timeline my-2">
                                        <div class="flight-timeline-line"></div>
                                        <div class="flight-timeline-dot"><i class="bi bi-airplane-fill"></i></div>
                                    </div>
                                    <span class="badge rounded-pill text-success" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">Non-stop</span>
                                </div>
                                <div class="text-start" style="width: 30%;">
                                    <h4 class="text-white fw-bold mb-0">15:30</h4>
                                    <small class="text-muted">${toCode} ${to}</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 text-md-end border-start border-white-5 ps-md-4">
                            <small class="text-muted">FROM</small>
                            <h2 class="text-blue fw-bold mb-0">$149</h2>
                            <small class="text-muted d-block mb-2">per person</small>
                            <div class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill mb-2"><i class="bi bi-arrow-repeat"></i> Refundable</div>
                            <button class="btn btn-primary w-100 fw-bold py-2 rounded-3">Select <i class="bi bi-arrow-right"></i></button>
                        </div>
                    </div>
                </div>

                <!-- Flight 6 -->
                <div class="flight-card p-4">
                    <div class="flight-badge bg-best"><i class="bi bi-star-fill me-1"></i> BEST VALUE</div>
                    <div class="row align-items-center text-center text-md-start">
                        <div class="col-md-2 col-4 mx-auto mb-3 mb-md-0 d-flex flex-column align-items-center justify-content-center">
                            <div class="airline-logo" style="background:#b45309;">EK</div>
                            <small class="text-muted mt-2 fw-medium">Emirates</small>
                        </div>
                        <div class="col-md-7 mb-4 mb-md-0">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="text-end" style="width: 30%;">
                                    <h4 class="text-white fw-bold mb-0">18:45</h4>
                                    <small class="text-muted">${fromCode} ${from}</small>
                                </div>
                                <div class="px-3 text-center" style="width: 40%;">
                                    <small class="text-white-50 d-block mb-1">4h 45m</small>
                                    <div class="flight-timeline my-2">
                                        <div class="flight-timeline-line"></div>
                                        <div class="flight-timeline-dot"><i class="bi bi-airplane-fill"></i></div>
                                    </div>
                                    <span class="badge rounded-pill text-success" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">Non-stop</span>
                                </div>
                                <div class="text-start" style="width: 30%;">
                                    <h4 class="text-white fw-bold mb-0">23:30</h4>
                                    <small class="text-muted">${toCode} ${to}</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 text-md-end border-start border-white-5 ps-md-4">
                            <small class="text-muted">FROM</small>
                            <h2 class="text-gold fw-bold mb-0">$219</h2>
                            <small class="text-muted d-block mb-2">per person</small>
                            <button class="btn btn-warning w-100 fw-bold py-2 rounded-3 text-dark">Select <i class="bi bi-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
            `;
            
            rightSidebar.innerHTML = `
                <div class="bg-panel p-4 rounded-4 mb-4 border border-white-5">
                    <h6 class="text-white fw-bold mb-1"><i class="bi bi-bar-chart me-2"></i>Price Calendar</h6>
                    <small class="text-muted d-block mb-3">Cheapest fares per departure day</small>
                    <div class="d-flex align-items-end justify-content-between gap-1" style="height: 60px;">
                        <div class="w-100 bg-secondary bg-opacity-25 rounded-top" style="height: 40%"></div>
                        <div class="w-100 bg-secondary bg-opacity-25 rounded-top" style="height: 60%"></div>
                        <div class="w-100 bg-secondary bg-opacity-25 rounded-top" style="height: 50%"></div>
                        <div class="w-100 bg-blue rounded-top position-relative" style="height: 30%">
                            <div class="position-absolute text-blue fw-bold" style="top: -20px; left: 50%; transform: translateX(-50%); font-size: 10px;">$139</div>
                        </div>
                        <div class="w-100 bg-secondary bg-opacity-25 rounded-top" style="height: 70%"></div>
                        <div class="w-100 bg-secondary bg-opacity-25 rounded-top" style="height: 90%"></div>
                        <div class="w-100 bg-secondary bg-opacity-25 rounded-top" style="height: 80%"></div>
                    </div>
                    <div class="d-flex justify-content-between mt-2 text-white-50" style="font-size: 9px;">
                        <span>Jun 12</span><span>13</span><span>14</span><span class="text-white fw-bold">15</span><span>16</span><span>17</span><span>18</span>
                    </div>
                </div>
                <div class="bg-panel p-4 rounded-4 border border-white-5">
                    <h6 class="text-gold fw-bold mb-3"><i class="bi bi-lightbulb me-2"></i>Travel Tips</h6>
                    <div class="d-flex gap-3 mb-3">
                        <i class="bi bi-calendar-check text-gold mt-1"></i>
                        <small class="text-muted">Book <b>6-8 weeks ahead</b> for the best prices on this route.</small>
                    </div>
                    <div class="d-flex gap-3">
                        <i class="bi bi-shield-check text-gold mt-1"></i>
                        <small class="text-muted">Add travel insurance for full coverage.</small>
                    </div>
                </div>
            `;
            
        } else if (type === 'hotels') {
            headerSummary.innerHTML = `
                <div class="d-flex flex-column"><span class="text-white-50 small">DESTINATION</span><span class="text-white fw-bold">${hotelDest}</span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">CHECK-IN</span><span class="text-white fw-bold">${hotelCheckin}</span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">CHECK-OUT</span><span class="text-white fw-bold">${hotelCheckout}</span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">GUESTS</span><span class="text-white fw-bold">${hotelGuests}</span></div>
            `;
            breadcrumbs.innerHTML = `<a href="#" class="text-blue text-decoration-none">Home</a> &rsaquo; <a href="#" class="text-blue text-decoration-none">Hotels</a> &rsaquo; <span>${hotelDest}</span>`;
            
            filtersContent.innerHTML = `
                <div class="mb-4">
                    <label class="text-white fw-bold mb-3 d-flex justify-content-between">Budget (per night) <i class="bi bi-chevron-up"></i></label>
                    <input type="range" class="form-range dashboard-range mb-2" min="50" max="500" value="250">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-white small">$50</span><span class="text-blue fw-bold">$250</span><span class="text-white small">$500</span>
                    </div>
                </div>
                <hr class="border-secondary">
                <div class="mb-4">
                    <label class="text-white fw-bold mb-3 d-flex justify-content-between">Star Rating <i class="bi bi-chevron-up"></i></label>
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-outline-secondary btn-sm text-gold border-white-5"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></button>
                        <button class="btn btn-outline-secondary btn-sm text-gold border-white-5"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></button>
                    </div>
                </div>
            `;
            
            resultsHeader.innerHTML = `<span class="text-white fw-bold">142 hotels</span> <span class="text-muted fw-normal fs-6">in ${hotelDest} &middot; ${hotelCheckin} - ${hotelCheckout} &middot; ${hotelGuests}</span>`;
            sortArea.innerHTML = `<select class="form-select bg-transparent text-white border-white-5"><option>Top Picks</option><option>Price: Low to High</option></select>`;
            
            resultsList.innerHTML = `
                <div class="hotel-card position-relative">
                    <div class="hotel-img-wrapper">
                        <img src="assets/images/dubai.webp" alt="Hotel">
                        <div class="hotel-badge"><i class="bi bi-fire me-1"></i> BEST LOCATION</div>
                    </div>
                    <div class="p-4 d-flex flex-column justify-content-between w-100">
                        <div class="d-flex justify-content-between">
                            <div>
                                <div class="text-gold small mb-1"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div>
                                <h4 class="text-white fw-bold mb-1">The Nile Ritz-Carlton</h4>
                                <small class="text-blue"><i class="bi bi-geo-alt-fill me-1"></i> Zamalek, Cairo</small>
                            </div>
                            <div class="text-end">
                                <div class="rating-badge ms-auto mb-1 fs-5">9.4</div>
                                <small class="text-white fw-bold d-block">EXCEPTIONAL</small>
                                <small class="text-muted" style="font-size: 10px;">2,148 reviews</small>
                            </div>
                        </div>
                        <div class="d-flex gap-2 flex-wrap mt-3 mb-3">
                            <span class="hotel-feature"><i class="bi bi-wifi me-1"></i> Free WiFi</span>
                            <span class="hotel-feature"><i class="bi bi-water me-1"></i> Pool</span>
                            <span class="hotel-feature"><i class="bi bi-cup-hot me-1"></i> Restaurant</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-end border-top border-white-5 pt-3">
                            <div>
                                <small class="text-muted">FROM</small>
                                <h3 class="text-blue fw-bold mb-0">$120 <small class="text-muted fs-6 fw-normal">/night</small></h3>
                                <small class="text-muted d-block" style="font-size:11px;">$840 total &middot; 7 nights</small>
                            </div>
                            <button class="btn btn-primary fw-bold px-4 rounded-3">View Rooms</button>
                        </div>
                    </div>
                </div>
            `;
            
        } else if (type === 'cars') {
            headerSummary.innerHTML = `
                <div class="d-flex flex-column"><span class="text-white-50 small">PICK-UP LOCATION</span><span class="text-white fw-bold">${carLoc}</span></div>
                <div class="d-flex flex-column"><span class="text-white-50 small">DATES</span><span class="text-white fw-bold">${carDates}</span></div>
            `;
            breadcrumbs.innerHTML = `<a href="#" class="text-blue text-decoration-none">Home</a> &rsaquo; <a href="#" class="text-blue text-decoration-none">Car Rental</a> &rsaquo; <span>${carLocShort}</span>`;
            
            filtersContent.innerHTML = `
                <div class="mb-4">
                    <label class="text-white fw-bold mb-3 d-flex justify-content-between">Vehicle Type <i class="bi bi-chevron-up"></i></label>
                    <div class="row g-2 text-center small text-white-50">
                        <div class="col-6"><div class="border border-primary text-blue p-2 rounded bg-primary bg-opacity-10"><i class="bi bi-car-front-fill fs-4 d-block mb-1"></i>Economy</div></div>
                        <div class="col-6"><div class="border border-white-5 p-2 rounded hover-opacity"><i class="bi bi-car-front fs-4 d-block mb-1"></i>SUV</div></div>
                    </div>
                </div>
            `;
            
            resultsHeader.innerHTML = `<span class="text-white fw-bold">48 vehicles</span> <span class="text-muted fw-normal fs-6">at ${carLocShort} &middot; ${carDates}</span>`;
            sortArea.innerHTML = `<select class="form-select bg-transparent text-white border-white-5"><option>Price: Low to High</option></select>`;
            
            resultsList.innerHTML = `
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="car-card">
                            <div class="car-img-wrapper p-3">
                                <div class="car-type-badge">ECONOMY</div>
                                <img src="assets/images/cars.webp" alt="Car" onerror="this.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80'" style="object-fit:cover; border-radius:10px;">
                            </div>
                            <div class="p-4">
                                <h4 class="text-white fw-bold mb-3">Volkswagen Polo</h4>
                                <div class="d-flex flex-wrap gap-3 car-specs mb-3">
                                    <span><i class="bi bi-person-fill text-blue"></i> 4 seats</span>
                                    <span><i class="bi bi-gear-fill text-blue"></i> Manual</span>
                                    <span><i class="bi bi-fuel-pump-fill text-blue"></i> Petrol</span>
                                </div>
                                <div class="d-flex flex-wrap gap-2 mb-4">
                                    <span class="badge bg-secondary bg-opacity-25 text-white fw-normal"><i class="bi bi-check me-1"></i>Insurance</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-end border-top border-white-5 pt-3">
                                    <div>
                                        <h3 class="text-blue fw-bold mb-0">$25 <small class="text-muted fs-6 fw-normal">/day</small></h3>
                                    </div>
                                    <button class="btn btn-primary fw-bold px-4 rounded-3">Select</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
});
