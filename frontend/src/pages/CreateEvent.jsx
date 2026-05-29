import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";

// ─── helpers ─────────────────────────────────────────────────────────────────
const Section = ({ title, icon, children }) => (
    <div style={{
        background: "#fff",
        border: "1.5px solid #ede8ff",
        borderRadius: 20,
        padding: "28px 32px",
        marginBottom: 20,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #f3f0ff" }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 16, fontWeight: 800,
                color: "#1e1033", margin: 0, letterSpacing: "-0.01em",
            }}>{title}</h2>
        </div>
        {children}
    </div>
);

const Field = ({ label, required, children, hint }) => (
    <div style={{ marginBottom: 18 }}>
        <label style={{
            display: "block", fontSize: 13, fontWeight: 600,
            color: "#374151", marginBottom: 6, letterSpacing: "0.01em",
        }}>
            {label} {required && <span style={{ color: "#e11d48" }}>*</span>}
        </label>
        {children}
        {hint && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{hint}</p>}
    </div>
);

const inputStyle = {
    width: "100%", border: "1.5px solid #e9e3ff", borderRadius: 12,
    padding: "10px 14px", fontSize: 14, outline: "none",
    background: "#faf8ff", color: "#1e1033",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'Outfit', sans-serif",
    boxSizing: "border-box",
};

const InputField = (props) => {
    const [focused, setFocused] = useState(false);
    return (
        <input
            {...props}
            style={{
                ...inputStyle,
                borderColor: focused ? "#7c3aed" : "#e9e3ff",
                boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                ...(props.style || {}),
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    );
};

const SelectField = (props) => {
    const [focused, setFocused] = useState(false);
    return (
        <select
            {...props}
            style={{
                ...inputStyle,
                borderColor: focused ? "#7c3aed" : "#e9e3ff",
                boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                cursor: "pointer",
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    );
};

const TextareaField = (props) => {
    const [focused, setFocused] = useState(false);
    return (
        <textarea
            {...props}
            style={{
                ...inputStyle,
                borderColor: focused ? "#7c3aed" : "#e9e3ff",
                boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                resize: "vertical", minHeight: 100,
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    );
};

const blankTier = () => ({ name: "", price: 0, capacity: "", description: "" });

const CATEGORY_OPTIONS = [
    { label: "Music", value: "664a1f2b3c4e5f6a7b8c9d0e" },
    { label: "Sports", value: "664a1f2b3c4e5f6a7b8c9d0f" },
    { label: "Arts & Culture", value: "664a1f2b3c4e5f6a7b8c9d10" },
    { label: "Technology", value: "664a1f2b3c4e5f6a7b8c9d11" },
    { label: "Food & Drink", value: "664a1f2b3c4e5f6a7b8c9d12" },
    { label: "Business", value: "664a1f2b3c4e5f6a7b8c9d13" },
    { label: "Health & Wellness", value: "664a1f2b3c4e5f6a7b8c9d14" },
    { label: "Education", value: "664a1f2b3c4e5f6a7b8c9d15" },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const CreateEvent = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const isSubmitting = useRef(false);

    const [form, setForm] = useState({
        title: "", description: "", category: "", date: "",
        startTime: "", endTime: "", priceType: "free", tags: "",
        location: { address: "", city: "", state: "", geo: { lat: "", lng: "" } },
    });

    const [tiers, setTiers] = useState([blankTier()]);
    const [imageUrls, setImageUrls] = useState([""]);
    // Track which image URLs are valid/loaded
    const [imgStatus, setImgStatus] = useState({});

    useEffect(() => {
        if (!id) return;
        const loadEvent = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/events/${id}`);
                const event = data.event;
                setForm({
                    title: event.title || "",
                    description: event.description || "",
                    category: event.category?._id || event.category || "",
                    date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
                    startTime: event.startTime || "",
                    endTime: event.endTime || "",
                    priceType: event.priceType || "free",
                    tags: event.tags ? event.tags.join(", ") : "",
                    location: {
                        address: event.location?.address || "",
                        city: event.location?.city || "",
                        state: event.location?.state || "",
                        geo: { lat: event.location?.geo?.lat || "", lng: event.location?.geo?.lng || "" },
                    },
                });
                setTiers(event.ticketTiers?.length ? event.ticketTiers : [blankTier()]);
                setImageUrls(event.images?.length ? event.images : [""]);
            } catch {
                showToast("Failed loading event", "error");
            } finally {
                setLoading(false);
            }
        };
        loadEvent();
    }, [id]);

    // helpers
    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const changeLocation = (e) => setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } });
    const changeGeo = (e) => setForm({ ...form, location: { ...form.location, geo: { ...form.location.geo, [e.target.name]: e.target.value } } });
    const changeTier = (i, field, val) => setTiers(tiers.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
    const addTier = () => setTiers([...tiers, blankTier()]);
    const removeTier = (i) => setTiers(tiers.filter((_, idx) => idx !== i));
    const changeImageUrl = (i, val) => {
        setImageUrls(imageUrls.map((u, idx) => idx === i ? val : u));
        setImgStatus(s => ({ ...s, [i]: "loading" }));
    };
    const addImageUrl = () => setImageUrls([...imageUrls, ""]);
    const removeImageUrl = (i) => {
        setImageUrls(imageUrls.filter((_, idx) => idx !== i));
        setImgStatus(s => { const n = { ...s }; delete n[i]; return n; });
    };

    const submit = async () => {
        if (isSubmitting.current) return;
        if (!form.title.trim()) return showToast("Title is required", "error");
        if (!form.description.trim()) return showToast("Description is required", "error");
        if (!form.category) return showToast("Category is required", "error");
        if (!form.date) return showToast("Date is required", "error");
        if (!form.startTime || !form.endTime) return showToast("Start & end time are required", "error");
        if (!form.location.address.trim()) return showToast("Address is required", "error");
        if (!form.location.city.trim()) return showToast("City is required", "error");
        if (!form.location.state.trim()) return showToast("State is required", "error");
        if (!form.location.geo.lat || !form.location.geo.lng) return showToast("Geo coordinates are required", "error");
        for (let i = 0; i < tiers.length; i++) {
            if (!tiers[i].name.trim()) return showToast(`Tier ${i + 1} needs a name`, "error");
        }

        const validImages = imageUrls.filter(u => u.trim());

        const payload = {
            ...form,
            location: { ...form.location, geo: { lat: parseFloat(form.location.geo.lat), lng: parseFloat(form.location.geo.lng) } },
            tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            ticketTiers: tiers.map(t => ({ ...t, price: Number(t.price), capacity: t.capacity ? Number(t.capacity) : undefined })),
            images: validImages,
            // Also set primary image field for cards
            image: validImages[0] || "",
        };

        try {
            isSubmitting.current = true;
            setLoading(true);
            const token = JSON.parse(localStorage.getItem("user"))?.token;
            if (isEditMode) {
                await API.put(`/events/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                showToast("Event updated successfully!", "success");
            } else {
                await API.post("/events", payload, { headers: { Authorization: `Bearer ${token}` } });
                showToast("Event created successfully!", "success");
            }
            navigate("/my-events");
        } catch (error) {
            showToast(error.response?.data?.message || "Something went wrong", "error");
        } finally {
            isSubmitting.current = false;
            setLoading(false);
        }
    };

    const primaryImage = imageUrls.find(u => u.trim()) || "";

    return (
        <div style={{ minHeight: "100vh", background: "#f9f7ff", fontFamily: "'Outfit', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
                @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin { to{transform:rotate(360deg)} }
                .img-url-row:hover .img-remove { opacity: 1 !important; }
            `}</style>

            {/* ── Sticky Header ── */}
            <div style={{
                position: "sticky", top: 0, zIndex: 40,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid #ede8ff",
            }}>
                <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} />
                            <span style={{ color: "#7c3aed", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Organizer Studio</span>
                        </div>
                        <h1 style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 22, fontWeight: 800, color: "#1e1033", margin: 0,
                        }}>
                            {isEditMode ? "Edit Event" : "Create New Event"}
                        </h1>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                padding: "10px 20px", borderRadius: 12,
                                border: "1.5px solid #e9e3ff", background: "#fff",
                                color: "#6b7280", fontWeight: 600, fontSize: 13,
                                cursor: "pointer", fontFamily: "inherit",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={submit}
                            disabled={loading}
                            style={{
                                padding: "10px 24px", borderRadius: 12,
                                background: loading ? "#c4b5fd" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                                color: "#fff", fontWeight: 700, fontSize: 13,
                                border: "none", cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                                display: "flex", alignItems: "center", gap: 8,
                                fontFamily: "inherit",
                            }}
                        >
                            {loading && <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />}
                            {loading ? "Publishing…" : isEditMode ? "Update Event" : "Publish Event"}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 28px 80px", animation: "fadeIn 0.5s ease" }}>

                {/* ── 1. Basic Info ── */}
                <Section title="Basic Information" icon="📋">
                    <Field label="Event Title" required>
                        <InputField name="title" placeholder="e.g. Sunburn Music Festival 2025" onChange={change} value={form.title} />
                    </Field>
                    <Field label="Description" required>
                        <TextareaField name="description" placeholder="Tell attendees what makes this event special…" onChange={change} value={form.description} rows={5} />
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Field label="Category" required>
                            <SelectField name="category" value={form.category} onChange={change}>
                                <option value="">Select category</option>
                                {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </SelectField>
                        </Field>
                        <Field label="Price Type" required>
                            <SelectField name="priceType" value={form.priceType} onChange={change}>
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                            </SelectField>
                        </Field>
                    </div>
                    <Field label="Tags" hint="Comma-separated, e.g. music, outdoor, festival">
                        <InputField name="tags" placeholder="music, outdoor, festival" onChange={change} value={form.tags} />
                    </Field>
                </Section>

                {/* ── 2. Date & Time ── */}
                <Section title="Date & Time" icon="📅">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        <Field label="Date" required>
                            <InputField type="date" name="date" onChange={change} value={form.date} />
                        </Field>
                        <Field label="Start Time" required>
                            <div style={{ display: "flex", gap: 8 }}>
                                <InputField type="time" name="startTime" onChange={change} value={form.startTime} style={{ flex: 1 }} />
                                <SelectField name="startAmPm" onChange={change} value={form.startAmPm} style={{ width: 70 }}>
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </SelectField>
                            </div>
                        </Field>
                        <Field label="End Time" required>
                            <div style={{ display: "flex", gap: 8 }}>
                                <InputField type="time" name="endTime" onChange={change} value={form.endTime} style={{ flex: 1 }} />
                                <SelectField name="endAmPm" onChange={change} value={form.endAmPm} style={{ width: 70 }}>
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </SelectField>
                            </div>
                        </Field>
                    </div>
                </Section>

                {/* ── 3. Images ── */}
                <Section title="Event Images" icon="🖼️">
                    {/* Live banner preview */}
                    <div style={{
                        width: "100%", height: 220, borderRadius: 16, overflow: "hidden",
                        background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                        marginBottom: 20, position: "relative",
                        border: "1.5px solid #e9e3ff",
                    }}>
                        {primaryImage ? (
                            <>
                                <img
                                    src={primaryImage}
                                    alt="Event banner preview"
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                                />
                                <div style={{
                                    display: "none", position: "absolute", inset: 0,
                                    alignItems: "center", justifyContent: "center",
                                    flexDirection: "column", gap: 8,
                                    background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                                }}>
                                    <span style={{ fontSize: 36 }}>🚫</span>
                                    <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>Image failed to load</span>
                                </div>
                            </>
                        ) : (
                            <div style={{
                                width: "100%", height: "100%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexDirection: "column", gap: 10,
                            }}>
                                <span style={{ fontSize: 44 }}>🎪</span>
                                <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>Banner preview will appear here</span>
                                <span style={{ color: "#c4b5fd", fontSize: 11 }}>Add an image URL below</span>
                            </div>
                        )}
                        {primaryImage && (
                            <div style={{
                                position: "absolute", bottom: 10, left: 10,
                                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
                                color: "#fff", fontSize: 11, fontWeight: 600,
                                padding: "4px 10px", borderRadius: 100,
                            }}>
                                Banner Preview
                            </div>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {imageUrls.filter(u => u.trim()).length > 1 && (
                        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                            {imageUrls.filter(u => u.trim()).map((url, i) => (
                                <div key={i} style={{
                                    width: 64, height: 64, borderRadius: 10, overflow: "hidden",
                                    border: i === 0 ? "2px solid #7c3aed" : "2px solid #e9e3ff",
                                    flexShrink: 0, position: "relative",
                                }}>
                                    <img
                                        src={url} alt={`img ${i + 1}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={e => e.target.style.opacity = "0.3"}
                                    />
                                    {i === 0 && (
                                        <div style={{
                                            position: "absolute", bottom: 2, left: 0, right: 0,
                                            textAlign: "center", fontSize: 8, fontWeight: 700,
                                            color: "#7c3aed", background: "rgba(255,255,255,0.9)",
                                            padding: "1px 0",
                                        }}>COVER</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* URL inputs */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {imageUrls.map((url, i) => (
                            <div key={i} className="img-url-row" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                                    background: i === 0 ? "#7c3aed" : "#e9e3ff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 10, fontWeight: 700,
                                    color: i === 0 ? "#fff" : "#9ca3af",
                                }}>
                                    {i + 1}
                                </div>
                                <InputField
                                    placeholder={i === 0 ? "Main banner image URL (shown on event card)" : `Additional image URL ${i + 1}`}
                                    value={url}
                                    onChange={e => changeImageUrl(i, e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                {/* Small live check */}
                                {url.trim() && (
                                    <img
                                        src={url}
                                        alt=""
                                        style={{
                                            width: 44, height: 44, borderRadius: 8,
                                            objectFit: "cover", flexShrink: 0,
                                            border: "1.5px solid #e9e3ff",
                                        }}
                                        onError={e => { e.target.style.opacity = "0.2"; e.target.title = "Image not found"; }}
                                        onLoad={e => { e.target.style.opacity = "1"; }}
                                    />
                                )}
                                {imageUrls.length > 1 && (
                                    <button
                                        className="img-remove"
                                        onClick={() => removeImageUrl(i)}
                                        style={{
                                            width: 30, height: 30, borderRadius: "50%",
                                            border: "none", background: "#fff1f2",
                                            color: "#be123c", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 16, flexShrink: 0,
                                            opacity: 0.6, transition: "opacity 0.2s",
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addImageUrl}
                        style={{
                            marginTop: 12,
                            display: "flex", alignItems: "center", gap: 8,
                            background: "#faf8ff", border: "1.5px dashed #c4b5fd",
                            color: "#7c3aed", borderRadius: 12,
                            padding: "10px 18px", fontSize: 13, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                            transition: "background 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
                        onMouseLeave={e => e.currentTarget.style.background = "#faf8ff"}
                    >
                        <span style={{ fontSize: 16 }}>+</span> Add Another Image
                    </button>

                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 10 }}>
                        💡 First image is used as the event card cover. Use direct image URLs (ending in .jpg, .png, .webp etc.)
                    </p>
                </Section>

                {/* ── 4. Location ── */}
                <Section title="Location" icon="📍">
                    <Field label="Address" required>
                        <InputField name="address" placeholder="123 Main Street" onChange={changeLocation} value={form.location.address} />
                    </Field>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Field label="City" required>
                            <InputField name="city" placeholder="Mumbai" onChange={changeLocation} value={form.location.city} />
                        </Field>
                        <Field label="State" required>
                            <InputField name="state" placeholder="Maharashtra" onChange={changeLocation} value={form.location.state} />
                        </Field>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <Field label="Latitude" required hint="e.g. 19.0760">
                            <InputField name="lat" type="number" step="any" placeholder="19.0760" onChange={changeGeo} value={form.location.geo.lat} />
                        </Field>
                        <Field label="Longitude" required hint="e.g. 72.8777">
                            <InputField name="lng" type="number" step="any" placeholder="72.8777" onChange={changeGeo} value={form.location.geo.lng} />
                        </Field>
                    </div>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: -8 }}>
                        💡 Find coordinates at{" "}
                        <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ color: "#7c3aed" }}>
                            Google Maps
                        </a>{" "}
                        → right-click any location → copy lat/lng.
                    </p>
                </Section>

                {/* ── 5. Ticket Tiers ── */}
                <Section title="Ticket Tiers" icon="🎟️">
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {tiers.map((tier, i) => (
                            <div key={i} style={{
                                background: "#faf8ff", border: "1.5px solid #e9e3ff",
                                borderRadius: 16, padding: "20px 22px",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                    <span style={{
                                        background: "#ede9fe", color: "#7c3aed",
                                        fontSize: 11, fontWeight: 700, padding: "4px 12px",
                                        borderRadius: 100, letterSpacing: "0.05em",
                                    }}>
                                        TIER {i + 1}
                                    </span>
                                    {tiers.length > 1 && (
                                        <button
                                            onClick={() => removeTier(i)}
                                            style={{
                                                background: "#fff1f2", border: "none",
                                                color: "#be123c", fontSize: 12, fontWeight: 600,
                                                padding: "4px 12px", borderRadius: 8,
                                                cursor: "pointer", fontFamily: "inherit",
                                            }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                                    <Field label="Tier Name" required>
                                        <InputField placeholder="e.g. General, VIP" value={tier.name} onChange={e => changeTier(i, "name", e.target.value)} />
                                    </Field>
                                    <Field label="Price (₹)">
                                        <InputField type="number" min="0" placeholder="0" value={tier.price} onChange={e => changeTier(i, "price", e.target.value)} />
                                    </Field>
                                    <Field label="Capacity" hint="Leave blank for unlimited">
                                        <InputField type="number" min="1" placeholder="e.g. 500" value={tier.capacity} onChange={e => changeTier(i, "capacity", e.target.value)} />
                                    </Field>
                                </div>
                                <Field label="Tier Description">
                                    <InputField placeholder="What's included? e.g. Front row access, backstage pass" value={tier.description} onChange={e => changeTier(i, "description", e.target.value)} />
                                </Field>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addTier}
                        style={{
                            marginTop: 12,
                            display: "flex", alignItems: "center", gap: 8,
                            background: "#faf8ff", border: "1.5px dashed #c4b5fd",
                            color: "#7c3aed", borderRadius: 12,
                            padding: "10px 18px", fontSize: 13, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                            transition: "background 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
                        onMouseLeave={e => e.currentTarget.style.background = "#faf8ff"}
                    >
                        <span style={{ fontSize: 16 }}>+</span> Add Ticket Tier
                    </button>
                </Section>

                {/* ── Bottom CTA ── */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 8 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: "12px 24px", borderRadius: 12,
                            border: "1.5px solid #e9e3ff", background: "#fff",
                            color: "#6b7280", fontWeight: 600, fontSize: 14,
                            cursor: "pointer", fontFamily: "inherit",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={loading}
                        style={{
                            padding: "12px 32px", borderRadius: 12,
                            background: loading ? "#c4b5fd" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                            color: "#fff", fontWeight: 700, fontSize: 14,
                            border: "none", cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                            display: "flex", alignItems: "center", gap: 8,
                            fontFamily: "inherit",
                        }}
                    >
                        {loading && <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />}
                        {loading ? "Publishing…" : isEditMode ? "Update Event" : "Publish Event"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreateEvent;