import * as U from './ui.js';
import {basicViews} from './views.js';
import {analysisViews} from './analysis.js';
const {esc,fmt,date,total,icon,badge,btn,link,panel,table,numberCell,label,options,field,formNote,summary,flow,own,scopedRecaps,scopedRanking,names,polresMenu,polsekMenu}=U;
const app=document.querySelector('#app'),dialog=document.querySelector('#detail-dialog');
let D,state,previousFocus,toastTimer;
const sessionGet=key=>{try{return sessionStorage.getItem(key)}catch{return null}};
const sessionSet=(key,value)=>{try{value===null?sessionStorage.removeItem(key):sessionStorage.setItem(key,value)}catch{}};
function deepFreeze(value){if(value&&typeof value==='object'){Object.freeze(value);Object.values(value).forEach(deepFreeze)}return value}
function routeParts(){const [route='dashboard',tab='']=location.hash.slice(1).split('/');return {route:route||'dashboard',tab}}
function ctx(){return {D,...state,...routeParts(),period:D.periods.find(p=>p.id===state.periodId)}}
function roleTitle(){return state.role==='polres'?'Admin Humas Polres':'Admin Humas Polsek'}
function toast(text){clearTimeout(toastTimer);const element=document.querySelector('#toast');element.textContent=text;element.classList.add('visible');toastTimer=setTimeout(()=>element.classList.remove('visible'),4200)}
function landing(){
 document.title='Showcase Website — Humas Polres Subang';
 app.innerHTML='<main class="entry"><section class="entry-story"><div class="entry-brand"><img src="logo-polres-subang.png" alt="Lambang Polres Subang"><div><strong>Humas Polres Subang</strong><br><small>Showcase portofolio • Dewi Embun Permata Dini</small></div></div><div class="eyebrow" style="color:#ffb68b">SISTEM INFORMASI BERBASIS WEB</div><h1>Lihat seluruh fitur.<br>Dari dua sudut pandang.</h1><p>Telusuri alur pengelolaan aktivitas media sosial, analisis K-Means, dan pelaporan pada satu pratinjau website.</p><div class="entry-flow"><span>Rekap</span><b>→</b><span>Dataset</span><b>→</b><span>K-Means</span><b>→</b><span>Ranking & Laporan</span></div><p class="entry-foot">Ini adalah showcase terpisah dari demo interaktif K-Means.<br>Bukan website resmi atau layanan operasional kepolisian.</p></section><section class="entry-choice">'+badge('DATA DUMMY • READ-ONLY','orange')+'<h2>Pilih sudut pandang</h2><p class="muted">Tidak perlu akun atau password. Pilihan ini hanya mengganti tampilan, bukan melakukan login.</p><article class="role-card">'+icon('polseks')+'<h3>Admin Humas Polres</h3><p>Lihat pengelolaan seluruh Polsek, preprocessing, analisis, laporan, crawling, serta komunikasi internal.</p>'+btn('Lihat POV Admin Polres','enter','data-role="polres"','primary')+'</article><article class="role-card">'+icon('profile')+'<h3>Admin Humas Polsek</h3><p>Lihat dashboard, rekap, ranking, dan laporan unit sendiri; juga pengumuman serta pesan dari Polres.</p><div class="field" style="margin-bottom:12px"><label for="entry-polsek">Pilih Polsek contoh</label><select id="entry-polsek">'+options(D.polseks.map(p=>[p.id,p.name]),state.pid)+'</select></div>'+btn('Lihat POV Admin Polsek','enter','data-role="polsek"','primary')+'</article><p class="disclaimer">Semua angka, akun operator, percakapan, konten, dan hasil analisis dibuat khusus sebagai data dummy. Token, ID akun Instagram, dan kredensial asli tidak disertakan.</p></section></main>';
}
function render(){
 if(!state.role){landing();return}
 const allowed=state.role==='polres'?polresMenu:polsekMenu;
 if(![...allowed,'profile','overview'].includes(routeParts().route)){location.hash='dashboard';toast('Halaman tersebut tersedia pada POV Admin Polres.');return}
 const c=ctx(),p=own(c),menu=allowed.map(route=>'<a href="#'+route+'" class="'+(route===c.route?'active':'')+'" '+(route===c.route?'aria-current="page"':'')+'>'+icon(route)+'<span>'+esc(names[route])+'</span>'+((route==='messages'||(route==='announcements'&&state.role==='polsek'))?'<span class="badge">contoh</span>':'')+'</a>').join('');
 app.innerHTML='<aside class="sidebar" id="sidebar"><a class="brand" href="#dashboard"><img src="logo-polres-subang.png" alt=""><div><strong>Humas Polres Subang</strong><small>Internal Info System</small></div></a><div class="sidebar-mode">POV PRATINJAU<strong>'+esc(roleTitle())+'</strong>'+(state.role==='polsek'?esc(p.name):'Cakupan seluruh Polsek')+'</div><nav class="side-nav" aria-label="Menu utama">'+menu+'</nav><footer class="sidebar-footer"><a href="#profile" '+(c.route==='profile'?'aria-current="page"':'')+'>'+icon('profile')+'<span>Profil</span></a><button data-action="exit">'+icon('exit')+'<span>Keluar Pratinjau</span></button></footer></aside><div class="workspace"><header class="topbar"><div class="topbar-left"><button type="button" class="icon-btn menu-toggle" data-action="menu" aria-label="Buka menu">'+icon('menu')+'</button><div class="breadcrumb">Home <span style="margin:0 10px">›</span> '+esc(names[c.route])+'</div><label>POV<select id="role-select" aria-label="Sudut pandang pengguna">'+options([['polres','Admin Polres'],['polsek','Admin Polsek']],state.role)+'</select></label></div><div class="topbar-right">'+(state.role==='polsek'?'<label>Unit<select id="polsek-select" aria-label="Polsek yang dilihat">'+options(D.polseks.map(p=>[p.id,p.name]),state.pid)+'</select></label>':'')+'<label>Periode<select id="period-select" aria-label="Periode data dummy">'+options(D.periods.map(p=>[p.id,p.label]),state.periodId)+'</select></label><button class="icon-btn" data-action="notifications" aria-label="Lihat notifikasi contoh">'+icon('bell')+'</button><div class="topbar-user small"><strong>'+esc(state.role==='polres'?'Operator Contoh Polres':p.admin)+'</strong><div class="muted">'+esc(roleTitle())+'</div></div><div class="avatar">'+(state.role==='polres'?'AP':'AS')+'</div></div></header><div class="preview-strip"><span><strong>DATA DUMMY · READ-ONLY</strong> — Tidak terhubung ke akun, API, atau database asli.</span><a href="#overview">Peta fitur ↗</a></div><main id="main" tabindex="-1"></main></div>';
 renderMain();
 document.querySelectorAll('.side-nav a,.sidebar-footer a').forEach(a=>a.addEventListener('click',()=>document.querySelector('#sidebar')?.classList.remove('open')));
}
function renderMain(){
 const c=ctx(),view={...basicViews,...analysisViews}[c.route];
 document.title=names[c.route]+' — Showcase '+roleTitle();
 document.querySelector('#main').innerHTML=view(c)+'<footer class="site-foot"><span>Portofolio Dewi Embun Permata Dini • Bukan layanan resmi kepolisian</span><span>Seluruh data dan hasil analisis: DUMMY</span></footer>';
}
function showDialog(title,body,subtitle='Data dummy • pratinjau read-only'){
 previousFocus=document.activeElement;
 document.querySelector('#dialog-content').innerHTML='<header class="dialog-head"><div><h2 id="dialog-title">'+esc(title)+'</h2><p>'+esc(subtitle)+'</p></div><button class="icon-btn" data-action="close-dialog" aria-label="Tutup detail">'+icon('close')+'</button></header><div class="dialog-body">'+body+'</div><footer class="dialog-foot"><span>Tidak ada perubahan atau permintaan ke server asli.</span>'+btn('Tutup','close-dialog')+'</footer>';
 if(!dialog.open)dialog.showModal();
}
function closeDialog(){dialog.close();previousFocus?.focus?.()}
function previewForm(title,fields,explanation=''){
 showDialog(title,formNote+(explanation?'<p class="small muted" style="margin-bottom:16px">'+esc(explanation)+'</p>':'')+'<form class="form-grid">'+fields+'<div class="field wide"><button class="btn primary" disabled>Simpan — dinonaktifkan pada showcase</button></div></form>');
}
function assertAdmin(){if(state.role!=='polres'){toast('Fitur ini tersedia pada POV Admin Polres.');return false}return true}
function findPolsek(id){return D.polseks.find(p=>p.id===Number(id))}
function detail(action,id){
 const c=ctx(),p=findPolsek(id);
 if(['polsek','polsek-edit','polsek-add','polsek-status','polsek-delete','user','user-edit','user-add','user-reset','user-status','user-delete','instagram-settings','crawl-preview','crawl-job','post','dataset-preview','normalization-preview','kmeans-preview','announcement-add','announcement-edit','recap-add'].includes(action)&&!assertAdmin())return;
 if(action==='polsek')return showDialog(p.name,summary([['Kode',p.code],['Nama Polsek',p.name],['Kecamatan',p.district],['Status','Aktif (data contoh)'],['Admin terhubung',p.admin],['Instagram','Data akun tidak dipublikasikan']])+'<div class="actions" style="margin-top:20px">'+btn('Pratinjau edit','polsek-edit','data-id="'+p.id+'"')+btn('Pratinjau status','polsek-status','data-id="'+p.id+'"')+btn('Pratinjau hapus','polsek-delete','data-id="'+p.id+'"')+'</div>');
 if(action==='polsek-add'||action==='polsek-edit')return previewForm(action==='polsek-add'?'Tambah Polsek':'Edit '+p.name,field('code','Kode',p?.code??'')+field('name','Nama Polsek',p?.name??'')+field('district','Kecamatan',p?.district??'')+field('address','Alamat','Data alamat tidak dipublikasikan')+field('status','Status','Aktif (dummy)'), 'Profil unit dan admin yang terhubung ditampilkan sebagai pratinjau.');
 if(action==='polsek-status'||action==='polsek-delete')return showDialog(action==='polsek-status'?'Ubah Status Polsek':'Hapus Polsek',formNote+summary([['Polsek',p.name],['Status saat ini','Aktif (dummy)']])+'<p class="small muted" style="margin-top:16px">Tindakan ini memengaruhi data master pada website asli dan dinonaktifkan pada showcase.</p><button class="btn primary" disabled style="margin-top:16px">Konfirmasi — nonaktif</button>');
 if(action==='user')return showDialog('Detail Admin Polsek',summary([['Nama lengkap',p.admin],['Username dummy',p.username],['Role','Admin Humas Polsek'],['Unit',p.name],['Status','Aktif (dummy)'],['Akun asli','Tidak diekspor']])+'<div class="actions" style="margin-top:20px">'+btn('Pratinjau edit','user-edit','data-id="'+p.id+'"')+btn('Pratinjau status','user-status','data-id="'+p.id+'"')+btn('Pratinjau reset password','user-reset','data-id="'+p.id+'"')+btn('Pratinjau hapus','user-delete','data-id="'+p.id+'"')+'</div>');
 if(action==='user-edit'||action==='user-add')return previewForm(action==='user-add'?'Tambah Admin Polsek':'Edit Admin Polsek',field('fullName','Nama lengkap',p?.admin??'')+field('username','Username',p?.username??'')+field('unit','Polsek',p?.name??'Pilih Polsek')+field('status','Status','Aktif (dummy)')+(action==='user-add'?field('password','Password','','password')+field('confirm','Konfirmasi password','','password'):''),'Akun contoh tidak dapat digunakan untuk login. Password asli tidak disertakan.');
 if(['user-reset','user-status','user-delete'].includes(action))return showDialog({'user-reset':'Reset Password','user-status':'Ubah Status User','user-delete':'Hapus User'}[action],formNote+summary([['User',p.admin],['Polsek',p.name],['Status','Aktif (dummy)']])+(action==='user-reset'?'<div class="form-grid" style="margin-top:16px">'+field('password','Password baru','','password')+field('confirm','Konfirmasi','','password')+'</div>':'')+'<button class="btn primary" disabled style="margin-top:20px">Konfirmasi — nonaktif</button>');
 if(action==='recap'){
  const r=c.period.recaps.find(r=>r.id===id);if(!r||(state.role==='polsek'&&r.polsekId!==state.pid))return toast('Rekap tidak tersedia pada scope ini.');
  return showDialog('Informasi Aktivitas Media Sosial',summary([['Polsek',findPolsek(r.polsekId).name],['Tanggal',date(r.date)],['Status','Disetujui'],['Total publikasi',fmt(r.total)]])+table(['Platform','Jumlah aktivitas'],D.platforms.map((f,j)=>[esc(f.name),numberCell(r.values[j])]))+'<p class="small muted" style="margin-top:15px">'+esc(r.note)+'</p>');
 }
 if(action==='recap-add')return previewForm('Tambah Rekap Aktivitas',field('unit','Polsek contoh',own(c).name)+field('date','Tanggal Rekap',c.period.to,'date')+D.platforms.map(f=>field('platform'+f.id,f.name,0,'number')).join(''),'Input berupa jumlah aktivitas, bukan tautan publikasi. Pada versi terbaru, data valid langsung berstatus disetujui.');
 if(action==='instagram-settings')return showDialog('Privasi Pengaturan Instagram','<div class="security-panel">'+icon('lock')+'<h3 style="margin-top:12px">Konfigurasi akun tidak dipublikasikan</h3><p>Website asli menggunakan pengaturan akun Instagram dan konfigurasi server untuk pengambilan data. Showcase tidak menyertakan token, ID akun Instagram, password, atau koneksi API—baik pada tampilan maupun file publiknya.</p><p style="margin-top:12px">Ini bukan token yang hanya disamarkan. Nilai kredensial memang tidak diekspor.</p></div>');
 if(action==='crawl-preview')return showDialog('Pratinjau Crawling Instagram',formNote+'<div class="form-grid">'+field('from','Dari tanggal',c.period.from,'date')+field('to','Sampai tanggal',c.period.to,'date')+'</div>'+flow(['Instagram','Meta Graph API','Sistem','Basis data'])+'<p class="small muted">Pada showcase tidak ada panggilan API, token, atau akses ke akun Instagram.</p><button class="btn primary" disabled style="margin-top:16px">Mulai Crawling — nonaktif</button>');
 if(action==='crawl-job'){
  const j=D.crawlJobs.find(j=>j.id===id);return showDialog('Riwayat Crawling '+j.id,summary([['Job',j.id],['Dibuat',j.date],['Dari tanggal',date(j.from)],['Sampai tanggal',date(j.to)],['Status',j.status],['Jumlah contoh',j.count]])+'<p class="small muted" style="margin-top:15px">Job ini merupakan data generate; tidak pernah menjalankan crawling langsung.</p>');
 }
 if(action==='post'){
  const post=D.posts.find(p=>p.id===id);return showDialog('Data Publikasi Contoh',summary([['ID publikasi contoh',post.id],['Jenis media',post.mediaType],['Waktu',post.time],['Permalink',post.permalink],['Jumlah suka',post.likes],['Jumlah komentar',post.comments]])+'<p style="margin-top:18px">'+esc(post.caption)+'</p>');
 }
 if(action==='dataset-preview')return showDialog('Pembentukan Dataset Bulanan',formNote+flow(['Rekap disetujui','Polsek aktif','Jumlah per platform','Snapshot'])+summary([['Periode contoh',c.period.label],['Rekap sumber',fmt(c.period.recaps.length)],['Objek','21 Polsek'],['Fitur','6 platform']])+'<p class="small muted" style="margin:16px 0">Data yang ditampilkan sudah disiapkan dari rekap dummy. Tidak membuat snapshot baru ketika tombol dibuka.</p><button class="btn primary" disabled>Bentuk Dataset — nonaktif</button>');
 if(action==='normalization-preview')return showDialog('Pratinjau Normalisasi Min-Max',formNote+summary([['Sumber','Dataset dummy '+c.period.label],['Rumus','(X − Xmin) / (Xmax − Xmin)'],['Rentang','0–1'],['Presisi penyimpanan contoh','8 desimal']])+'<p class="small muted" style="margin:16px 0">Hasil sudah disiapkan dari data sintetis. Tidak memproses data baru pada showcase.</p><button class="btn primary" disabled>Jalankan Normalisasi — nonaktif</button>');
 if(action==='kmeans-preview')return showDialog('Pratinjau Parameter K-Means',formNote+summary([['Input','Normalisasi dummy '+c.period.label],['Jumlah cluster','3'],['Metode pusat awal','Deterministic Farthest-First'],['Maksimum iterasi','100'],['Toleransi','0,000001'],['Evaluasi','Davies-Bouldin Index']])+'<p class="small muted" style="margin:16px 0">Hasil contoh tersedia pada tab tahap K-Means. Showcase ini tidak menggantikan demo interaktif untuk mencoba algoritma.</p><button class="btn primary" disabled>Jalankan K-Means — nonaktif</button>');
 if(action==='ranking-detail'){
  const row=c.period.ranking.find(r=>r.polsek_id===Number(id));if(!row||(state.role==='polsek'&&row.polsek_id!==state.pid))return toast('Hasil tidak tersedia pada scope ini.');
  const item=c.period.items.find(r=>r.polsek_id===row.polsek_id),norm=c.period.normalization.items.find(r=>r.polsek_id===row.polsek_id);
  return showDialog('Detail Ranking '+row.polsek_name,summary([['Periode',c.period.label],['Peringkat',row.rank+' / 21'],['Cluster','C'+row.cluster_number],['Kategori','Kinerja '+row.cluster_label],['Skor',fmt(row.score,4)],['Jarak ke centroid akhir',fmt(row.distance_to_centroid,8)]])+table(['Platform','Aktivitas bulanan','Normalisasi'],D.platforms.map((f,j)=>[esc(f.name),numberCell(item.raw[j]),numberCell(norm.values[j],8)]))+'<p class="small muted" style="margin-top:15px">Skor = rata-rata normalisasi × 100. Semua angka adalah data dummy.</p>');
 }
 if(action==='announcement'||action==='announcement-edit'){
  const a=D.announcements.find(a=>a.id===Number(id));if(!a||(state.role==='polsek'&&a.audience!=='all'&&a.target!==state.pid))return toast('Pengumuman tidak ditujukan ke POV ini.');
  if(action==='announcement')return showDialog(a.title,summary([['Tanggal',date(a.date)],['Penerima',a.audience==='all'?'Semua Polsek':findPolsek(a.target).name],['Pengirim','Operator Contoh Polres'],['Status baca','Contoh, tidak berubah saat dibuka']])+'<p style="margin-top:18px">'+esc(a.body)+'</p>');
  return previewForm('Edit Pengumuman',field('title','Judul',a.title)+field('audience','Penerima',a.audience==='all'?'Semua Polsek':findPolsek(a.target).name)+'<div class="field wide"><label for="announcement-body">Isi pengumuman</label><textarea id="announcement-body" readonly>'+esc(a.body)+'</textarea></div>');
 }
 if(action==='announcement-add')return previewForm('Buat Pengumuman',field('title','Judul','')+field('audience','Penerima','Semua Polsek / Polsek tertentu')+'<div class="field wide"><label for="announcement-body">Isi pengumuman</label><textarea id="announcement-body" readonly placeholder="Pratinjau formulir"></textarea></div>','Penerima dapat dipilih untuk seluruh Polsek atau khusus suatu Polsek pada website asli.');
 if(action==='notifications'){
  const announcements=D.announcements.filter(a=>state.role==='polres'||a.audience==='all'||a.target===state.pid);
  return showDialog('Notifikasi Contoh','<p class="small muted" style="margin-bottom:16px">Ringkasan pesan dan pengumuman dummy. Tidak terhubung ke status baca pengguna asli.</p><div class="list">'+(state.role==='polres'?'<div class="list-item"><span>Contoh pesan masuk dari Admin Polsek</span>'+link('Buka','messages','tiny')+'</div>':'<div class="list-item"><span>Contoh pesan dari Admin Polres</span>'+link('Buka','messages','tiny')+'</div>')+announcements.map(a=>'<div class="list-item"><span>'+esc(a.title)+'</span>'+btn('Baca','announcement','data-id="'+a.id+'"','tiny')+'</div>').join('')+'</div>');
 }
}
function exportCsv(kind){
 const c=ctx(),adminKinds=['polseks','dataset','normalized','crawling','clustering'];if(adminKinds.includes(kind)&&!assertAdmin())return;
 let headers,rows;
 if(kind==='polseks'){headers=['Kode','Polsek','Kecamatan','Admin Dummy','Status'];rows=D.polseks.map(p=>[p.code,p.name,p.district,p.admin,'Aktif']);}
 if(kind==='recaps'){
  headers=['Tanggal','Polsek',...D.platforms.map(f=>f.name),'Total','Status'];
  rows=scopedRecaps(c).filter(r=>(!state.filters.unit||r.polsekId===Number(state.filters.unit))&&(!state.filters.from||r.date>=state.filters.from)&&(!state.filters.to||r.date<=state.filters.to)&&findPolsek(r.polsekId).name.toLowerCase().includes((state.filters.q??'').toLowerCase())).map(r=>[r.date,findPolsek(r.polsekId).name,...r.values,r.total,'Disetujui']);
 }
 if(kind==='dataset'||kind==='normalized'){headers=['Polsek',...D.platforms.map(f=>f.name)];rows=(kind==='dataset'?c.period.items:c.period.normalization.items).map(p=>[p.polsek_name,...(kind==='dataset'?p.raw:p.values)]);}
 if(['ranking','reports','clustering'].includes(kind)){
  headers=['Peringkat','Polsek','Cluster','Kategori','Skor','Jarak akhir','Total publikasi'];
  let data=scopedRanking(c);if(kind==='ranking')data=data.filter(r=>(!state.filters.cluster||r.cluster_label===state.filters.cluster)&&r.polsek_name.toLowerCase().includes((state.filters.q??'').toLowerCase()));
  rows=data.map(p=>[p.rank,p.polsek_name,'C'+p.cluster_number,p.cluster_label,p.score,p.distance_to_centroid,p.activity_total]);
 }
 if(kind==='crawling'){headers=['ID publikasi contoh','Caption','Jenis media','Waktu','Permalink','Suka','Komentar'];rows=D.posts.map(p=>[p.id,p.caption,p.mediaType,p.time,p.permalink,p.likes,p.comments]);}
 if(!rows)return;
 const safeCsv=v=>{let s=String(v??'');if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
 const text='\uFEFF'+[['DATA DUMMY - SHOWCASE PORTOFOLIO - BUKAN DATA PENELITIAN'],headers,...rows].map(row=>row.map(safeCsv).join(',')).join('\r\n');
 const objectUrl=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');
 a.href=objectUrl;a.download='SHOWCASE-DUMMY-'+kind+'-'+state.periodId+(state.role==='polsek'?'-'+own(c).code:'')+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
 toast('CSV data dummy diekspor sesuai scope dan filter.');
}
document.addEventListener('click',e=>{
 const anchor=e.target.closest('dialog a[href^="#"]');if(anchor)closeDialog();
 const b=e.target.closest('[data-action]');if(!b||b.disabled||!state)return;
 const action=b.dataset.action,id=b.dataset.id;
 if(action==='enter'){
  state.role=b.dataset.role;
  if(state.role==='polsek')state.pid=Number(document.querySelector('#entry-polsek').value);
  sessionSet('showcaseRole',state.role);sessionSet('showcasePolsek',String(state.pid));location.hash='dashboard';render();return;
 }
 if(action==='exit'||action==='switch-pov'){state.role=null;sessionSet('showcaseRole',null);state.filters={};closeDialogIfOpen();render();return}
 if(action==='menu'){document.querySelector('#sidebar').classList.toggle('open');return}
 if(action==='close-dialog'){closeDialog();return}
 if(action==='contact'){if(state.role!=='polres')return;state.contact=Number(id);renderMain();return}
 if(action==='reset-filter'){state.filters={};renderMain();return}
 if(action==='page'){state.filters.page=Math.max(1,Number(b.dataset.page));renderMain();return}
 if(action==='period-view'){state.periodId=id;state.filters={};location.hash=b.dataset.route;render();return}
 if(action==='csv'){exportCsv(b.dataset.kind);return}
 if(action==='print'){if(routeParts().route==='reports')window.print();return}
 detail(action,id);
});
function closeDialogIfOpen(){if(dialog.open)dialog.close()}
document.addEventListener('change',e=>{
 if(!state)return;
 if(e.target.id==='role-select'){
  state.role=e.target.value;state.filters={};sessionSet('showcaseRole',state.role);closeDialogIfOpen();
  const allowed=state.role==='polres'?polresMenu:polsekMenu;if(![...allowed,'profile','overview'].includes(routeParts().route))location.hash='dashboard';
  render();return;
 }
 if(e.target.id==='polsek-select'){state.pid=Number(e.target.value);state.filters={};sessionSet('showcasePolsek',String(state.pid));render();return}
 if(e.target.id==='period-select'){state.periodId=e.target.value;state.filters={};state.iteration=1;render();return}
 if(e.target.id==='iteration-select'){state.iteration=Number(e.target.value);renderMain()}
});
document.addEventListener('submit',e=>{
 e.preventDefault();if(!state)return;
 if(e.target.matches('[data-filter]')){state.filters={...Object.fromEntries(new FormData(e.target).entries()),page:1};renderMain()}
});
window.addEventListener('hashchange',()=>{if(!state)return;state.filters={};closeDialogIfOpen();render()});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()}});
try{
 const response=await fetch(new URL('./showcase-data.json',import.meta.url),{cache:'no-cache'});if(!response.ok)throw Error('Data contoh tidak tersedia.');
 D=deepFreeze(await response.json());
 const savedRole=sessionGet('showcaseRole'),savedPolsek=Number(sessionGet('showcasePolsek')),defaultPolsek=D.polseks.find(p=>p.code==='binong').id;
 state={role:['polres','polsek'].includes(savedRole)?savedRole:null,pid:D.polseks.some(p=>p.id===savedPolsek)?savedPolsek:defaultPolsek,periodId:D.periods[0].id,contact:defaultPolsek,filters:{},iteration:1};
 render();
}catch(error){app.innerHTML='<main class="loading"><h1>Showcase belum dapat dimuat</h1><p>Pastikan halaman dibuka melalui alamat website, bukan langsung dari file komputer. Muat ulang atau coba kembali setelah koneksi tersedia.</p><p class="small muted">'+esc(error.message)+'</p></main>';console.error(error)}
