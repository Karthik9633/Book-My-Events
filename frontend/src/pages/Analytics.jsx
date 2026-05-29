// Analytics.jsx — restyled to match BookMyEvent brand
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchMyEvents } from "../api/eventApi";
import API from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, Ticket, Users, IndianRupee,
  Calendar, MapPin, ChevronDown, ChevronUp, ArrowLeft,
} from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("en-IN").format(n ?? 0);
const fmtCur = (n) => `₹${fmt(n)}`;

const TIER_COLORS = ["#7c3aed", "#a855f7", "#6d28d9", "#8b5cf6", "#c4b5fd", "#ddd6fe"];

//Stat Card 
const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div style={{
    background: "#fff",
    border: "1.5px solid #e9e3ff",
    borderRadius: 16,
    padding: "24px",
    display: "flex", flexDirection: "column", gap: 12,
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ color: "#6b7280", fontSize: 13, fontWeight: 500 }}>{label}</span>
      <span style={{
        padding: "8px",
        borderRadius: 10,
        background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={17} style={{ color }} />
      </span>
    </div>
    <p style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 28, fontWeight: 800,
      color: "#111827", margin: 0,
      letterSpacing: "-0.02em",
    }}>{value}</p>
    {sub && <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>{sub}</p>}
  </div>
);

// Tier Progress Bar 
const TierBar = ({ tier, color }) => {
  const sold = tier.sold ?? 0;
  const capacity = tier.capacity ?? 1;
  const pct = Math.min(100, Math.round((sold / capacity) * 100));
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: "#374151", fontSize: 13, fontWeight: 600 }}>{tier.name}</span>
        <span style={{ color: "#9ca3af", fontSize: 12 }}>{sold} / {capacity} · {fmtCur(tier.price)}</span>
      </div>
      <div style={{ height: 8, borderRadius: 100, background: "#f3f0ff", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 100,
          width: `${pct}%`,
          background: color,
          transition: "width 0.7s ease",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ color: "#9ca3af", fontSize: 11 }}>{pct}% sold</span>
        <span style={{ color: "#9ca3af", fontSize: 11 }}>{capacity - sold} remaining</span>
      </div>
    </div>
  );
};

// Event Row 
const EventRow = ({ event }) => {
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const ticketTiers = event.ticketTiers ?? [];
  const totalCapacity = ticketTiers.reduce((s, t) => s + (t.capacity ?? 0), 0);
  const totalSold = ticketTiers.reduce((s, t) => s + (t.sold ?? 0), 0);
  const totalRevenue = ticketTiers.reduce((s, t) => s + (t.sold ?? 0) * (t.price ?? 0), 0);
  const pct = totalCapacity ? Math.round((totalSold / totalCapacity) * 100) : 0;
  const pieData = ticketTiers.map((t) => ({ name: t.name, value: t.sold ?? 0 }));

  const loadBookings = async () => {
    if (bookings.length || loadingBookings) return;
    setLoadingBookings(true);
    try {
      const { data } = await API.get(`/events/${event._id}/analytics`);
      setBookings(data.bookings ?? []);
    } catch {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const toggle = () => {
    setOpen((v) => !v);
    if (!open) loadBookings();
  };

  const date = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  const fillColor = pct >= 80 ? "#059669" : pct >= 40 ? "#d97706" : "#7c3aed";

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e9e3ff",
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 12,
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}>
      <button
        onClick={toggle}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
          padding: "20px 24px", textAlign: "left",
          background: "none", border: "none", cursor: "pointer",
          transition: "background 0.15s",
          fontFamily: "inherit",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#faf8ff"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div style={{
            width: 4, height: 44, borderRadius: 4, flexShrink: 0,
            background: fillColor,
          }} />
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: 16,
              color: "#111827", margin: "0 0 4px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{event.title}</p>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Calendar size={12} />{date}
              </span>
              {event.location?.city && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={12} />{event.location.city}
                </span>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 2px" }}>Revenue</p>
            <p style={{ color: "#059669", fontWeight: 700, fontSize: 14, margin: 0 }}>{fmtCur(totalRevenue)}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 2px" }}>Tickets</p>
            <p style={{ color: "#374151", fontWeight: 700, fontSize: 14, margin: 0 }}>{totalSold}/{totalCapacity}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 2px" }}>Fill</p>
            <p style={{ color: fillColor, fontWeight: 700, fontSize: 14, margin: 0 }}>{pct}%</p>
          </div>
          <div style={{ color: "#9ca3af" }}>
            {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </div>
        </div>
      </button>

      {open && (
        <div style={{
          padding: "24px",
          borderTop: "1.5px solid #f3f0ff",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 32,
        }}>
          {/* Tier breakdown */}
          <div>
            <h4 style={{
              color: "#9ca3af", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 16,
            }}>Tier Breakdown</h4>
            {ticketTiers.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>No tier data available.</p>
            ) : (
              <>
                {ticketTiers.map((t, i) => (
                  <TierBar key={t._id ?? i} tier={t} color={TIER_COLORS[i % TIER_COLORS.length]} />
                ))}
                {ticketTiers.some((t) => (t.sold ?? 0) > 0) && (
                  <div style={{ height: 160, marginTop: 8 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                          style={{ fontSize: 11 }}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={TIER_COLORS[i % TIER_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: "#fff", border: "1.5px solid #e9e3ff", borderRadius: 10, fontSize: 12 }}
                          formatter={(v) => [`${v} tickets`]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bookings */}
          <div>
            <h4 style={{
              color: "#9ca3af", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 16,
            }}>Recent Bookings</h4>
            {loadingBookings ? (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading…</p>
            ) : bookings.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: 13 }}>No bookings recorded yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 260, overflowY: "auto" }}>
                {bookings.slice(0, 10).map((b, i) => (
                  <div key={b._id ?? i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px",
                    background: "#faf8ff",
                    border: "1px solid #f3f0ff",
                    borderRadius: 10,
                  }}>
                    <div>
                      <p style={{ color: "#374151", fontWeight: 600, fontSize: 13, margin: 0 }}>
                        {b.user?.name ?? "Anonymous"}
                      </p>
                      <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>
                        {b.tier?.name} · {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <span style={{
                      background: "#ede9fe", color: "#7c3aed",
                      fontSize: 12, fontWeight: 600,
                      padding: "3px 10px", borderRadius: 100,
                    }}>
                      {fmtCur(b.amountPaid ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Analytics ────────────────────────────────────────────────────────────
const Analytics = () => {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchMyEvents()
      .then(({ data }) => { if (data.success) setEvents(data.events); })
      .catch(console.error)
      .finally(() => setFetching(false));
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, [user]);

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#f9f7ff",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "3px solid #e9e3ff", borderTopColor: "#7c3aed",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!user || (user.role !== "organizer" && user.role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  const allTiers = events.flatMap((e) => e.ticketTiers ?? []);
  const totalRevenue = allTiers.reduce((s, t) => s + (t.sold ?? 0) * (t.price ?? 0), 0);
  const totalSold = allTiers.reduce((s, t) => s + (t.sold ?? 0), 0);
  const totalCapacity = allTiers.reduce((s, t) => s + (t.capacity ?? 0), 0);
  const totalRemaining = totalCapacity - totalSold;

  const revenueChart = events
    .map((e) => ({
      name: e.title.length > 16 ? e.title.slice(0, 16) + "…" : e.title,
      revenue: (e.ticketTiers ?? []).reduce((s, t) => s + (t.sold ?? 0) * (t.price ?? 0), 0),
      sold: (e.ticketTiers ?? []).reduce((s, t) => s + (t.sold ?? 0), 0),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const now = new Date();
  const filtered = events.filter((e) => {
    if (filter === "upcoming") return new Date(e.date) >= now;
    if (filter === "past") return new Date(e.date) < now;
    return true;
  });

  const statCards = [
    { icon: IndianRupee, label: "Total Revenue", value: fmtCur(totalRevenue), sub: `across ${events.length} events`, color: "#059669" },
    { icon: Ticket, label: "Tickets Sold", value: fmt(totalSold), sub: `of ${fmt(totalCapacity)} total`, color: "#7c3aed" },
    { icon: Users, label: "Remaining", value: fmt(totalRemaining), sub: "available seats", color: "#d97706" },
    { icon: TrendingUp, label: "Fill Rate", value: totalCapacity ? `${Math.round((totalSold / totalCapacity) * 100)}%` : "—", sub: "overall occupancy", color: "#db2777" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9f7ff",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 32px 80px" }}>

        {/* Header */}
        <div style={{
          marginBottom: 36,
          opacity: mounted ? 1 : 0,
          animation: mounted ? "fadeUp 0.6s ease forwards" : "none",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#ede9fe", borderRadius: 100,
            padding: "5px 14px", marginBottom: 16,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />
            <span style={{ color: "#7c3aed", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
              Organizer Studio
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                <Link
                  to="/organizer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "#fff", border: "1.5px solid #e9e3ff",
                    color: "#6b7280", borderRadius: 10,
                    padding: "6px 14px", fontSize: 13, fontWeight: 500,
                    textDecoration: "none", transition: "border-color 0.2s",
                  }}
                >
                  <ArrowLeft size={14} /> Dashboard
                </Link>
                <h1 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}>Analytics</h1>
              </div>
              <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Overview of all your events and revenue</p>
            </div>

            {/* Filter pills */}
            <div style={{
              display: "flex", gap: 4, padding: 4,
              background: "#fff", border: "1.5px solid #e9e3ff", borderRadius: 12,
              alignSelf: "flex-start",
            }}>
              {["all", "upcoming", "past"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 16px", borderRadius: 8, border: "none",
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer",
                    background: filter === f ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                    color: filter === f ? "#fff" : "#9ca3af",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                    fontFamily: "inherit",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e9e3ff", marginBottom: 28 }} />

        {/* Stat Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14, marginBottom: 28,
          opacity: mounted ? 1 : 0,
          animation: mounted ? "fadeUp 0.6s ease 0.1s both" : "none",
        }}>
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Bar Chart */}
        {revenueChart.length > 0 && (
          <div style={{
            background: "#fff", border: "1.5px solid #e9e3ff",
            borderRadius: 16, padding: "24px",
            marginBottom: 28,
            opacity: mounted ? 1 : 0,
            animation: mounted ? "fadeUp 0.6s ease 0.2s both" : "none",
          }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 16, fontWeight: 700, color: "#111827",
              marginBottom: 20,
            }}>Revenue by Event</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueChart} barSize={24}>
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`} />
                <Tooltip
                  cursor={{ fill: "#f3f0ff" }}
                  contentStyle={{ background: "#fff", border: "1.5px solid #e9e3ff", borderRadius: 10, fontSize: 12 }}
                  formatter={(v, name) => [name === "revenue" ? fmtCur(v) : v, name === "revenue" ? "Revenue" : "Tickets Sold"]}
                />
                <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                <Bar dataKey="sold" fill="#c4b5fd" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#9ca3af", fontSize: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: "#7c3aed", display: "inline-block" }} /> Revenue
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#9ca3af", fontSize: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: "#c4b5fd", display: "inline-block" }} /> Tickets Sold
              </span>
            </div>
          </div>
        )}

        {/* Event Breakdown */}
        <div style={{
          opacity: mounted ? 1 : 0,
          animation: mounted ? "fadeUp 0.6s ease 0.3s both" : "none",
        }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 18, fontWeight: 700, color: "#111827",
            marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
          }}>
            Event Breakdown
            <span style={{ color: "#9ca3af", fontSize: 13, fontWeight: 400 }}>
              ({filtered.length} {filter !== "all" ? filter : "total"})
            </span>
          </h2>

          {fetching ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                border: "3px solid #e9e3ff", borderTopColor: "#7c3aed",
                animation: "spin 0.7s linear infinite",
              }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              background: "#fff", border: "1.5px dashed #c4b5fd",
              borderRadius: 16, padding: "48px 32px", textAlign: "center",
            }}>
              <p style={{ color: "#6b7280", fontSize: 14 }}>
                No events found.{" "}
                <Link to="/create-event" style={{ color: "#7c3aed", fontWeight: 600 }}>
                  Create your first event →
                </Link>
              </p>
            </div>
          ) : (
            filtered.map((event) => <EventRow key={event._id} event={event} />)
          )}
        </div>

      </div>
    </div>
  );
};

export default Analytics;