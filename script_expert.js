/**
 * Origen Antifrágil - Lógica Experto
 */

const currentUser = {
    name: 'Ing. Silas Vane',
    role: 'EXPERTO',
    email: 'experto@antifragil.com',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    nav: [
        { id: 'dashboard', label: 'Mi Agenda', icon: 'calendar-days' },
        { id: 'radar', label: 'Radar de Oportunidades', icon: 'radar' },
        { id: 'availability', label: 'Mi Disponibilidad', icon: 'clock' },
        { id: 'sessions', label: 'Sesiones NEXO', icon: 'messages-square' },
        { id: 'earnings', label: 'Mis Honorarios', icon: 'wallet' }
    ]
};

function toggleSidebar() { 
    const sidebar = document.getElementById('sidebar');
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        sidebar.classList.toggle('mobile-open');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

function toggleProfileModal() {
    let modal = document.getElementById('profileModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profileModal';
        modal.className = 'profile-dropdown';
        modal.innerHTML = `
            <div class="profile-dropdown-header">
                <b>${currentUser.name}</b>
                <span>${currentUser.role}</span>
            </div>
            <div class="logout-btn" onclick="location.href='index.html'">
                <i data-lucide="log-out"></i>
                <span>Cerrar Sesión</span>
            </div>
        `;
        document.querySelector('.view-header').appendChild(modal);
        lucide.createIcons();
    }
    modal.classList.toggle('open');
    const closeHandler = (e) => {
        if (!modal.contains(e.target) && !e.target.closest('#profileImg') && !e.target.closest('#profileName')) {
            modal.classList.remove('open');
            document.removeEventListener('click', closeHandler);
        }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 10);
}

function renderNavigation() {
    const nav = document.getElementById('navLinks');
    const mobileNav = document.getElementById('mobileNav');

    const navHTML = currentUser.nav.map(item => `
        <div class="nav-btn" id="nav-${item.id}" onclick="navigateTo('${item.id}')">
            <i data-lucide="${item.icon}"></i>
            <span class="label">${item.label}</span>
        </div>
    `).join('');

    const mobileHTML = currentUser.nav.map(item => `
        <div class="bottom-nav-item" id="mobile-nav-${item.id}" onclick="navigateTo('${item.id}')">
            <i data-lucide="${item.icon}"></i>
            <span>${item.label.split(' ')[0]}</span>
        </div>
    `).join('');

    if (nav) nav.innerHTML = navHTML;
    if (mobileNav) mobileNav.innerHTML = mobileHTML;
    lucide.createIcons();
}

function navigateTo(viewId) {
    document.querySelectorAll('.nav-btn, .bottom-nav-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-${viewId}`)?.classList.add('active');
    document.getElementById(`mobile-nav-${viewId}`)?.classList.add('active');
    
    const content = document.getElementById('dashboardContent');
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
    const viewTitleMap = {
        'dashboard': 'Mi Agenda',
        'radar': 'Radar de Oportunidades',
        'availability': 'Mi Disponibilidad',
        'sessions': 'Sesiones NEXO',
        'earnings': 'Mis Honorarios'
    };
    document.getElementById('viewTitle').textContent = viewTitleMap[viewId] || 'Panel';
    renderExpertViews(viewId, content);
    lucide.createIcons();
}

function renderExpertViews(viewId, content) {
    const liveData = DB.get();
    const mySessions = liveData.sessions.filter(s => s.expert === currentUser.name);
    
    if (viewId === 'dashboard') {
        const agendadas = mySessions.filter(s => s.status === 'Agendada');
        const expertInfo = liveData.experts.find(e => e.name === currentUser.name) || liveData.experts[0];
        
        content.innerHTML = `
            <div class="card span-1">
                <p class="panel-label">RATING DE EXPERTO</p>
                <div style="display:flex; align-items:center; gap:0.5rem; margin-top:1rem;">
                    <h2 style="font-size: 2.5rem; color: var(--warning);">${expertInfo.rating}</h2>
                    <div style="display:flex; color: var(--warning);">
                        <i data-lucide="star" style="fill:var(--warning); width:20px;"></i>
                        <i data-lucide="star" style="fill:var(--warning); width:20px;"></i>
                        <i data-lucide="star" style="fill:var(--warning); width:20px;"></i>
                        <i data-lucide="star" style="fill:var(--warning); width:20px;"></i>
                        <i data-lucide="star-half" style="fill:var(--warning); width:20px;"></i>
                    </div>
                </div>
            </div>
            <div class="card span-1">
                <p class="panel-label">SESIONES CAPITALIZADAS</p>
                <h2 style="font-size: 2.5rem; color: var(--color-primary); margin-top:1rem;">${expertInfo.sessions}</h2>
                <p style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">+12 este mes</p>
            </div>
            <div class="card span-2">
                <p class="panel-label">HONORARIOS ACUMULADOS</p>
                <h2 style="font-size: 2.5rem; color: var(--success); margin-top:1rem;">$12,450.00</h2>
                <button class="btn btn-primary" style="width:100%; margin-top:0.5rem; padding:8px;">Retirar Fondos</button>
            </div>
            <div class="card span-4">
                <p class="panel-label">SESIONES PRÓXIMAS (MOLDALIDAD RESILIENTE)</p>
                <div class="info-list">
                    ${agendadas.length > 0 ? agendadas.map(s => `
                        <div class="info-item">
                            <span><b>${s.clientEmail}</b> | ${s.topic}</span>
                            <span>${s.date} ${s.time}</span>
                            <button class="btn btn-primary" style="padding:10px 20px; font-size:0.75rem;" onclick="enterMeetingRoom('${s.clientEmail}', '${s.meetingLink || ''}')">Iniciar Nexo-Sala</button>
                        </div>`).join('') : '<p style="padding:2rem; text-align:center; color:var(--text-muted)">Agenda libre por hoy.</p>'}
                </div>
            </div>`;
    } else if (viewId === 'radar') {
        const challenges = liveData.challenges || [];
        content.innerHTML = `
            <div class="card span-4" style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; border: none;">
                <p class="panel-label" style="color: var(--color-primary); filter: brightness(3); font-weight: 800;">IA MATCHING ENGINE</p>
                <h2 style="font-size: 2.5rem;">Radar de Oportunidades</h2>
                <p style="opacity: 0.7; margin-top: 1rem;">Desafíos para tu perfil de experto.</p>
            </div>
            ${challenges.map(ch => `
                <div class="card span-2 challenge-card">
                    <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem;"><span style="background:var(--bg-main); color:var(--color-primary); padding:4px 12px; border-radius:20px; font-size:0.7rem; font-weight:700;">${ch.tags[0]}</span><span>${ch.date}</span></div>
                    <h3 style="color:var(--color-primary); margin-bottom:1rem;">${ch.topic}</h3>
                    <p style="color:var(--text-muted); margin-bottom:2rem;">${ch.description}</p>
                    <button class="btn btn-primary" style="width:100%" onclick="postulateChallenge('${ch.topic}')">Postularse</button>
                </div>`).join('')}`;
    } else if (viewId === 'availability') {
        const availability = liveData.expertAvailability[currentUser.name] || [];
        const allSlots = liveData.schedules;
        
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">CONFIGURACIÓN DE AGENDA</p>
                <h2 style="font-size: 2rem; margin: 1rem 0;">Define tus horarios disponibles</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Los clientes solo podrán agendar sesiones en los horarios que marques como activos.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
                    ${allSlots.map(slot => `
                        <div class="availability-slot ${availability.includes(slot) ? 'active' : ''}" 
                             onclick="toggleAvailabilitySlot('${slot}')"
                             style="padding: 1.5rem; border: 2px solid ${availability.includes(slot) ? 'var(--color-primary)' : 'var(--border-main)'}; 
                                    border-radius: 16px; text-align: center; cursor: pointer; transition: all 0.2s;
                                    background: ${availability.includes(slot) ? 'var(--bg-sidebar)' : 'white'};
                                    color: ${availability.includes(slot) ? 'var(--color-primary)' : 'var(--text-muted)'};
                                    font-weight: 800;">
                            ${slot}
                            <div style="font-size: 0.65rem; margin-top: 5px;">${availability.includes(slot) ? 'DISPONIBLE' : 'BLOQUEADO'}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 2rem; padding: 1rem; background: #e8f5e9; border-radius: 12px; color: #2e7d32; font-size: 0.85rem; display: flex; align-items: center; gap: 10px;">
                    <i data-lucide="check-circle"></i> Los cambios se guardan automáticamente y se sincronizan con el radar de clientes.
                </div>
            </div>`;
    } else if (viewId === 'sessions') {
        content.innerHTML = `<div class="card span-4"><p class="panel-label">Historial NEXO</p><div class="info-list">
            ${mySessions.reverse().map(s => `<div class="info-item"><span><b>${s.clientEmail}</b></span><span>${s.topic}</span><span>${s.status}</span></div>`).join('')}
            </div></div>`;
    } else if (viewId === 'earnings') {
        content.innerHTML = `<div class="card span-2"><p class="panel-label">Saldo Liquidable</p><h2 style="font-size: 2.5rem; margin:1rem 0;">$7,190.00</h2><button class="btn btn-primary" style="width:100%;">Solicitar Pago</button></div>`;
    }
}

function toggleAvailabilitySlot(slot) {
    const liveData = DB.get();
    if (!liveData.expertAvailability) {
        liveData.expertAvailability = {};
    }
    if (!liveData.expertAvailability[currentUser.name]) {
        liveData.expertAvailability[currentUser.name] = [];
    }
    
    const index = liveData.expertAvailability[currentUser.name].indexOf(slot);
    if (index > -1) {
        liveData.expertAvailability[currentUser.name].splice(index, 1);
    } else {
        liveData.expertAvailability[currentUser.name].push(slot);
    }
    
    DB.save(liveData);
    navigateTo('availability');
}

function postulateChallenge(topic) {
    Swal.fire({
        title: '¡Postulación Enviada!',
        text: `Tu perfil ha sido enviado al cliente para el desafío: ${topic}.`,
        icon: 'success',
        confirmButtonColor: '#293838'
    });
}

function enterMeetingRoom(client, link) {
    let timerInterval;
    Swal.fire({
        title: 'Abriendo Nexo-Sala Segura',
        html: `Conectando con <b>${client}</b>...<br>Preparando tunel de datos en <b></b> ms.`,
        timer: 2000,
        timerProgressBar: true,
        confirmButtonColor: '#293838',
        didOpen: () => {
            Swal.showLoading();
            const b = Swal.getHtmlContainer().querySelector('b:last-child');
            timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft();
            }, 100);
        },
        willClose: () => { clearInterval(timerInterval); }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            Swal.fire({
                title: '¡Conexión Exitosa!',
                text: link ? `Link de Teams: ${link}` : 'Entrando a la sala virtual del experto.',
                icon: 'success',
                confirmButtonColor: '#293838'
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profileImg');
    if (profileImg) profileImg.innerHTML = `<img src="${currentUser.img}" style="width:100%; height:100%; object-fit:cover;">`;
    renderNavigation();
    navigateTo('dashboard');
});
