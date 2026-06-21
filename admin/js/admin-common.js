// =============================================================================
// VINVITE ADMIN — COMMON (auth guard, sidebar, toast)
// Requires engine/config.js + engine/supabase-client.js loaded first.
// =============================================================================

const ADMIN_NAV = [
  { section: "Undangan", items: [
    { key: "dashboard", label: "Dashboard", href: "ROOT/dashboard.html", icon: "▦" },
    { key: "editor", label: "Edit Undangan", href: "ROOT/pages/invitation-editor.html", icon: "✎" },
    { key: "tema", label: "Pilih Tema", href: "ROOT/pages/themes.html", icon: "✦" },
  ]},
  { section: "Tamu", items: [
    { key: "guests", label: "Daftar Tamu", href: "ROOT/pages/guests.html", icon: "☰" },
    { key: "rsvp", label: "RSVP", href: "ROOT/pages/rsvp.html", icon: "✓" },
    { key: "guestbook", label: "Ucapan & Doa", href: "ROOT/pages/guestbook.html", icon: "✉" },
  ]},
  { section: "Akun", items: [
    { key: "settings", label: "Pengaturan", href: "ROOT/pages/settings.html", icon: "⚙" },
  ]},
];

const ADMIN_ONLY_NAV = {
  section: "Platform Admin", items: [
    { key: "orders", label: "Semua Pesanan", href: "ROOT/pages/orders.html", icon: "💳" },
    { key: "users", label: "Semua Pengguna", href: "ROOT/pages/users.html", icon: "👤" },
  ]
};

window.vinviteToast = function (msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 2600);
};

// root = "." if this page lives directly in /admin/, or ".." if in /admin/pages/
window.requireAuth = async function (root) {
  const client = window.getVinviteClient && window.getVinviteClient();
  if (!client) {
    window.vinviteToast("Supabase belum dikonfigurasi — lihat engine/config.js");
    return null;
  }
  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    window.location.href = `${root}/login.html`;
    return null;
  }
  const { data: profile } = await client
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return { user: session.user, profile };
};

window.renderAdminSidebar = function (activeKey, root, profile) {
  const mount = document.getElementById("sidebar");
  if (!mount) return;

  let sections = ADMIN_NAV;
  if (profile && profile.role === "admin") {
    sections = [...ADMIN_NAV, ADMIN_ONLY_NAV];
  }

  const linksHtml = sections.map(sec => `
    <div class="sidebar-section">${sec.section}</div>
    ${sec.items.map(item => `
      <a class="sidebar-link ${item.key === activeKey ? "active" : ""}" href="${item.href.replace("ROOT", root)}">
        <span>${item.icon}</span> ${item.label}
      </a>
    `).join("")}
  `).join("");

  mount.innerHTML = `
    <div class="sidebar-logo">Vinvite</div>
    ${linksHtml}
    <div class="sidebar-footer">
      <p class="sidebar-user">${profile && profile.full_name ? profile.full_name : "Akun saya"}</p>
      <button class="btn btn-outline btn-sm btn-block" id="logout-btn" style="background:transparent;border-color:rgba(255,255,255,.25);color:#EDE3D0;">Keluar</button>
      <p class="sidebar-credit">Vinvite — By Victor Rizki Valentiano</p>
    </div>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    const client = window.getVinviteClient();
    if (client) await client.auth.signOut();
    window.location.href = `${root}/login.html`;
  });
};

window.initMobileSidebarToggle = function () {
  const btn = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  if (!btn || !sidebar) return;
  btn.addEventListener("click", () => sidebar.classList.toggle("open"));
};
