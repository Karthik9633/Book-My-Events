// OrganizerDashboard.jsx — restyled to match BookMyEvent brand
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const OrganizerDashboard = () => {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%", background: "#7c3aed",
              animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
          <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-12px)} }`}</style>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "organizer" && user.role !== "admin")) {
    return <Navigate to="/login" replace />;
  }

  const cards = [
    {
      to: "/create-event",
      label: "Create Event",
      number: "01",
      desc: "Launch your next experience",
      accent: "#7c3aed",
      lightAccent: "#ede9fe",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      to: "/my-events",
      label: "My Events",
      number: "02",
      desc: "Manage your portfolio",
      accent: "#7c3aed",
      lightAccent: "#ede9fe",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      to: "/analytics",
      label: "Analytics",
      number: "03",
      desc: "Insights & performance",
      accent: "#7c3aed",
      lightAccent: "#ede9fe",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9f7ff",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      position: "relative",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .org-card {
          display: block;
          text-decoration: none;
          background: #ffffff;
          border: 1.5px solid #e9e3ff;
          border-radius: 16px;
          padding: 32px 28px;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .org-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
          border-radius: 16px 16px 0 0;
        }
        .org-card:hover {
          border-color: #c4b5fd;
          box-shadow: 0 8px 32px rgba(124,58,237,0.12);
          transform: translateY(-3px);
        }
        .org-card:hover::before {
          transform: scaleX(1);
        }
        .org-card:hover .card-arrow {
          transform: translate(3px, -3px);
          opacity: 1;
          color: #7c3aed;
        }
        .card-arrow {
          opacity: 0.35;
          transition: transform 0.25s ease, opacity 0.25s ease, color 0.25s ease;
          color: #9ca3af;
        }
      `}</style>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "60px 32px 80px" }}>

        {/* Header */}
        <div style={{
          marginBottom: 48,
          opacity: mounted ? 1 : 0,
          animation: mounted ? "fadeUp 0.6s ease forwards" : "none",
        }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#ede9fe", borderRadius: 100,
            padding: "5px 14px", marginBottom: 20,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />
            <span style={{ color: "#7c3aed", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
              Organizer Studio
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}>
                Welcome back,{" "}
                <span style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {user?.name?.split(" ")[0] ?? "Creator"}.
                </span>
              </h1>
              <p style={{
                color: "#6b7280", fontSize: 15, margin: 0,
                maxWidth: 400, lineHeight: 1.6,
              }}>
                Your command center for building memorable experiences. What are we creating today?
              </p>
            </div>

            {/* Role badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: "1.5px solid #e9e3ff",
              background: "#fff",
              borderRadius: 10,
              padding: "8px 16px",
              alignSelf: "flex-start",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
              <span style={{ color: "#374151", fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>
                {user?.role ?? "Organizer"}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e9e3ff", marginBottom: 36 }} />

        {/* Section label */}
        <div style={{
          color: "#9ca3af", fontSize: 12, fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          marginBottom: 20,
          opacity: mounted ? 1 : 0,
          animation: mounted ? "fadeUp 0.6s ease 0.2s both" : "none",
        }}>
          Quick Actions
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}>
          {cards.map((card, i) => (
            <div
              key={card.to}
              style={{
                opacity: mounted ? 1 : 0,
                animation: mounted ? `fadeUp 0.55s ease ${0.3 + i * 0.1}s both` : "none",
              }}
            >
              <Link to={card.to} className="org-card">

                {/* Icon circle + arrow */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: card.lightAccent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: card.accent,
                  }}>
                    {card.icon}
                  </div>
                  <div className="card-arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>

                {/* Number watermark */}
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 11, fontWeight: 700,
                  color: "#d8b4fe", letterSpacing: "0.1em",
                  marginBottom: 8,
                }}>
                  {card.number}
                </div>

                {/* Label */}
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 20, fontWeight: 700,
                  color: "#111827", marginBottom: 6,
                }}>
                  {card.label}
                </div>

                {/* Desc */}
                <div style={{
                  fontSize: 13, color: "#9ca3af", lineHeight: 1.5,
                }}>
                  {card.desc}
                </div>

              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OrganizerDashboard;  