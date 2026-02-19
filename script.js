/**
 * Origen Antifrágil - Lógica de Dashboard Dinámica con Paginación e Imágenes (V3 - Persistente)
 */

const usersData = {
    'admin@antifragil.com': {
        name: 'Administrador Central',
        role: 'GESTIÓN ESTRATÉGICA',
        subtitle: 'Supervisión de la red y métricas globales.',
        img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100',
        nav: [
            { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
            { id: 'network', label: 'Red de Expertos', icon: 'users' },
            { id: 'clients', label: 'Clientes MiPyME', icon: 'building' },
            { id: 'reports', label: 'Reportes NEXO', icon: 'bar-chart-3' }
        ]
    },
    'experto@antifragil.com': {
        name: 'Ing. Silas Vane',
        role: 'EXPERTO SENIOR',
        subtitle: 'Gestión de sesiones senior y honorarios.',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
        nav: [
            { id: 'dashboard', label: 'Mi Agenda', icon: 'calendar-days' },
            { id: 'sessions', label: 'Sesiones NEXO', icon: 'messages-square' },
            { id: 'earnings', label: 'Mis Honorarios', icon: 'wallet' }
        ]
    },
    'cliente@antifragil.com': {
        name: 'CEO Innovate Corp',
        role: 'CLIENTE PREMIUM',
        subtitle: 'Panel de consejería y toma de decisiones.',
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
        nav: [
            { id: 'dashboard', label: 'Panel Privado', icon: 'activity' },
            { id: 'search', label: 'Directorio Senior', icon: 'search' },
            { id: 'booking', label: 'Agendar Sesión', icon: 'plus-circle' },
            { id: 'billing', label: 'Facturación', icon: 'credit-card' }
        ]
    }
};

let currentUser = null;
let paginationState = {
    'network': 1,
    'clients': 1,
    'search': 1,
    'sessions_admin': 1,
    'sessions_expert': 1
};
const ITEMS_PER_PAGE = 4; // Ajustado para que el directorio se vea mejor

function autoFill(email) {
    document.getElementById('emailInput').value = email;
    document.getElementById('passInput').value = 'demo1234';
}

function processLogin() {
    const email = document.getElementById('emailInput').value.toLowerCase();
    const user = usersData[email];

    if (user) {
        currentUser = { ...user, email };
        document.getElementById('loginStage').classList.add('hidden');
        document.getElementById('appStage').classList.remove('hidden');
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('roleBadge').textContent = user.role;
        document.getElementById('viewSubtitle').textContent = user.subtitle;
        
        const profileImgContainer = document.querySelector('.main-view header div:last-child div:last-child');
        if (profileImgContainer) {
            profileImgContainer.innerHTML = `<img src="${user.img}" style="width:100%; height:100%; border-radius:14px; object-fit:cover;">`;
        }
        
        renderNavigation(user.nav);
        navigateTo('dashboard');
    } else {
        alert('Credenciales inválidas.');
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function renderNavigation(items) {
    const nav = document.getElementById('navLinks');
    nav.innerHTML = items.map(item => `
        <div class="nav-btn" id="nav-${item.id}" onclick="navigateTo('${item.id}')">
            <i data-lucide="${item.icon}"></i>
            <span class="label">${item.label}</span>
        </div>
    `).join('') + `
        <div class="nav-btn" onclick="DB.reset()" style="margin-top:auto; opacity:0.5;">
            <i data-lucide="refresh-cw"></i>
            <span class="label">Reset Database</span>
        </div>
    `;
    lucide.createIcons();
}

function navigateTo(viewId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${viewId}`);
    if (activeBtn) activeBtn.classList.add('active');

    const content = document.getElementById('dashboardContent');
    content.innerHTML = '';
    document.getElementById('viewTitle').textContent = viewId.charAt(0).toUpperCase() + viewId.slice(1);
    
    if (currentUser.role.includes('GESTIÓN')) renderAdminViews(viewId, content);
    else if (currentUser.role.includes('EXPERTO')) renderExpertViews(viewId, content);
    else renderClientViews(viewId, content);
    
    lucide.createIcons();
}

// --- HELPERS ---
function getPaginatedData(data, page) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
}

function renderPaginationControls(totalItems, currentPage, stateKey, targetViewId) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return '';
    let html = `<div class="pagination">`;
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : `onclick="changePage('${stateKey}', ${currentPage - 1}, '${targetViewId}')"`}>«</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage('${stateKey}', ${i}, '${targetViewId}')">${i}</button>`;
    }
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : `onclick="changePage('${stateKey}', ${currentPage + 1}, '${targetViewId}')"`}>»</button>`;
    return html;
}

function changePage(stateKey, page, viewId) {
    paginationState[stateKey] = page;
    const content = document.getElementById('dashboardContent');
    if (currentUser.role.includes('GESTIÓN')) renderAdminViews(viewId, content);
    else if (currentUser.role.includes('EXPERTO')) renderExpertViews(viewId, content);
    else renderClientViews(viewId, content);
    lucide.createIcons();
}

// --- RENDER CLIENTE ---
function renderClientViews(viewId, content) {
    const liveData = DB.get();
    const myData = liveData.clients.find(c => c.email === currentUser.email) || liveData.clients[0];
    const mySessions = liveData.sessions.filter(s => s.clientEmail === currentUser.email);

    if (viewId === 'dashboard') {
        content.innerHTML = `
            <div class="card span-2" style="background:var(--color-primary); color:white;">
                <p class="panel-label" style="opacity:0.7">Créditos NEXO</p>
                <h2 style="font-size: 3.5rem;">${myData.credits}</h2>
                <button class="btn btn-primary" style="background:white; color:var(--color-primary); width:100%; margin-top:1.5rem;" onclick="navigateTo('booking')">Agendar Sesión</button>
            </div>
            <div class="card span-2">
                <p class="panel-label">Próxima Actividad</p>
                <div style="margin-top:2rem;">
                    ${mySessions.filter(s => s.status === 'Agendada').length > 0 ? `
                        <p style="font-weight:800; font-size:1.1rem;">${mySessions.filter(s => s.status === 'Agendada')[0].topic}</p>
                        <p style="color:var(--text-muted)">Con ${mySessions.filter(s => s.status === 'Agendada')[0].expert}</p>
                    ` : '<p style="color:var(--text-muted)">No hay sesiones pendientes.</p>'}
                </div>
            </div>
            <div class="card span-4">
                <p class="panel-label">Historial de Sesiones</p>
                <div class="info-list">
                    ${mySessions.reverse().map(s => `
                        <div class="info-item">
                            <span><b>${s.topic}</b> | ${s.expert}</span>
                            <span>${s.date}</span>
                            <b>${s.status}</b>
                        </div>
                    `).join('')}
                    ${mySessions.length === 0 ? '<p style="padding:1rem; text-align:center; color:var(--text-muted)">Aún no tienes sesiones registradas.</p>' : ''}
                </div>
            </div>
        `;
    } else if (viewId === 'search') {
        const page = paginationState['search'] || 1;
        const pagedExperts = getPaginatedData(liveData.experts, page);
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">Directorio Senior (Total: ${liveData.experts.length})</p>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin-top:2rem;">
                    ${pagedExperts.map(e => `
                        <div class="card" style="padding:1.5rem; display:flex; flex-direction:column;">
                            <div style="display:flex; gap:1rem; margin-bottom:1.5rem;">
                                <img src="${e.img}" style="width:60px; height:60px; border-radius:12px; object-fit:cover;">
                                <div>
                                    <h4 style="font-weight:800; color:var(--color-primary);">${e.name}</h4>
                                    <p style="font-size:0.75rem; color:var(--text-muted);">${e.specialty}</p>
                                </div>
                            </div>
                            <p style="font-size:0.8rem; height:40px; overflow:hidden; margin-bottom:1.5rem;">${e.bio}</p>
                            <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
                                <b style="color:var(--color-primary);">$${e.price}/h</b>
                                <button class="btn btn-primary" style="font-size:0.75rem; padding: 8px 16px;" onclick="navigateTo('booking')">Ver Perfil</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${renderPaginationControls(liveData.experts.length, page, 'search', 'search')}
            </div>
        `;
    } else if (viewId === 'booking') {
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">Agendar Sesión Estratégica</p>
                <div class="booking-container" style="margin-top:2rem;">
                    <div class="booking-form">
                        <select class="input-field" id="bookExpert">
                            ${liveData.experts.map(e => `<option value="${e.name}">${e.name} - ${e.specialty}</option>`).join('')}
                        </select>
                        <input class="input-field" type="text" id="bookTopic" placeholder="¿Qué tema quieres tratar?">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                            <input class="input-field" type="date" id="bookDate">
                            <select class="input-field" id="bookTime">
                                ${liveData.schedules.map(t => `<option value="${t}">${t}</option>`).join('')}
                            </select>
                        </div>
                        <button class="btn btn-primary" onclick="confirmBooking()" style="padding:1.2rem;">Confirmar Cita (1 Crédito)</button>
                    </div>
                    <div class="booking-summary">
                        <h4>Resumen</h4>
                        <p style="font-size:0.8rem; margin:1rem 0;">Se descontará un crédito de tu balance Premium.</p>
                        <div class="info-item"><span>Saldo Actual</span><b>${myData.credits} Créditos</b></div>
                    </div>
                </div>
            </div>
        `;
    } else if (viewId === 'billing') {
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">Facturación y Suscripción</p>
                <div class="info-list" style="margin-top:2rem;">
                    ${liveData.invoices.map(inv => `
                        <div class="info-item">
                            <span>${inv.id} | ${inv.concept}</span>
                            <span>${inv.date}</span>
                            <b>$${inv.amount.toLocaleString()}</b>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function confirmBooking() {
    const expert = document.getElementById('bookExpert').value;
    const topic = document.getElementById('bookTopic').value;
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;

    if (!topic || !date) return alert('Por favor completa todos los campos.');

    const liveData = DB.get();
    const clientIndex = liveData.clients.findIndex(c => c.email === currentUser.email);
    
    if (liveData.clients[clientIndex].credits <= 0) return alert('No tienes créditos suficientes.');

    liveData.clients[clientIndex].credits -= 1;
    liveData.sessions.push({
        id: 'ses_' + Date.now(),
        clientEmail: currentUser.email,
        expert,
        date,
        time,
        topic,
        status: 'Agendada'
    });

    DB.save(liveData);
    navigateTo('dashboard');
}

// --- RENDERS ADMIN ---
function renderAdminViews(viewId, content) {
    const liveData = DB.get();
    
    if (viewId === 'dashboard') {
        content.innerHTML = `
            <div class="card span-2">
                <p class="panel-label">Flujo de Capital Global</p>
                <h2 style="font-size: 3rem; font-weight: 800; color: var(--color-primary);">$${liveData.metrics.totalRevenue.toLocaleString()}</h2>
                <p style="color:var(--success); font-weight:700; margin-top:0.5rem;">↑ ${liveData.metrics.monthlyGrowth}% este mes</p>
            </div>
            <div class="card span-2">
                <p class="panel-label">Impacto Antifrágil</p>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top:1.5rem;">
                    <div><h3 style="font-size: 2rem;">${liveData.metrics.expertNetworkSize}</h3><p style="font-size:0.8rem;">Expertos</p></div>
                    <div><h3 style="font-size: 2rem;">${liveData.metrics.unsuccessfulSessions}</h3><p style="font-size:0.8rem;">Cisnes Negros Evitados</p></div>
                </div>
            </div>
            <div class="card span-4">
                <p class="panel-label">Monitor Global de Sesiones (Persistencia Real)</p>
                <div class="info-list">
                    ${liveData.sessions.slice(-6).reverse().map(s => `
                        <div class="info-item">
                            <span><b>${s.clientEmail}</b> vs ${s.expert}</span>
                            <span>${s.date} ${s.time}</span>
                            <b style="color:${s.status === 'Agendada' ? 'var(--warning)' : 'var(--success)'}">${s.status}</b>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (viewId === 'network') {
        const page = paginationState['network'] || 1;
        const paged = getPaginatedData(liveData.experts, page);
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">Control de Red de Expertos</p>
                <div class="info-list" style="margin-top:2rem;">
                    ${paged.map(e => `
                        <div class="info-item">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <img src="${e.img}" style="width:40px; height:40px; border-radius:10px; object-fit:cover;">
                                <div><b>${e.name}</b><br><small>${e.specialty}</small></div>
                            </div>
                            <span class="dot dot-${e.status === 'Disponible' ? 'success' : 'warning'}"></span>
                            <b>${e.status}</b>
                        </div>
                    `).join('')}
                </div>
                ${renderPaginationControls(liveData.experts.length, page, 'network', 'network')}
            </div>
        `;
    } else if (viewId === 'clients') {
        const page = paginationState['clients'] || 1;
        const paged = getPaginatedData(liveData.clients, page);
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">Base de Datos MiPyME</p>
                <div class="info-list" style="margin-top:2rem;">
                    ${paged.map(c => `
                        <div class="info-item">
                            <b>${c.name}</b>
                            <span>${c.industry}</span>
                            <span>Créditos: <b>${c.credits}</b></span>
                            <button class="btn btn-primary" style="padding:4px 12px; font-size:0.7rem;">Gestionar</button>
                        </div>
                    `).join('')}
                </div>
                ${renderPaginationControls(liveData.clients.length, page, 'clients', 'clients')}
            </div>
        `;
    } else if (viewId === 'reports') {
        content.innerHTML = `
            <div class="card span-2">
                <p class="panel-label">Score de Antifragilidad Red</p>
                <h2 style="font-size:3.5rem; color:var(--color-primary);">${liveData.metrics.antiFragilityScore}%</h2>
            </div>
            <div class="card span-2">
                 <p class="panel-label">MiPyMEs Activas</p>
                <h2 style="font-size:3.5rem; color:var(--color-primary);">${liveData.metrics.activePymes}</h2>
            </div>
        `;
    }
}

// --- RENDERS EXPERTO ---
function renderExpertViews(viewId, content) {
    const liveData = DB.get();
    const mySessions = liveData.sessions.filter(s => s.expert === currentUser.name);
    
    if (viewId === 'dashboard') {
        const agendadas = mySessions.filter(s => s.status === 'Agendada');
        content.innerHTML = `
            <div class="card span-2">
                <p class="panel-label">Honorarios Acumulados</p>
                <h2 style="font-size: 3rem; font-weight: 800; color: var(--color-primary);">$12,450.00</h2>
            </div>
            <div class="card span-2">
                <p class="panel-label">Rating Senior</p>
                <div style="margin-top:1.5rem;">
                    <h3 style="font-size: 2rem;">4.9 / 5.0</h3>
                    <p style="color:var(--text-muted)">Basado en 156 asesorías.</p>
                </div>
            </div>
            <div class="card span-4">
                <p class="panel-label">Sesiones Próximas (Agenda Viva)</p>
                <div class="info-list">
                    ${agendadas.length > 0 ? agendadas.map(s => `
                        <div class="info-item">
                            <span><b>${s.clientEmail}</b> | ${s.topic}</span>
                            <span>${s.date} ${s.time}</span>
                            <button class="btn btn-primary" style="padding:4px 12px; font-size:0.7rem;">Iniciar Nexo-Sala</button>
                        </div>
                    `).join('') : '<p style="padding:1rem; color:var(--text-muted)">Agenda libre para hoy.</p>'}
                </div>
            </div>
        `;
    } else if (viewId === 'sessions') {
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">Historial de Consultoría NEXO</p>
                <div class="info-list" style="margin-top:2rem;">
                    ${mySessions.reverse().map(s => `
                        <div class="info-item">
                            <span><b>${s.clientEmail}</b></span>
                            <span>${s.topic}</span>
                            <span>${s.date}</span>
                            <span class="dot dot-${s.status === 'Completada' ? 'success' : 'warning'}"></span>
                            <b>${s.status}</b>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (viewId === 'earnings') {
        content.innerHTML = `
            <div class="card span-2">
                <p class="panel-label">Saldo Disponible para Liquidar</p>
                <h2 style="font-size: 2.5rem; margin:1rem 0;">$7,190.00</h2>
                <button class="btn btn-primary" style="width:100%;">Solicitar Pago</button>
            </div>
            <div class="card span-2">
                <p class="panel-label">Últimos Cobros</p>
                <div class="info-list">
                    <div class="info-item"><span>Mayo 2026</span><b>$3,200</b></div>
                    <div class="info-item"><span>Abril 2026</span><b>$2,850</b></div>
                </div>
            </div>
        `;
    }
}
