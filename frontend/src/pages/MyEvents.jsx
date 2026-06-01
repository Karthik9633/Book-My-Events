import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyEvents, deleteEvent } from "../api/eventApi";

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    const loadEvents = async () => {
        try {
            const { data } = await fetchMyEvents();
            if (data.success) setEvents(data.events);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    useEffect(() => {
        loadEvents();
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteEvent(id);
            setEvents(prev => prev.filter(e => e._id !== id));
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingId(null);
            setConfirmId(null);
        }
    };

    // Determine if event is upcoming or past
    const getStatus = (date) => {
        const now = new Date();
        const eventDate = new Date(date);
        const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return { label: "Past", color: "#6b7280", bg: "#f3f4f6" };
        if (diffDays === 0) return { label: "Today", color: "#dc2626", bg: "#fef2f2" };
        if (diffDays <= 7) return { label: `In ${diffDays}d`, color: "#d97706", bg: "#fffbeb" };
        return { label: "Upcoming", color: "#059669", bg: "#ecfdf5" };
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#faf9ff",
            fontFamily: "'Outfit', sans-serif",
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes popIn {
                    0% { opacity: 0; transform: scale(0.85); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .ev-card {
                    background: #fff;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid #ede8ff;
                    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
                    position: relative;
                }
                .ev-card:hover {
                    transform: translateY(-6px) scale(1.01);
                    box-shadow: 0 20px 48px rgba(109,40,217,0.13);
                    border-color: #c4b5fd;
                }
                .ev-card:hover .ev-img {
                    transform: scale(1.06);
                }
                .ev-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .img-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 10px;
                }
                .btn-edit {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #ede9fe;
                    color: #6d28d9;
                    border: none;
                    border-radius: 10px;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                    font-family: 'Outfit', sans-serif;
                    letter-spacing: 0.01em;
                }
                .btn-edit:hover {
                    background: #ddd6fe;
                    transform: translateY(-1px);
                }
                .btn-delete {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #fff1f2;
                    color: #be123c;
                    border: none;
                    border-radius: 10px;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: 'Outfit', sans-serif;
                    letter-spacing: 0.01em;
                }
                .btn-delete:hover {
                    background: #ffe4e6;
                    transform: translateY(-1px);
                }
                .btn-delete-confirm {
                    background: #be123c;
                    color: #fff;
                    animation: popIn 0.2s ease;
                }
                .btn-delete-confirm:hover {
                    background: #9f1239;
                }
                .grid-header-stat {
                    background: #fff;
                    border: 1px solid #ede8ff;
                    border-radius: 16px;
                    padding: 20px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .create-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #6d28d9 0%, #a855f7 100%);
                    color: #fff;
                    border-radius: 14px;
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: none;
                    box-shadow: 0 4px 20px rgba(109,40,217,0.35);
                    transition: all 0.25s;
                    letter-spacing: 0.02em;
                    font-family: 'Outfit', sans-serif;
                }
                .create-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 28px rgba(109,40,217,0.45);
                }
            `}</style>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 28px 80px" }}>

                {/* ── Header ── */}
                <div style={{
                    marginBottom: 40,
                    opacity: mounted ? 1 : 0,
                    animation: mounted ? "fadeUp 0.6s ease forwards" : "none",
                }}>
                    {/* Eyebrow */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "#ede9fe", borderRadius: 100,
                        padding: "5px 14px", marginBottom: 18,
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />
                        <span style={{ color: "#7c3aed", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            Organizer Studio
                        </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                        <div>
                            <h1 style={{
                                fontFamily: "'Fraunces', serif",
                                fontSize: "clamp(32px, 5vw, 52px)",
                                fontWeight: 900,
                                color: "#1e1033",
                                letterSpacing: "-0.03em",
                                lineHeight: 1.05,
                                margin: "0 0 10px",
                            }}>
                                My Events
                            </h1>
                            <p style={{ color: "#9ca3af", fontSize: 15, margin: 0, fontWeight: 400 }}>
                                {loading ? "Loading your portfolio…" : `${events.length} event${events.length !== 1 ? "s" : ""} in your portfolio`}
                            </p>
                        </div>
                        <Link to="/create-event" className="create-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Event
                        </Link>
                    </div>
                </div>

                {/* ── Stats row ── */}
                {!loading && events.length > 0 && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 12, marginBottom: 36,
                        opacity: mounted ? 1 : 0,
                        animation: mounted ? "fadeUp 0.6s ease 0.1s both" : "none",
                    }}>
                        {[
                            {
                                label: "Total Events",
                                value: events.length,
                                icon: "📅",
                            },
                            {
                                label: "Upcoming",
                                value: events.filter(e => new Date(e.date) >= new Date()).length,
                                icon: "🚀",
                            },
                            {
                                label: "Past",
                                value: events.filter(e => new Date(e.date) < new Date()).length,
                                icon: "✅",
                            },
                            {
                                label: "Total Capacity",
                                value: events.reduce((s, e) => s + (e.ticketTiers ?? []).reduce((a, t) => a + (t.capacity ?? 0), 0), 0),
                                icon: "🎟️",
                            },
                        ].map((stat, i) => (
                            <div key={i} className="grid-header-stat">
                                <span style={{ fontSize: 22 }}>{stat.icon}</span>
                                <span style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontSize: 28, fontWeight: 900,
                                    color: "#1e1033", lineHeight: 1,
                                }}>{stat.value}</span>
                                <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Divider ── */}
                <div style={{ height: 1, background: "linear-gradient(90deg, #ede8ff, transparent)", marginBottom: 32 }} />

                {/* ── Loading ── */}
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0", gap: 16 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: "50%",
                            border: "3px solid #ede9fe",
                            borderTopColor: "#7c3aed",
                            animation: "spin 0.75s linear infinite",
                        }} />
                        <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading your events…</p>
                    </div>

                ) : events.length === 0 ? (
                    /* ── Empty state ── */
                    <div style={{
                        background: "#fff",
                        border: "2px dashed #ddd6fe",
                        borderRadius: 24,
                        padding: "72px 32px",
                        textAlign: "center",
                        opacity: mounted ? 1 : 0,
                        animation: mounted ? "fadeUp 0.6s ease 0.2s both" : "none",
                    }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: 20,
                            background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 20px",
                            fontSize: 32,
                        }}>🎪</div>
                        <h3 style={{
                            fontFamily: "'Fraunces', serif",
                            fontSize: 24, fontWeight: 900, color: "#1e1033",
                            margin: "0 0 8px",
                        }}>No events yet</h3>
                        <p style={{ color: "#9ca3af", fontSize: 15, marginBottom: 28 }}>
                            Your stage is empty. Create your first event and start selling tickets.
                        </p>
                        <Link to="/create-event" className="create-btn">
                            Create Your First Event →
                        </Link>
                    </div>

                ) : (
                    /* ── Event Cards Grid ── */
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: 24,
                    }}>
                        {events.map((event, i) => {
                            const status = getStatus(event.date);
                            const totalCapacity = (event.ticketTiers ?? []).reduce((s, t) => s + (t.capacity ?? 0), 0);
                            const totalSold = (event.ticketTiers ?? []).reduce((s, t) => s + (t.sold ?? 0), 0);
                            const fillPct = totalCapacity ? Math.round((totalSold / totalCapacity) * 100) : 0;

                            return (
                                <div
                                    key={event._id}
                                    className="ev-card"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        animation: mounted ? `fadeUp 0.55s ease ${0.15 + i * 0.08}s both` : "none",
                                    }}
                                >
                                    {/* ── Image area ── */}
                                    <div style={{ height: 200, overflow: "hidden", position: "relative", background: "#f3f0ff" }}>
                                        {event.image ? (
                                            <img
                                                src={event?.images?.[0] || event?.image}
                                                alt={event.title}
                                                className="ev-img"
                                            />
                                        ) : (
                                            <div className="img-placeholder" style={{
                                                background: `linear-gradient(135deg, 
                                                    hsl(${(i * 67) % 360}, 60%, 92%) 0%, 
                                                    hsl(${(i * 67 + 40) % 360}, 55%, 86%) 100%)`,
                                            }}>
                                                <span style={{ fontSize: 48 }}>
                                                    {["🎵", "🎭", "🏃", "🎨", "💻", "🌿", "🎪", "📸"][i % 8]}
                                                </span>
                                                <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600, letterSpacing: "0.05em" }}>
                                                    No image
                                                </span>
                                            </div>
                                        )}

                                        {/* Status badge */}
                                        <div style={{
                                            position: "absolute", top: 12, left: 12,
                                            background: status.bg,
                                            color: status.color,
                                            fontSize: 11, fontWeight: 700,
                                            padding: "4px 10px", borderRadius: 100,
                                            letterSpacing: "0.05em",
                                            backdropFilter: "blur(8px)",
                                        }}>
                                            {status.label}
                                        </div>

                                        {/* Category badge */}
                                        {event.category?.name && (
                                            <div style={{
                                                position: "absolute", top: 12, right: 12,
                                                background: "rgba(255,255,255,0.92)",
                                                color: "#6d28d9",
                                                fontSize: 11, fontWeight: 700,
                                                padding: "4px 10px", borderRadius: 100,
                                                backdropFilter: "blur(8px)",
                                            }}>
                                                {event.category.name}
                                            </div>

                                            
                                        )}
                                    </div>

                                    {/* ── Card body ── */}
                                    <div style={{ padding: "20px 22px 22px" }}>

                                        {/* Title */}
                                        <h2 style={{
                                            fontFamily: "'Fraunces', serif",
                                            fontSize: 20, fontWeight: 900,
                                            color: "#1e1033",
                                            margin: "0 0 10px",
                                            lineHeight: 1.25,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}>
                                            {event.title}
                                        </h2>

                                        {/* Meta row */}
                                        <div style={{ display: "flex", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
                                            <span style={{ color: "#9ca3af", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                                {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </span>
                                            {event.location?.city && (
                                                <span style={{ color: "#9ca3af", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                                    </svg>
                                                    {event.location.city}
                                                </span>
                                            )}
                                        </div>

                                        {/* Ticket fill bar */}
                                        {totalCapacity > 0 && (
                                            <div style={{ marginBottom: 18 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                                    <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>Tickets sold</span>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: fillPct >= 80 ? "#059669" : "#7c3aed" }}>
                                                        {totalSold}/{totalCapacity} · {fillPct}%
                                                    </span>
                                                </div>
                                                <div style={{ height: 6, background: "#f3f0ff", borderRadius: 100, overflow: "hidden" }}>
                                                    <div style={{
                                                        height: "100%",
                                                        borderRadius: 100,
                                                        width: `${fillPct}%`,
                                                        background: fillPct >= 80
                                                            ? "linear-gradient(90deg, #059669, #34d399)"
                                                            : "linear-gradient(90deg, #7c3aed, #a855f7)",
                                                        transition: "width 1s ease",
                                                    }} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <Link
                                                to={`/edit-event/${String(event._id).trim()}`}
                                                className="btn-edit"
                                                style={{ flex: 1, justifyContent: "center" }}
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                                Edit
                                            </Link>

                                            {confirmId === event._id ? (
                                                <div style={{ display: "flex", gap: 6, animation: "slideDown 0.2s ease" }}>
                                                    <button
                                                        onClick={() => handleDelete(event._id)}
                                                        disabled={deletingId === event._id}
                                                        className="btn-delete btn-delete-confirm"
                                                        style={{ flex: 1 }}
                                                    >
                                                        {deletingId === event._id ? "…" : "Confirm"}
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmId(null)}
                                                        className="btn-edit"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmId(event._id)}
                                                    className="btn-delete"
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;