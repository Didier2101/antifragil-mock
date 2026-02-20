/**
 * Origen Antifrágil - Lógica Cliente Centralizada
 */

const currentUser = {
    name: 'CEO Innovate Corp',
    role: 'CLIENTE PREMIUM',
    email: 'cliente@antifragil.com',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
    nav: [
        { id: 'dashboard', label: 'Panel Privado', icon: 'activity' },
        { id: 'challenges', label: 'Mis Desafíos', icon: 'zap' },
        { id: 'search', label: 'Directorio de Expertos', icon: 'search' },
        { id: 'booking', label: 'Agendar Sesión', icon: 'plus-circle' },
        { id: 'billing', label: 'Facturación', icon: 'credit-card' }
    ]
};

// Sugerencias de IA basadas en perfiles
const aiInsights = [
    {
        id: 'ins_1',
        type: 'Oportunidad',
        title: 'Optimización de Ciber-Resiliencia',
        message: 'Tras tu última sesión, nuestro motor de IA detectó una vulnerabilidad potencial en tu arquitectura de datos distribuida.',
        suggestion: 'Te recomendamos una auditoría con el Ing. Silas Vane para robustecer tus firewalls.',
        badge: 'ALTA PRIORIDAD',
        icon: 'shield-alert'
    },
    {
        id: 'ins_2',
        type: 'Escalabilidad',
        title: 'Expansión de Automatización IA',
        message: 'Tu volumen de consultas ha crecido un 40%. La estructura actual de procesos podría saturarse el próximo trimestre.',
        suggestion: 'La Dra. Elena Vance puede diseñar un plan de escalabilidad basado en agentes autónomos.',
        badge: 'ESTRATEGIA',
        icon: 'trending-up'
    }
];

let paginationState = { 'search': 1 };
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
            <span class="label">Reset System</span>
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
        document.getElementById('viewTitle').textContent = currentUser.nav.find(n => n.id === viewId)?.label || 'Panel';
        renderClientViews(viewId, content);
        content.style.opacity = '1';
        lucide.createIcons();
    }, 200);
}

function renderClientViews(viewId, content) {
    const liveData = DB.get();
    const myData = liveData.clients.find(c => c.email === currentUser.email) || liveData.clients[0];
    const mySessions = liveData.sessions.filter(s => s.clientEmail === currentUser.email);
    const myChallenges = liveData.challenges.filter(ch => ch.clientEmail === currentUser.email);

    if (viewId === 'dashboard') {
        content.innerHTML = `
            <!-- Notificaciones de IA / Recomendaciones -->
            <div class="card span-4" style="background: #fff8eb; border: 1px solid #ffeeba; padding: 1.5rem; position: relative; overflow: hidden;">
                <div style="position: absolute; top:0; right: 0; padding: 1rem; opacity: 0.1;">
                    <i data-lucide="brain-circuit" style="width: 80px; height: 80px;"></i>
                </div>
                <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1rem;">
                    <span style="background:var(--warning); color:white; padding:4px 12px; border-radius:20px; font-size:0.7rem; font-weight:800;">IA INSIGHTS</span>
                    <h4 style="color:var(--color-primary); font-weight:800;">Detección Automática de Necesidades</h4>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    ${aiInsights.map(ins => `
                        <div style="background:white; padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(0,0,0,0.05);">
                            <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
                                <b style="color:var(--color-primary); font-size: 1rem;">${ins.title}</b>
                                <span style="font-size: 0.65rem; font-weight: 800; color: var(--text-muted);">${ins.badge}</span>
                            </div>
                            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 1rem;">${ins.message}</p>
                            <div style="background: var(--bg-sidebar); padding: 0.75rem; border-radius: 12px; font-size: 0.8rem; border-left: 3px solid var(--color-primary);">
                                <b>Sugerencia:</b> ${ins.suggestion}
                            </div>
                            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 8px; font-size: 0.75rem;" onclick="navigateTo('booking')">Ver Paquete de Desafíos</button>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card span-2" style="background: linear-gradient(135deg, var(--color-primary) 0%, #1a2222 100%); color: white;">
                <p class="panel-label" style="color:var(--color-primary-light); filter:brightness(3); opacity:1;">BALANCE DE CRÉDITOS</p>
                <h2 style="font-size: 4rem; font-weight: 800; margin: 1rem 0;">${myData.credits}</h2>
                <div style="display:flex; gap:1rem;">
                    <button class="btn btn-primary" style="background:white; color:var(--color-primary); flex:1;" onclick="navigateTo('booking')">Agendar Ahora</button>
                    <button class="btn" style="border:1px solid rgba(255,255,255,0.2); color:white; flex:1;">Recargar</button>
                </div>
            </div>
            <div class="card span-2">
                <p class="panel-label">ESTADO DE LA RED</p>
                <div style="margin-top:1.5rem; display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                    <div style="background:var(--bg-sidebar); padding:1.5rem; border-radius:16px; text-align:center;">
                        <h3 style="font-size:2rem; color:var(--color-primary);">${liveData.experts.length}</h3>
                        <p style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">EXPERTOS ONLINE</p>
                    </div>
                    <div style="background:var(--bg-sidebar); padding:1.5rem; border-radius:16px; text-align:center;">
                        <h3 style="font-size:2rem; color:var(--success);">${myChallenges.length}</h3>
                        <p style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">RETOS ACTIVOS</p>
                    </div>
                </div>
            </div>
            <div class="card span-4">
                <p class="panel-label">PRÓXIMAS SESIONES ESTRATÉGICAS</p>
                <div class="info-list">
                    ${mySessions.filter(s => s.status === 'Agendada').map(s => `
                        <div class="info-item" style="padding:1.5rem;">
                            <div style="display:flex; align-items:center; gap:1rem;">
                                <div style="width:48px; height:48px; background:var(--color-primary); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white;">
                                    <i data-lucide="video"></i>
                                </div>
                                <div>
                                    <h4 style="font-weight:800; color:var(--color-primary);">${s.topic}</h4>
                                    <p style="font-size:0.8rem; color:var(--text-muted);">Con ${s.expert} • ${s.date} a las ${s.time}</p>
                                </div>
                            </div>
                            <button class="btn btn-primary" style="padding:10px 20px; font-size:0.75rem;" onclick="enterMeetingRoom('${s.expert}')">Entrar a Sala</button>
                        </div>
                    `).join('')}
                    ${mySessions.filter(s => s.status === 'Agendada').length === 0 ? '<p style="text-align:center; padding:2rem; color:var(--text-muted)">No tienes sesiones programadas.</p>' : ''}
                </div>
            </div>
        `;
    } else if (viewId === 'challenges') {
        const challenges = myChallenges;
        content.innerHTML = `
            <div class="card span-4" style="background: linear-gradient(135deg, var(--color-primary) 0%, #1a2222 100%); color: white; border: none; margin-bottom: 0;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <p class="panel-label" style="color:var(--color-primary-light); opacity: 1; filter: brightness(2.5);">ESTRATEGIA CORPORATIVA</p>
                        <h2 style="font-size: 2.5rem; margin-top: 0.5rem;">Laboratorio de Desafíos</h2>
                        <p style="opacity: 0.8; margin-top: 1rem; max-width: 500px;">Transforma tus problemas operativos en ventaja competitiva.</p>
                    </div>
                    <button class="btn btn-primary" style="background:white; color:var(--color-primary); padding: 1rem 2rem;" onclick="showNewChallengeForm()">
                        <i data-lucide="plus-circle"></i> Crear Nuevo Reto
                    </button>
                </div>
            </div>

            <div id="challengeFormContainer" class="card span-4 hidden" style="border: 2px solid var(--color-primary);">
                <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--color-primary); margin-bottom: 0.5rem;">Cuéntanos tus desafíos:</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Describe la situación y nuestros especialistas expertos analizarán tu caso.</p>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;">
                    <input type="text" id="chTopic" class="input-field" placeholder="Título del desafío">
                    <select id="chTag" class="input-field">
                        <option value="Ciberseguridad">🛡️ Ciberseguridad</option>
                        <option value="IA">🤖 IA & Datos</option>
                        <option value="Finanzas">💰 Finanzas</option>
                        <option value="Procesos">⚙️ Procesos</option>
                    </select>
                </div>
                <textarea id="chDesc" class="input-field" style="height:150px; resize:none;" placeholder="Detalla el problema aquí..."></textarea>
                <div style="display:flex; gap:1rem; justify-content:flex-end;">
                    <button class="btn" onclick="showNewChallengeForm()">Cancelar</button>
                    <button class="btn btn-primary" onclick="publishChallenge()">Publicar en el Radar</button>
                </div>
            </div>

            <div class="card span-4" style="background:transparent; border:none; box-shadow:none; padding:0;">
                <div class="info-list">
                    ${challenges.reverse().map(ch => `
                        <div class="info-item" style="display:block; padding:2rem; background:white; border: 1px solid var(--border-main); margin-bottom:1rem; border-radius:24px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                                <span style="background:var(--bg-sidebar); padding:6px 14px; border-radius:12px; font-weight:800; color:var(--color-primary);">${ch.tags[0]}</span>
                                <span style="font-size:0.75rem; color:var(--text-muted);">${ch.date}</span>
                                <span style="font-weight:800; font-size:0.75rem; color:${ch.status === 'Pagado' ? 'var(--success)' : 'var(--warning)'}">${ch.status.toUpperCase()}</span>
                            </div>
                            <h4 style="font-weight:800; font-size:1.25rem; color:var(--color-primary);">${ch.topic}</h4>
                            <p style="margin-top:1rem; color:var(--text-muted); line-height:1.6;">${ch.description}</p>
                            
                            ${ch.status === 'Esperando Pago' ? `
                                <div style="margin-top:2rem; padding:1.5rem; background:#f0f7f4; border-radius:16px; border:1px dashed var(--success); display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <b style="color:var(--success)">¡MATCH IA ENCONTRADO!</b>
                                        <p style="font-size:0.85rem; color:var(--text-muted);">Hemos encontrado al experto ideal: <b>${ch.recommendedExpert}</b></p>
                                    </div>
                                    <button class="btn btn-primary" onclick="handleChallengePayment('${ch.id}')">Pagar Desafío</button>
                                </div>
                            ` : ''}

                            ${ch.status === 'Pagado - Pendiente Agendar' ? `
                                <div style="margin-top:2rem; padding:1.5rem; background:var(--bg-sidebar); border-radius:16px; border:1px solid var(--color-primary); display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <b style="color:var(--color-primary)">PAGO RECIBIDO</b>
                                        <p style="font-size:0.85rem; color:var(--text-muted);">Selecciona un horario según la disponibilidad de <b>${ch.recommendedExpert}</b>.</p>
                                    </div>
                                    <button class="btn btn-primary" onclick="showSchedulePicker('${ch.id}', '${ch.recommendedExpert}')">Agendar Hora</button>
                                </div>
                            ` : ''}

                            ${ch.status === 'Pagado' ? `
                                <div style="margin-top:2rem; padding:1.5rem; background:var(--bg-sidebar); border-radius:16px; display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <b style="color:var(--color-primary)">SESIÓN PROGRAMADA con ${ch.recommendedExpert}</b>
                                        <p style="font-size:0.85rem; color:var(--text-muted);">Horario: <b>${ch.scheduledDate} a las ${ch.scheduledTime}</b>. Link de Teams listo.</p>
                                    </div>
                                    <button class="btn btn-primary" onclick="Swal.fire({title:'Link de Teams', text:'${ch.meetingLink}', icon:'info', confirmButtonColor:'#293838'})">Acceder a Teams</button>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                    ${challenges.length === 0 ? '<p style="text-align:center; padding:4rem; color:var(--text-muted);">No has publicado desafíos aún.</p>' : ''}
                </div>
            </div>
        `;
    } else if (viewId === 'search') {
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">RED DE EXPERTOS ANTIFRÁGIL</p>
                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:1.5rem; margin-top:2rem;">
                    ${liveData.experts.map(e => `
                        <div class="card" style="padding:2rem;">
                            <div style="display:flex; gap:1.5rem; margin-bottom:1.5rem;">
                                <img src="${e.img}" style="width:80px; height:80px; border-radius:20px; object-fit:cover;">
                                <div>
                                    <h3 style="color:var(--color-primary); font-weight:800;">${e.name}</h3>
                                    <p style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">${e.specialty}</p>
                                    <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;">
                                        <div style="display:flex; color: var(--warning);">
                                            <i data-lucide="star" style="fill:var(--warning); width:14px;"></i>
                                            <i data-lucide="star" style="fill:var(--warning); width:14px;"></i>
                                            <i data-lucide="star" style="fill:var(--warning); width:14px;"></i>
                                            <i data-lucide="star" style="fill:var(--warning); width:14px;"></i>
                                            <i data-lucide="star" style="fill:var(--warning); width:14px;"></i>
                                        </div>
                                        <span style="font-weight:700; font-size:0.85rem; color:var(--color-primary);">${e.rating}</span>
                                        <span style="color:var(--text-muted); font-size:0.75rem;">(${e.sessions} sesiones)</span>
                                    </div>
                                </div>
                            </div>
                            <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5; height:60px; overflow:hidden; margin-bottom:1.5rem;">${e.bio}</p>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-main); pt:1.5rem; padding-top:1.5rem;">
                                <b style="font-size:1.25rem; color:var(--color-primary);">$${e.price}/h</b>
                                <button class="btn btn-primary" onclick="navigateTo('booking')">Agendar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (viewId === 'booking') {
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">AGENDAR CONSULTORÍA EXPERTA</p>
                <div class="booking-container" style="margin-top:2rem;">
                    <div class="booking-form">
                        <div style="margin-bottom:1.5rem;">
                            <label style="display:block; font-size:0.85rem; font-weight:800; margin-bottom:0.5rem;">SELECCIONAR EXPERTO</label>
                            <select id="bookExpert" class="input-field" onchange="updateBookingTimeDropdown(this.value)">
                                ${liveData.experts.map(e => `<option value="${e.name}" ${e.name === 'Ing. Silas Vane' ? 'selected' : ''}>${e.name} (${e.specialty})</option>`).join('')}
                            </select>
                        </div>
                        <div style="margin-bottom:1.5rem;">
                            <label style="display:block; font-size:0.85rem; font-weight:800; margin-bottom:0.5rem;">TEMA DE LA SESIÓN</label>
                            <input type="text" id="bookTopic" class="input-field" placeholder="¿Qué problema resolveremos?">
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:2rem;">
                            <div>
                                <label style="display:block; font-size:0.85rem; font-weight:800; margin-bottom:0.5rem;">FECHA</label>
                                <input type="date" id="bookDate" class="input-field">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.85rem; font-weight:800; margin-bottom:0.5rem;">HORARIO (Disponibilidad Experto)</label>
                                <select id="bookTime" class="input-field">
                                    <!-- Dinámico -->
                                </select>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="confirmBooking()" style="padding:1.5rem; width:100%; font-size:1.1rem;">Confirmar Cita (1 Crédito)</button>
                    </div>
                </div>
            </div>
        `;
        updateBookingTimeDropdown(document.getElementById('bookExpert').value);
    } else if (viewId === 'billing') {
        content.innerHTML = `
            <div class="card span-4">
                <p class="panel-label">HISTORIAL DE FACTURACIÓN</p>
                <div class="info-list" style="margin-top:2rem;">
                    ${liveData.invoices.map(inv => `
                        <div class="info-item">
                            <div>
                                <b style="color:var(--color-primary);">${inv.id}</b>
                                <p style="font-size:0.85rem; color:var(--text-muted);">${inv.concept}</p>
                            </div>
                            <span>${inv.date}</span>
                            <b style="font-size:1.15rem;">$${inv.amount.toLocaleString()}</b>
                            <span style="background:var(--success); color:white; padding:4px 10px; border-radius:30px; font-size:0.75rem;">${inv.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function showNewChallengeForm() {
    document.getElementById('challengeFormContainer').classList.toggle('hidden');
}

function updateBookingTimeDropdown(expertName) {
    const liveData = DB.get();
    const available = liveData.expertAvailability[expertName] || [];
    const select = document.getElementById('bookTime');
    if (!select) return;
    select.innerHTML = available.map(t => `<option value="${t}">${t}</option>`).join('') || '<option value="">Sin disponibilidad</option>';
}

function publishChallenge() {
    const topic = document.getElementById('chTopic').value;
    const tag = document.getElementById('chTag').value;
    const desc = document.getElementById('chDesc').value;

    if (!topic || !desc) {
        return Swal.fire({title: 'Campos Incompletos', text: 'Por favor, cuéntanos un poco más sobre tu desafío.', icon: 'warning', confirmButtonColor: '#293838'});
    }

    Swal.fire({
        title: 'Matching con IA...',
        html: 'Nuestro motor está analizando tu desafío para encontrar al experto ideal.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => { Swal.showLoading(); },
        confirmButtonColor: '#293838'
    }).then(() => {
        const liveData = DB.get();
        const recExpert = liveData.experts.find(e => e.name === 'Ing. Silas Vane') || liveData.experts[0];
        
        liveData.challenges.push({
            id: 'ch_' + Date.now(),
            clientEmail: currentUser.email,
            clientName: currentUser.name,
            topic,
            description: desc,
            status: 'Esperando Pago',
            recommendedExpert: recExpert.name,
            date: new Date().toISOString().split('T')[0],
            tags: [tag]
        });

        DB.save(liveData);
        Swal.fire({title: '¡Match Encontrado!', text: `La IA recomienda a ${recExpert.name}. Completa el pago para agendar tu sesión.`, icon: 'success', confirmButtonColor: '#293838'}).then(() => { navigateTo('challenges'); });
    });
}

function handleChallengePayment(chId) {
    Swal.fire({
        title: 'Confirmar Pago del Reto',
        text: 'Se descontará 1 crédito para liberar la agenda del experto.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Confirmar Pago',
        confirmButtonColor: '#293838'
    }).then((result) => {
        if (result.isConfirmed) {
            const liveData = DB.get();
            const ch = liveData.challenges.find(c => c.id === chId);
            const client = liveData.clients.find(cl => cl.email === currentUser.email);
            
            if (client.credits < 1) return Swal.fire('Error', 'No tienes créditos suficientes.', 'error');

            client.credits -= 1;
            ch.status = 'Pagado - Pendiente Agendar';

            DB.save(liveData);
            Swal.fire({title: '¡Pago Exitoso!', text: 'Ahora selecciona el horario de tu preferencia.', icon: 'success', confirmButtonColor: '#293838'}).then(() => { navigateTo('challenges'); });
        }
    });
}

function showSchedulePicker(chId, expertName) {
    const liveData = DB.get();
    const available = liveData.expertAvailability[expertName] || [];
    
    if (available.length === 0) return Swal.fire('Sin Disponibilidad', 'El experto no tiene horarios habilitados actualmente.', 'warning');

    Swal.fire({
        title: 'Programar Sesión con ' + expertName,
        html: `
            <div style="text-align:left; margin-top:1rem;">
                <label style="font-size:0.8rem; font-weight:800;">SELECCIONA UNA FECHA</label>
                <input type="date" id="swalDate" class="input-field" style="margin-bottom:1rem;">
                <label style="font-size:0.8rem; font-weight:800;">HORARIOS DISPONIBLES DE ${expertName.toUpperCase()}</label>
                <select id="swalTime" class="input-field">
                    ${available.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
            </div>
        `,
        confirmButtonText: 'Confirmar y Generar Link',
        confirmButtonColor: '#293838',
        preConfirm: () => {
            return {
                date: document.getElementById('swalDate').value,
                time: document.getElementById('swalTime').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed && result.value.date) {
            const liveData = DB.get();
            const ch = liveData.challenges.find(c => c.id === chId);
            
            ch.status = 'Pagado';
            ch.scheduledDate = result.value.date;
            ch.scheduledTime = result.value.time;
            ch.meetingLink = 'https://teams.microsoft.com/l/meetup-join/nexo-room-' + Math.random().toString(36).substring(7);

            // Crear la sesión oficial en la agenda de ambos
            liveData.sessions.push({
                id: 'ses_' + Date.now(),
                clientEmail: currentUser.email,
                expert: expertName,
                date: ch.scheduledDate,
                time: ch.scheduledTime,
                topic: ch.topic,
                status: 'Agendada',
                meetingLink: ch.meetingLink
            });

            DB.save(liveData);
            Swal.fire({title: '¡Cita Confirmada!', text: 'Tu enlace de Teams ha sido generado con éxito.', icon: 'success', confirmButtonColor: '#293838'}).then(() => { navigateTo('challenges'); });
        }
    });
}

function confirmBooking() {
    const expert = document.getElementById('bookExpert').value;
    const topic = document.getElementById('bookTopic').value;
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;

    if (!topic || !date || !time) return Swal.fire('Atención', 'Detalles incompletos.', 'info');

    const liveData = DB.get();
    const client = liveData.clients.find(c => c.email === currentUser.email);
    
    if (client.credits <= 0) return Swal.fire('Saldo Insuficiente', 'No tienes créditos.', 'error');

    Swal.fire({
        title: '¿Confirmar Reserva?',
        text: `Se descontará 1 crédito para tu sesión con ${expert} el ${date}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#293838'
    }).then((result) => {
        if (result.isConfirmed) {
            client.credits -= 1;
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
            Swal.fire({title: '¡Sesión Confirmada!', icon: 'success', confirmButtonColor: '#293838'}).then(() => navigateTo('dashboard'));
        }
    });
}

function enterMeetingRoom(expert) {
    let timerInterval;
    Swal.fire({
        title: 'Estableciendo Conexión Segura',
        html: `Conectando con la sala de <b>${expert}</b> en <b></b> ms.`,
        timer: 2000,
        timerProgressBar: true,
        confirmButtonColor: '#293838',
        didOpen: () => {
            Swal.showLoading();
            const b = Swal.getHtmlContainer().querySelector('b:last-child');
            timerInterval = setInterval(() => { b.textContent = Swal.getTimerLeft(); }, 100);
        },
        willClose: () => { clearInterval(timerInterval); }
    }).then(() => {
        Swal.fire({title: 'Nexo-Sala Lista', text: 'Conexión establecida.', icon: 'success', confirmButtonColor: '#293838'});
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profileImg');
    if (profileImg) profileImg.innerHTML = `<img src="${currentUser.img}" style="width:100%; height:100%; object-fit:cover;">`;
    renderNavigation();
    navigateTo('dashboard');
});
