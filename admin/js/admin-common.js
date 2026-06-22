// =============================================================================
// VINVITE ADMIN — COMMON (auth guard, sidebar, client subnav, toast)
// Requires engine/config.js + engine/supabase-client.js loaded first.
// =============================================================================

const ADMIN_NAV = [
  { section: "Klien", items: [
    { key: "dashboard", label: "Dashboard", href: "ROOT/dashboard.html", icon: "▦" },
  ]},
  { section: "Akun", items: [
    { key: "settings", label: "Pengaturan", href: "ROOT/pages/settings.html", icon: "⚙" },
  ]},
];

const ADMIN_ONLY_NAV = {
  section: "Owner", items: [
    { key: "packages", label: "Pengaturan Paket", href: "ROOT/pages/package-settings.html", icon: "📦" },
    { key: "orders", label: "Semua Pesanan", href: "ROOT/pages/orders.html", icon: "💳" },
    { key: "users", label: "Semua Reseller", href: "ROOT/pages/users.html", icon: "👤" },
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
    <div style="padding:0 10px 14px;">
      <span class="badge ${profile && profile.role === "admin" ? "green" : "grey"}" style="background:rgba(255,255,255,.1);color:#EDE3D0;">
        ${profile && profile.role === "admin" ? "Owner" : "Reseller"}
      </span>
    </div>
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

  // Create overlay for tap-outside-to-close
  let overlay = document.getElementById("sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "sidebar-overlay";
    overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:39;";
    document.body.appendChild(overlay);
  }

  function open() {
    sidebar.classList.add("open");
    overlay.style.display = "block";
  }
  function close() {
    sidebar.classList.remove("open");
    overlay.style.display = "none";
  }

  btn.addEventListener("click", () => sidebar.classList.contains("open") ? close() : open());
  overlay.addEventListener("click", close);
};

// ---------------------------------------------------------------------------
// CLIENT-SCOPED SUBNAV
// Used on the 5 pages that operate on one specific client invitation
// (invitation-editor, themes, guests, rsvp, guestbook). All carry ?id=
// ---------------------------------------------------------------------------
const CLIENT_SUBNAV_ITEMS = [
  { key: "editor", label: "Detail", href: "invitation-editor.html" },
  { key: "tema", label: "Tema", href: "themes.html" },
  { key: "guests", label: "Tamu", href: "guests.html" },
  { key: "rsvp", label: "RSVP", href: "rsvp.html" },
  { key: "guestbook", label: "Ucapan", href: "guestbook.html" },
];

window.renderClientSubnav = function (activeKey, invitationId, label) {
  const mount = document.getElementById("client-subnav");
  if (!mount) return;
  const idParam = invitationId ? `?id=${invitationId}` : "";
  mount.innerHTML = `
    <div style="margin-bottom:18px;">
      <a href="../dashboard.html" style="font-size:.78rem;color:var(--grey);text-decoration:none;">&larr; Kembali ke Daftar Klien</a>
      ${label ? `<h2 style="font-size:1.3rem;margin-top:6px;">${label}</h2>` : ""}
      <div style="display:flex;gap:6px;margin-top:14px;flex-wrap:wrap;border-bottom:1px solid var(--border);padding-bottom:14px;">
        ${CLIENT_SUBNAV_ITEMS.map(item => `
          <a href="${item.href}${idParam}"
             style="padding:8px 14px;border-radius:100px;text-decoration:none;font-size:.82rem;font-weight:600;
                    background:${item.key === activeKey ? "var(--ink)" : "transparent"};
                    color:${item.key === activeKey ? "#fff" : "var(--ink)"};
                    border:1px solid ${item.key === activeKey ? "var(--ink)" : "var(--border)"};">
            ${item.label}
          </a>
        `).join("")}
      </div>
    </div>
  `;
};

// Reads ?id= from the current URL — used by all client-scoped pages
window.getInvitationIdFromUrl = function () {
  return new URLSearchParams(window.location.search).get("id");
};
