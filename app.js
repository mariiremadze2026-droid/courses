/* ============================================================
   LMS CORE — app.js
   DB, Auth, Courses, Submissions, UI, Particle Canvas BG
   ============================================================ */

const DB = {
  get(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem('lms_' + key)) ?? fallback; } catch { return fallback; }
  },
  set(key, val) { localStorage.setItem('lms_' + key, JSON.stringify(val)); },
  remove(key)   { localStorage.removeItem('lms_' + key); }
};

(function seedDB() {
  if (DB.get('seeded', false)) return;
  DB.set('users', [
    { id:1, username:'admin',   email:'admin@lms.ge',   password:'admin123',   role:'admin'   },
    { id:2, username:'student', email:'student@lms.ge', password:'student123', role:'student' },
    { id:3, username:'teacher', email:'teacher@lms.ge', password:'teacher123', role:'admin'   }
  ]);
  DB.set('courses', [
    { id:1, title:'JavaScript — საფუძვლებიდან პრო-მდე', description:'სრული JavaScript კურსი — ცვლადებიდან async/await-მდე. ყველა ბრაუზერი, ყველა გარემო.', instructor_id:3, category:'frontend', level:'დამწყები', duration:'42 საათი', lessons:28, thumbnail:'🟡', enrolled:234 },
    { id:2, title:'React + Hooks სრული სახელმძღვანელო',  description:'React 18, Hooks, Context API, React Router და state მენეჯმენტი პრაქტიკული პროექტებით.',     instructor_id:3, category:'frontend', level:'საშუალო', duration:'38 საათი', lessons:24, thumbnail:'🔵', enrolled:189 },
    { id:3, title:'Node.js + Express REST API',           description:'ბექენდ სერვისების აგება Node.js-ით. JWT, middleware, PostgreSQL ინტეგრაცია.',                    instructor_id:3, category:'backend',  level:'საშუალო', duration:'30 საათი', lessons:20, thumbnail:'🟢', enrolled:156 },
    { id:4, title:'Python მონაცემთა ანალიზი',            description:'Pandas, NumPy, Matplotlib — მონაცემების დამუშავება და ვიზუალიზაცია.',                            instructor_id:1, category:'data',    level:'დამწყები', duration:'26 საათი', lessons:18, thumbnail:'🐍', enrolled:201 },
    { id:5, title:'SQL + PostgreSQL',                     description:'Queries, joins, indexes, transactions — ყველაფერი, რაც საჭიროა პროფესიონალი DBA-სთვის.',        instructor_id:1, category:'backend',  level:'დამწყები', duration:'20 საათი', lessons:15, thumbnail:'🗄️', enrolled:143 },
    { id:6, title:'UX/UI Design Figma-ში',               description:'პროდუქტის დიზაინი ნულიდან. Wireframe, Prototype, Design System — ყველა ეტაპი.',                 instructor_id:1, category:'design',  level:'დამწყები', duration:'24 საათი', lessons:16, thumbnail:'🎨', enrolled:178 },
  ]);
  DB.set('lessons', [
    { id:1,  course_id:1, title:'ცვლადები და ტიპები',       duration:'45 წთ', order:1 },
    { id:2,  course_id:1, title:'ფუნქციები და სკოუფი',      duration:'52 წთ', order:2 },
    { id:3,  course_id:1, title:'Arrays და Objects',         duration:'60 წთ', order:3 },
    { id:4,  course_id:1, title:'DOM მანიპულაცია',          duration:'55 წთ', order:4 },
    { id:5,  course_id:1, title:'Promises და async/await',  duration:'68 წთ', order:5 },
    { id:6,  course_id:2, title:'React-ის შესავალი',        duration:'40 წთ', order:1 },
    { id:7,  course_id:2, title:'useState და useEffect',    duration:'55 წთ', order:2 },
    { id:8,  course_id:2, title:'Props და Component Tree',  duration:'48 წთ', order:3 },
    { id:9,  course_id:3, title:'Node.js შესავალი',         duration:'38 წთ', order:1 },
    { id:10, course_id:3, title:'Express Routing',          duration:'50 წთ', order:2 },
  ]);
  DB.set('enrollments', [
    { id:1, user_id:2, course_id:1, progress:60, enrolled_at:'2024-01-10' },
    { id:2, user_id:2, course_id:2, progress:30, enrolled_at:'2024-01-20' },
    { id:3, user_id:2, course_id:4, progress:85, enrolled_at:'2024-01-05' },
  ]);
  DB.set('submissions', [
    { id:1, assignment_id:1, student_id:2, grade:92, submitted_at:'2024-01-15', content:'...' },
    { id:2, assignment_id:2, student_id:2, grade:78, submitted_at:'2024-01-22', content:'...' },
  ]);
  DB.set('seeded', true);
})();

const Auth = {
  getUser()    { return DB.get('current_user', null); },
  isLoggedIn() { return !!this.getUser(); },
  isAdmin()    { const u = this.getUser(); return u?.role === 'admin'; },
  login(email, password) {
    const u = DB.get('users').find(u => u.email === email && u.password === password);
    if (!u) return { ok:false, error:'ელ-ფოსტა ან პაროლი არასწორია' };
    const { password:_, ...safe } = u;
    DB.set('current_user', safe);
    return { ok:true, user:safe };
  },
  register(username, email, password) {
    const users = DB.get('users');
    if (users.find(u => u.email === email)) return { ok:false, error:'ეს ელ-ფოსტა უკვე რეგისტრირებულია' };
    const nu = { id:Date.now(), username, email, password, role:'student' };
    users.push(nu);
    DB.set('users', users);
    const { password:_, ...safe } = nu;
    DB.set('current_user', safe);
    return { ok:true, user:safe };
  },
  logout() { DB.remove('current_user'); window.location.href = 'index.html'; }
};

function toast(msg, type='info') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id='toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='all 0.3s'; setTimeout(()=>t.remove(), 320); }, 3200);
}

function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open'); });

function renderNavbar({ activePage='' }={}) {
  const user = Auth.getUser();
  const nav  = document.getElementById('navbar');
  if (!nav) return;
  const pages = [
    { href:'index.html',       label:'კატალოგი',    key:'home' },
    { href:'books.html',       label:'📖 წიგნები',  key:'books' },
    { href:'assignments.html', label:'📋 დავალებები',key:'assignments' },
    { href:'dashboard.html',   label:'Dashboard',   key:'dashboard' },
    ...(user?.role==='admin' ? [{ href:'admin.html', label:'Admin', key:'admin' }] : []),
  ];
  nav.innerHTML = `
    <a href="index.html" class="nav-logo">
      <div class="nav-logo-icon">◈</div>
      LMS<span class="logo-accent">.ge</span>
    </a>
    <ul class="nav-links">
      ${pages.map(p=>`<li><a href="${p.href}" class="${activePage===p.key?'active':''}">${p.label}</a></li>`).join('')}
    </ul>
    <div class="nav-actions">
      ${user ? `
        <span style="font-size:13px;color:var(--muted)">${user.username}
          <span class="badge badge-${user.role==='admin'?'amber':'cyan'}" style="margin-left:6px">${user.role}</span>
        </span>
        <button class="btn btn-ghost btn-sm" onclick="Auth.logout()">გასვლა</button>
      ` : `
        <a href="auth.html" class="btn btn-ghost btn-sm">შესვლა</a>
        <a href="auth.html?tab=register" class="btn btn-primary btn-sm">რეგისტრაცია</a>
      `}
    </div>`;
}

const Courses = {
  all()     { return DB.get('courses'); },
  byId(id)  { return this.all().find(c=>c.id==id); },
  lessons(cid) { return DB.get('lessons').filter(l=>l.course_id==cid).sort((a,b)=>a.order-b.order); },
  enroll(uid, cid) {
    const e = DB.get('enrollments');
    if (e.find(x=>x.user_id==uid&&x.course_id==cid)) return false;
    e.push({ id:Date.now(), user_id:uid, course_id:cid, progress:0, enrolled_at:new Date().toISOString().slice(0,10) });
    DB.set('enrollments', e); return true;
  },
  isEnrolled(uid, cid) { return DB.get('enrollments').some(e=>e.user_id==uid&&e.course_id==cid); },
  enrollment(uid, cid) { return DB.get('enrollments').find(e=>e.user_id==uid&&e.course_id==cid); },
  updateProgress(uid, cid, progress) {
    const e = DB.get('enrollments');
    const x = e.find(x=>x.user_id==uid&&x.course_id==cid);
    if (x) { x.progress=progress; DB.set('enrollments',e); }
  },
  userEnrollments(uid) { return DB.get('enrollments').filter(e=>e.user_id==uid).map(e=>({...e,course:this.byId(e.course_id)})); },
  addCourse(data) {
    const c=[...this.all(),{id:Date.now(),...data,enrolled:0}];
    DB.set('courses',c); return c[c.length-1];
  },
  deleteCourse(id) { DB.set('courses',this.all().filter(c=>c.id!=id)); }
};

const Submissions = {
  all()        { return DB.get('submissions'); },
  byStudent(id){ return this.all().filter(s=>s.student_id==id); },
  add(data)    { const s=this.all(); s.push({id:Date.now(),...data,submitted_at:new Date().toISOString().slice(0,10)}); DB.set('submissions',s); }
};

function getParam(name) { return new URLSearchParams(window.location.search).get(name); }

/* ============================================================
   ANIMATED BACKGROUND — PARTICLES + STARS + AURORA
   ============================================================ */
function initBackground() {
  // Aurora blobs
  const aw = document.createElement('div');
  aw.className = 'aurora-wrap';
  aw.innerHTML = '<div class="aurora-blob"></div><div class="aurora-blob"></div><div class="aurora-blob"></div>';
  document.body.insertBefore(aw, document.body.firstChild);

  // Grid
  const gr = document.createElement('div');
  gr.className = 'grid-overlay';
  document.body.insertBefore(gr, document.body.firstChild);

  // Cursor glow
  const cg = document.createElement('div');
  cg.className = 'cursor-glow';
  cg.id = 'cursor-glow';
  document.body.appendChild(cg);
  window.addEventListener('mousemove', e => {
    cg.style.left = e.clientX + 'px';
    cg.style.top  = e.clientY + 'px';
  });

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H, particles, stars;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars     = makeStars();
    particles = makeParticles();
  }

  function makeStars() {
    return Array.from({length:160}, () => ({
      x: Math.random()*W,  y: Math.random()*H,
      r: Math.random()*1.1+0.15,
      a: Math.random()*0.45+0.08,
      t: Math.random()*Math.PI*2,
      s: Math.random()*0.018+0.004,
    }));
  }

  function makeParticles() {
    return Array.from({length:60}, () => ({
      x:  Math.random()*W,   y: Math.random()*H,
      vx: (Math.random()-0.5)*0.3,
      vy: (Math.random()-0.5)*0.3,
      r:  Math.random()*1.8+0.4,
      a:  Math.random()*0.35+0.1,
      col: Math.random()>0.55 ? '0,212,255' : Math.random()>0.5 ? '124,92,252' : '255,107,157',
      pulse: Math.random()*Math.PI*2,
      ps:   Math.random()*0.022+0.008,
    }));
  }

  function draw() {
    ctx.clearRect(0,0,W,H);

    // Stars
    for (const s of stars) {
      s.t += s.s;
      const a = s.a*(0.55+0.45*Math.sin(s.t));
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(200,210,255,${a})`;
      ctx.fill();
    }

    // Particles
    for (let i=0;i<particles.length;i++) {
      const p = particles[i];
      p.x+=p.vx; p.y+=p.vy; p.pulse+=p.ps;
      if(p.x<-8) p.x=W+8; if(p.x>W+8) p.x=-8;
      if(p.y<-8) p.y=H+8; if(p.y>H+8) p.y=-8;
      const a = p.a*(0.65+0.35*Math.sin(p.pulse));

      // Glow halo
      if(p.r>1.1) {
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
        g.addColorStop(0,`rgba(${p.col},${a*0.4})`);
        g.addColorStop(1,`rgba(${p.col},0)`);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.col},${a})`; ctx.fill();

      // Connections
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j];
        const dx=p.x-q.x, dy=p.y-q.y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          const la=(1-d/120)*0.1;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(${p.col},${la})`; ctx.lineWidth=0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

document.addEventListener('DOMContentLoaded', initBackground);
