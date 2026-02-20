/**
 * Origen Antifrágil - Lógica Admin (Analítica Avanzada)
 */

const currentUser = {
    name: 'Administrador Central',
    role: 'GESTIÓN ESTRATÉGICA',
    email: 'admin@antifragil.com',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100',
    nav: [
        { id: 'dashboard', label: 'Monitor Global', icon: 'activity' },
        { id: 'tx_monitor', label: 'Monitor Transaccional', icon: 'trending-up' },
        { id: 'network', label: 'Red de Expertos', icon: 'users' },
        { id: 'clients', label: 'Cartera Clientes', icon: 'building' },
        { id: 'analytics', label: 'Analítica NEXO', icon: 'bar-chart-3' }
    ]
};

let paginationState = { 'network': 1, 'clients': 1 };
const ITEMS_PER_PAGE = 4;

function toggleSidebar() { 
    document.getElementById('sidebar').classList.toggle('collapsed'); 
}

function renderNavigation() {
    const nav = document.getElementById('navLinks');
    nav.innerHTML = currentUser.nav.map(item => `
        <div class="nav-btn" id="nav-${item.id}" onclick="navigateTo('${item.id}')">
            <i data-lucide="${item.icon}"></i>
            <span class="label">${item.label}</span>
        </div>
    `).join('') + `
        <div class="nav-btn" onclick="DB.reset()" style="margin-top:auto; opacity:0.5;">
            <i data-lucide="refresh-cw"></i>
            <span class="label">Reiniciar Sistema</span>
        </div>
    `;
    lucide.createIcons();
}

function navigateTo(viewId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-${viewId}`)?.classList.add('active');
    const content = document.getElementById('dashboardContent');
    
    content.style.opacity = '0';
    setTimeout(() => {
        document.getElementById('viewTitle').textContent = currentUser.nav.find(n => n.id === viewId)?.label || 'Admin';
        renderAdminViews(viewId, content);
        content.style.opacity = '1';
        lucide.createIcons();
    }, 200);
}

function renderAdminViews(viewId, content) {
    const liveData = DB.get();
    
    if (viewId === 'dashboard') {
        const totalChallenges = liveData.challenges.length;
        const totalSessions = liveData.sessions.length;
        
        content.innerHTML = `
            <div class="card span-2" style="background: var(--color-primary); color: white;">
                <p class="panel-label" style="color:var(--color-primary-light); filter:brightness(3); opacity:1;">FLUJO TOTAL (MOCK)</p>
                <h2 style="font-size: 3.5rem; font-weight: 800;">$${liveData.metrics.totalRevenue.toLocaleString()}</h2>
                <p style="color:var(--success); font-weight:700;">↑ 15.4% vs mes anterior</p>
            </div>
            <div class="card span-1">
                <p class="panel-label">SESIONES</p>
                <h3 style="font-size: 2.5rem; color: var(--color-primary);">${totalSessions}</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Acumuladas en sistema</p>
            </div>
            <div class="card span-1">
                <p class="panel-label">RETOS RADAR</p>
                <h3 style="font-size: 2.5rem; color: var(--color-primary);">${totalChallenges}</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted);">Desafíos activos</p>
            </div>
            <div class="card span-4">
                <p class="panel-label">FLUJO DE INTERACCIÓN EN TIEMPO REAL</p>
                <div class="info-list">
                    ${liveData.challenges.slice(-5).reverse().map(ch => `
                        <div class="info-item">
                            <div style="flex:1;">
                                <small style="color:var(--text-muted)">CLIENTE</small><br>
                                <b>${ch.clientName}</b>
                            </div>
                            <div style="flex:1;">
                                <small style="color:var(--text-muted)">MATCH IA</small><br>
                                <b>${ch.recommendedExpert || 'Buscando...'}</b>
                            </div>
                            <div style="flex:1;">
                                <small style="color:var(--text-muted)">ESTADO TX</small><br>
                                <span style="padding:4px 10px; border-radius:12px; font-size:0.75rem; background:${ch.status === 'Pagado' ? 'var(--success)' : 'var(--warning)'}; color:white;">
                                    ${ch.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (viewId === 'tx_monitor') {
        const waitingPayment = liveData.challenges.filter(c => c.status === 'Esperando Pago');
        const paid = liveData.challenges.filter(c => c.status === 'Pagado');
        
        content.innerHTML = `
            <div class="card span-2">
                <p class="panel-label">PENINTES DE PAGO</p>
                <div class="info-list" style="margin-top:1rem;">
                    ${waitingPayment.map(c => `
                        <div class="info-item" style="display:block; padding:1.25rem;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                                <b>${c.clientName}</b>
                                <span style="color:var(--warning); font-weight:800;">$200.00</span>
                            </div>
                            <p style="font-size:0.8rem; color:var(--text-muted);">${c.topic}</p>
                            <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--color-primary);">Match: ${c.recommendedExpert}</div>
                        </div>
                    `).join('') || '<p style="padding:1rem; color:var(--text-muted);">Sin cobros pendientes.</p>'}
                </div>
            </div>
            <div class="card span-2">
                <p class="panel-label">TRANSACCIONES COMPLETADAS</p>
                <div class="info-list" style="margin-top:1rem;">
                    ${paid.map(c => `
                        <div class="info-item" style="display:block; padding:1.25rem;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                                <b>${c.clientName}</b>
                                <span style="color:var(--success); font-weight:800;">PAGADO</span>
                            </div>
                            <p style="font-size:0.8rem; color:var(--text-muted);">${c.topic}</p>
                            <div style="margin-top:0.75rem; display:flex; justify-content:space-between; align-items:center;">
                                <small style="color:var(--text-muted)">Link: ${c.meetingLink.substring(0,30)}...</small>
                                <button class="btn btn-primary" style="padding:4px 10px; font-size:0.65rem;" onclick="Swal.fire('Auditoría', 'Link generado: ${c.meetingLink}', 'info')">Auditar Link</button>
                            </div>
                        </div>
                    `).join('') || '<p style="padding:1rem; color:var(--text-muted);">Sin transacciones recientes.</p>'}
                </div>
            </div>
        `;
    } else if (viewId === 'network') {
        const page = paginationState['network'] || 1;
        const paged = liveData.experts.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">GESTIÓN DE ACTIVOS EXPERTOS</p>
                <div class="info-list" style="margin-top:2rem;">
                    ${paged.map(e => `
                        <div class="info-item" style="padding:1.5rem;">
                            <div style="display:flex; align-items:center; gap:15px; flex:1;">
                                <img src="${e.img}" style="width:50px; height:50px; border-radius:12px; object-fit:cover;">
                                <div>
                                    <b style="font-size:1.1rem;">${e.name}</b><br>
                                    <small style="color:var(--text-muted); font-weight:700;">${e.specialty}</small>
                                </div>
                            </div>
                            <div style="flex:1; text-align:center;">
                                <span style="font-size:0.75rem; color:var(--text-muted);">SALA</span><br>
                                <span class="dot dot-${e.status === 'Disponible' ? 'success' : 'warning'}"></span>
                                <b>${e.status}</b>
                            </div>
                            <div style="flex:1; text-align:center;">
                                <span style="font-size:0.75rem; color:var(--text-muted);">TARIFA</span><br>
                                <b>$${e.price}/h</b>
                            </div>
                            <button class="btn btn-primary" style="padding:8px 16px; font-size:0.7rem;">EDITAR PERFIL</button>
                        </div>
                    `).join('')}
                </div>
                <div class="pagination">
                    ${Array.from({length: Math.ceil(liveData.experts.length/ITEMS_PER_PAGE)}, (_,i) => `
                        <button class="page-btn ${page === i+1 ? 'active' : ''}" onclick="changePage('network', ${i+1}, 'network')">${i+1}</button>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (viewId === 'clients') {
        const page = paginationState['clients'] || 1;
        const paged = liveData.clients.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">AUDITORÍA DE CUENTAS CORPORATIVAS</p>
                <div class="info-list" style="margin-top:2rem;">
                    ${paged.map(c => `
                        <div class="info-item" style="padding:1.5rem;">
                            <div style="flex:1;">
                                <b style="font-size:1.1rem;">${c.name}</b><br>
                                <small style="color:var(--text-muted);">${c.industry}</small>
                            </div>
                            <div style="flex:1; text-align:center;">
                                <span style="font-size:0.75rem; color:var(--text-muted);">PLAN</span><br>
                                <b style="color:var(--color-primary);">${c.plan.toUpperCase()}</b>
                            </div>
                            <div style="flex:1; text-align:center;">
                                <span style="font-size:0.75rem; color:var(--text-muted);">CRÉDITOS</span><br>
                                <b style="font-size:1.2rem;">${c.credits}</b>
                            </div>
                            <button class="btn btn-primary" style="padding:10px 20px; font-size:0.75rem;">GESTIONAR</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (viewId === 'analytics') {
        const totalCredits = liveData.clients.reduce((acc, c) => acc + c.credits, 0);
        const expertsAvailable = liveData.experts.filter(e => e.status === 'Disponible').length;
        
        content.innerHTML = `
            <div class="card span-2">
                <p class="panel-label">SALUD DE LA RED (ANTIFRAGILIDAD)</p>
                <div style="display:flex; justify-content:center; align-items:center; height:150px;">
                    <h2 style="font-size:5rem; color:var(--color-primary); font-weight:800;">${liveData.metrics.antiFragilityScore}%</h2>
                </div>
                <p style="text-align:center; color:var(--text-muted); font-size:0.9rem;">Índice de resiliencia basado en sesiones exitosas vs fallos.</p>
            </div>
            <div class="card span-2">
                <p class="panel-label">DEMANDA POR ÁREAS CRÍTICAS</p>
                <div style="margin-top:1.5rem; display:flex; flex-direction:column; gap:1rem;">
                    ${['Ciberseguridad', 'IA & Datos', 'Finanzas', 'Procesos'].map((area, i) => `
                        <div style="width:100%;">
                            <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:5px;">
                                <span style="font-weight:700;">${area}</span>
                                <span style="color:var(--text-muted);">${85 - (i*15)}%</span>
                            </div>
                            <div style="width:100%; height:8px; background:var(--bg-sidebar); border-radius:4px; overflow:hidden;">
                                <div style="width:${85 - (i*15)}%; height:100%; background:var(--color-primary); border-radius:4px;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function changePage(stateKey, page, viewId) {
    paginationState[stateKey] = page;
    navigateTo(viewId);
}

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profileImg');
    if (profileImg) profileImg.innerHTML = `<img src="${currentUser.img}" style="width:100%; height:100%; object-fit:cover;">`;
    renderNavigation();
    navigateTo('dashboard');
});
