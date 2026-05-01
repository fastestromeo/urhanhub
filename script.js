import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // 2. Real-time Product Grid
    const renderProducts = (containerId, products) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = products.map(p => `
            <a href="product?id=${encodeURIComponent(p.id ?? p.product_id ?? p.productid ?? '')}" class="product-card" style="display:block; color:inherit; text-decoration:none;">
                <div class="img-wrapper"><img src="${p.img}" alt="${p.name}"></div>
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <span class="product-category">${p.category}</span>
                    <span class="product-price">$${parseFloat(p.price).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
            </a>
        `).join('');
    };

    if (document.querySelector('.product-grid')) {
        const homeGrid = document.getElementById('home-product-grid');
        (async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (!data || data.length === 0) {
                    if (homeGrid) {
                        homeGrid.innerHTML = `
                            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: #666;">
                                <i class="ph ph-database" style="font-size: 2rem; display: block; margin-bottom: 1rem; color: #94c1ff;"></i>
                                <h3>Database is Empty</h3>
                                <p style="margin-top: 0.5rem; font-size: 0.9rem;">No products were found. Please run <a href="seed.html" style="color: #000; font-weight: 700; text-decoration: underline;">seed.html</a>.</p>
                            </div>
                        `;
                    }
                    return;
                }

                renderProducts('home-product-grid', data);
            } catch (error) {
                console.error("UrbanHub Database Error:", error);
                if (homeGrid) {
                    homeGrid.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #ff4d4d; background: #fff5f5; border: 1px solid #ff4d4d; border-radius: 4px;">
                            <i class="ph ph-warning" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
                            <strong>Database Connection Error</strong><br>
                            ${error.message || error}
                        </div>
                    `;
                }
            }
        })();
    }

    // 3. Animation Logic
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .service-card, .work-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index % 4 * 0.1}s, transform 0.6s ease ${index % 4 * 0.1}s`;
        observer.observe(el);
    });

    // 4. Booking Logic (Fixed with Auth Check)
    const serviceBtns = document.querySelectorAll('.service-block .btn');
    const summaryVals = document.querySelectorAll('.booking-summary .summary-val');
    
    if (serviceBtns.length > 0 && summaryVals.length >= 2) {
        let selectedService = "Smart Home Installation";
        let selectedDate = "5";
        let selectedTime = "11:30 AM";

        const updateSummary = () => {
            summaryVals[0].textContent = selectedService;
            summaryVals[1].textContent = `Nov ${selectedDate}, 2024 • ${selectedTime}`;
        };

        serviceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                selectedService = e.target.closest('.service-block').querySelector('h3').textContent;
                serviceBtns.forEach(b => {
                    b.classList.remove('btn-primary'); b.classList.add('btn-muted'); b.textContent = 'Select Service';
                });
                btn.classList.replace('btn-muted', 'btn-primary');
                btn.textContent = 'Selected';
                updateSummary();
            });
        });

        document.querySelectorAll('.calendar-grid .day:not(.disabled)').forEach(day => {
            day.addEventListener('click', (e) => {
                if(e.target.classList.contains('weekday')) return;
                document.querySelectorAll('.calendar-grid .day').forEach(d => d.classList.remove('selected'));
                e.target.classList.add('selected');
                selectedDate = e.target.textContent;
                updateSummary();
            });
        });

        document.querySelectorAll('.slot-btn').forEach(slot => {
            slot.addEventListener('click', (e) => {
                document.querySelectorAll('.slot-btn').forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
                selectedTime = e.target.textContent;
                updateSummary();
            });
        });

        // CONFIRM BOOKING with Auth Check
        const confirmBtn = document.querySelector('.booking-widget .btn-lg');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                try {
                    const { getSession } = await import('./auth-guard.js');
                    const session = await getSession();
                    
                    if (!session) {
                        const redirect = encodeURIComponent(window.location.pathname.replace(/^\//, '') + window.location.search);
                        window.location.href = `auth?redirect=${redirect}`;
                        return;
                    }

                    const customerName = session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || 'Guest';

                    const { error: orderError } = await supabase.from('orders').insert({
                        userid: session.user.id,
                        customer: customerName,
                        product: selectedService,
                        amount: '$450.00',
                        status: 'pending',
                        bookingdate: `Nov ${selectedDate}, 2024`,
                        bookingtime: selectedTime,
                        type: 'service'
                    });
                    if (orderError) throw orderError;

                    const { error: activityError } = await supabase.from('activity').insert({
                        title: 'Service Booked',
                        desc: `'${selectedService}' was booked by ${customerName}.`,
                        time: 'Just now',
                        color: 'blue'
                    });
                    if (activityError) throw activityError;
                    
                    alert(`Booking Confirmed! You'll find it in your dashboard.`);
                    window.location.reload();
                } catch (e) {
                    console.error("Error booking: ", e);
                }
            });
        }
    }
});
