import { supabase } from './supabase-config.js';

const formatPrice = (p) => `$${parseFloat(p).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

document.addEventListener('DOMContentLoaded', () => {
    const userNameEl = document.querySelector('.user-name');
    if (userNameEl) userNameEl.textContent = 'Admin';

    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            navItems.forEach((nav) => nav.classList.remove('active'));
            item.classList.add('active');
            tabContents.forEach((content) => content.classList.remove('active'));
            const targetContent = document.getElementById(tabId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    let globalOrders = [];
    let globalUsers = [];

    const updateStats = (orders, users) => {
        let totalRevenue = 0;
        let activeOrders = 0;
        let serviceRequests = 0;

        const now = new Date();

        orders.forEach((o) => {
            // Check if it's a future product/booking
            let isFuture = false;
            // Handle booking date if it exists
            if (o.bookingdate && new Date(o.bookingdate) > now) {
                isFuture = true;
            } else if (o.created_at && new Date(o.created_at) > now) {
                isFuture = true;
            }

            // Exclude future products/revenue from analytics
            if (!isFuture) {
                const amount = parseFloat(String(o.amount || '').replace(/[^0-9.-]+/g, '')) || 0;
                totalRevenue += amount;
                if (o.status === 'pending' || o.status === 'processing') activeOrders++;
                if (o.type === 'service' || o.bookingdate) serviceRequests++;
            }
        });

        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 4) {
            statValues[0].textContent = formatPrice(totalRevenue);
            statValues[1].textContent = activeOrders;
            statValues[2].textContent = serviceRequests;
            statValues[3].textContent = users.length;
        }

        const metricValues = document.querySelectorAll('.metric-value');
        if (metricValues.length >= 3) {
            metricValues[0].textContent = formatPrice(totalRevenue);
            metricValues[1].textContent = users.length;
        }
    };

    const renderCustomers = (users) => {
        const customersList = document.getElementById('customers-list');
        if (!customersList) return;

        customersList.innerHTML = (users || []).map((u) => {
            const createdAt = u.created_at ? new Date(u.created_at) : null;
            const dateLabel = createdAt
                ? createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'N/A';

            return `
                <tr>
                    <td>
                        <div class="customer-cell">
                            <div class="initials">${u.name ? u.name.charAt(0) : '?'}</div>
                            <div class="customer-detail">
                                <span class="customer-name">${u.name || 'Anonymous User'}</span>
                                <span class="customer-id">UID: ${u.uid ? String(u.uid).substring(0, 6) : 'N/A'}</span>
                            </div>
                        </div>
                    </td>
                    <td class="email-cell">${u.email || ''}</td>
                    <td class="date-cell">${dateLabel}</td>
                    <td><span class="status-indicator-pill active">ACTIVE</span></td>
                    <td>
                        <div class="action-group">
                            <button class="icon-btn-sm" title="Message Customer"><i class="ph ph-envelope-simple"></i></button>
                            <button class="icon-btn-sm" title="View Profile"><i class="ph ph-user-focus"></i></button>
                            <button class="icon-btn-sm" title="View Restrictions"><i class="ph ph-warning-circle"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    };

    const renderOrders = (orders) => {
        const overviewTable = document.getElementById('overview-orders');
        if (overviewTable) {
            overviewTable.innerHTML = (orders || []).slice(0, 8).map((o) => `
                <tr>
                    <td class="order-id">#${String(o.id).substring(0, 5)}</td>
                    <td>
                        <div class="customer-cell">
                            <div class="initials">${o.customer ? String(o.customer).charAt(0) : '?'}</div>
                            <span>${o.customer || ''}</span>
                        </div>
                    </td>
                    <td>${o.product || ''}</td>
                    <td class="amount">${o.amount || ''}</td>
                    <td><span class="status-indicator-pill ${o.status || ''}">${String(o.status || '').toUpperCase()}</span></td>
                </tr>
            `).join('');
        }

        const fullOrdersTable = document.getElementById('orders-full-list');
        if (fullOrdersTable) {
            fullOrdersTable.innerHTML = (orders || []).map((o) => {
                const createdAt = o.created_at ? new Date(o.created_at) : null;
                const dateLabel = createdAt ? createdAt.toLocaleDateString() : 'Just now';
                return `
                    <tr>
                        <td>#${String(o.id).substring(0, 8)}</td>
                        <td>${o.customer || ''}</td>
                        <td>${o.product || ''}</td>
                        <td>${o.amount || ''}</td>
                        <td><span class="status-indicator-pill ${o.status || ''}">${String(o.status || '').toUpperCase()}</span></td>
                        <td>${dateLabel}</td>
                        <td>
                            ${o.status === 'pending'
                                ? `<button class="btn btn-blue" style="padding: 6px 12px; font-size: 11px;" onclick="window.approveOrder('${o.id}')">Approve</button>`
                                : '<span style="color:var(--text-light);font-size:12px;"><i class="ph ph-check-circle"></i> Done</span>'}
                        </td>
                    </tr>
                `;
            }).join('');
        }
    };

    const renderInventory = (products) => {
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) return;

        inventoryList.innerHTML = (products || []).map((p) => `
            <tr>
                <td>
                    <div class="customer-cell">
                        <img src="${p.img}" class="avatar-sm" style="border-radius: 4px;">
                        <span>${p.name}</span>
                    </div>
                </td>
                <td>${p.category}</td>
                <td>${formatPrice(p.price)}</td>
                <td class="order-id">${String(p.id).substring(0, 8)}</td>
                <td>
                    <button class="icon-btn-delete" onclick="window.deleteProduct('${p.id}')">
                        <i class="ph ph-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    };

    const renderServices = (orders) => {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;

        const serviceOrders = (orders || []).filter((o) => o.bookingdate || o.type === 'service');
        if (serviceOrders.length === 0) {
            servicesList.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">No active service requests</td></tr>';
            return;
        }

        servicesList.innerHTML = serviceOrders.map((o) => `
            <tr>
                <td>${o.product || ''}</td>
                <td>${o.customer || ''}</td>
                <td>${o.bookingdate || 'N/A'}</td>
                <td><span class="status status-${o.status}">${String(o.status || '').toUpperCase()}</span></td>
                <td>
                    <button class="icon-btn-view"><i class="ph ph-calendar-check"></i></button>
                </td>
            </tr>
        `).join('');
    };

    const renderActivity = (items) => {
        const timeline = document.getElementById('activity-timeline');
        if (!timeline) return;

        timeline.innerHTML = (items || []).map((a) => `
            <div class="timeline-item">
                <div class="timeline-line"></div>
                <div class="marker ${a.color || ''}"></div>
                <div class="activity-info">
                    <h4>${a.title || ''}</h4>
                    <p>${a.desc || ''}</p>
                    <span class="time">${a.time || 'Just now'}</span>
                </div>
            </div>
        `).join('');
    };

    const loadOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        globalOrders = data || [];
        renderOrders(globalOrders);
        renderServices(globalOrders);
        updateStats(globalOrders, globalUsers);
    };

    const loadUsers = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            globalUsers = [];
            renderCustomers(globalUsers);
            updateStats(globalOrders, globalUsers);
            return;
        }
        globalUsers = data || [];
        renderCustomers(globalUsers);
        updateStats(globalOrders, globalUsers);
    };

    const loadProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        renderInventory(data || []);
    };

    const loadActivity = async () => {
        const { data, error } = await supabase
            .from('activity')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);
        if (error) throw error;
        renderActivity(data || []);
    };

    const loadSettings = async () => {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 'platform')
            .maybeSingle();
        if (error) throw error;
        if (!data) return;

        const supportEmailEl = document.getElementById('platform-support-email');
        const phoneEl = document.getElementById('platform-phone');
        const addressEl = document.getElementById('platform-address');
        const maintenanceEl = document.getElementById('toggle-maintenance');
        if (supportEmailEl) supportEmailEl.value = data.supportEmail || '';
        if (phoneEl) phoneEl.value = data.phone || '';
        if (addressEl) addressEl.value = data.address || '';
        if (maintenanceEl) maintenanceEl.checked = !!data.maintenanceMode;
    };

    const btnExport = document.getElementById('btn-export-overview');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (globalOrders.length === 0) {
                alert('No data available to export.');
                return;
            }

            const headers = ['Order ID', 'Customer Name', 'Product/Service', 'Amount', 'Status', 'Date'];
            const rows = globalOrders.map((o) => {
                const createdAt = o.created_at ? new Date(o.created_at) : null;
                const dateOutput = createdAt ? createdAt.toLocaleDateString() : 'N/A';
                const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
                return [
                    escapeCsv(String(o.id).substring(0, 8)),
                    escapeCsv(o.customer),
                    escapeCsv(o.product),
                    escapeCsv(o.amount),
                    escapeCsv(o.status),
                    escapeCsv(dateOutput)
                ].join(',');
            });

            const csvContent = [headers.join(','), ...rows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `UrbanHub_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    window.approveOrder = async (id) => {
        try {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ status: 'completed' })
                .eq('id', id);
            if (updateError) throw updateError;

            const { error: activityError } = await supabase.from('activity').insert({
                title: 'Order Approved',
                desc: `Order #${String(id).substring(0, 8)} was approved by administrator.`,
                time: 'Just now',
                color: 'green'
            });
            if (activityError) throw activityError;

            await Promise.all([loadOrders(), loadActivity()]);
        } catch (err) {
            console.error('Error approving order:', err);
            alert('Failed to approve order. Please check console for details.');
        }
    };

    window.deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to remove this item from the collection?')) return;
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            if (error) throw error;
            await loadProducts();
            alert('Product removed successfully.');
        } catch (err) {
            console.error('Delete Error:', err);
        }
    };

    const addBtn = document.getElementById('add-inventory-btn') || document.querySelector('.sidebar-footer .btn-primary');
    if (addBtn) {
        addBtn.onclick = async () => {
            const name = prompt('Name:');
            if (!name) return;
            const price = prompt('Price:');
            const category = prompt('Category (Furniture/Decor/Services):');
            const imgUrl = prompt('Image URL (leave blank for default):');

            try {
                const id = (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()));
                const { error } = await supabase.from('products').insert({
                    id,
                    name,
                    price: parseFloat(price),
                    category,
                    img: imgUrl ? imgUrl.trim() : 'https://images.unsplash.com/photo-1538688543635-09514cf978bc?auto=format&fit=crop&q=80&w=800'
                });
                if (error) throw error;
                await loadProducts();
            } catch (err) {
                console.error('Add product error:', err);
                alert('Failed to add product.');
            }
        };
    }

    const btnSignOut = document.getElementById('btn-sign-out');
    if (btnSignOut) {
        btnSignOut.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = 'login.html';
        });
    }

    const btnSaveProfile = document.getElementById('btn-save-profile');
    if (btnSaveProfile) {
        btnSaveProfile.addEventListener('click', async () => {
            alert('Profile editing is disabled (Auth removed).');
        });
    }

    const btnUpdatePassword = document.getElementById('btn-update-password');
    if (btnUpdatePassword) {
        btnUpdatePassword.addEventListener('click', async () => {
            alert('Password updates are disabled (Auth removed).');
        });
    }

    const btnSavePlatform = document.getElementById('btn-save-platform');
    if (btnSavePlatform) {
        btnSavePlatform.addEventListener('click', async () => {
            const supportEmail = document.getElementById('platform-support-email')?.value || '';
            const phone = document.getElementById('platform-phone')?.value || '';
            const address = document.getElementById('platform-address')?.value || '';
            const maintenanceMode = !!document.getElementById('toggle-maintenance')?.checked;

            try {
                btnSavePlatform.innerText = 'Saving Configuration...';
                const { error } = await supabase
                    .from('settings')
                    .upsert({
                        id: 'platform',
                        supportEmail,
                        phone,
                        address,
                        maintenanceMode,
                        updatedAt: new Date().toISOString()
                    }, { onConflict: 'id' });
                if (error) throw error;

                await supabase.from('activity').insert({
                    title: 'Platform Configuration Updated',
                    desc: 'Global platform settings were modified.',
                    time: 'Just now',
                    color: 'blue'
                });

                btnSavePlatform.innerText = 'Saved Successfully!';
                setTimeout(() => (btnSavePlatform.innerText = 'Save Platform Settings'), 3000);
                await loadActivity();
            } catch (err) {
                console.error('Platform Save Error:', err);
                alert('Failed to save platform configuration.');
                btnSavePlatform.innerText = 'Save Platform Settings';
            }
        });
    }

    (async () => {
        try {
            await Promise.all([loadOrders(), loadUsers(), loadProducts(), loadActivity(), loadSettings()]);
        } catch (err) {
            console.error('Admin load error:', err);
        }
    })();
});
