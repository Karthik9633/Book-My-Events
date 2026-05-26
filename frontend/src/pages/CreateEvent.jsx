import { useState, useRef } from "react";
import API from "../api/axios";
import { useToast } from "../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b border-gray-200">
            {title}
        </h2>
        {children}
    </div>
);

const Field = ({ label, required, children, hint }) => (
    <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
);

const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white";

// ─── default tier template ────────────────────────────────────────────────────
const blankTier = () => ({ name: "", price: 0, capacity: "", description: "" });

// ─── CATEGORY OPTIONS (replace IDs with real ones from your DB) ───────────────
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

// COMPONENT
const CreateEvent = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);


    const isSubmitting = useRef(false);

    // form state
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        startTime: "",
        endTime: "",
        priceType: "free",
        tags: "",
        location: {
            address: "",
            city: "",
            state: "",
            geo: { lat: "", lng: "" },
        },
    });

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
                    startTime:
                        event.startTime || "",
                    endTime:
                        event.endTime || "",
                    priceType:
                        event.priceType
                        ||
                        "free",
                    tags:
                        event.tags
                            ?
                            event.tags.join(", ")
                            :
                            "",
                    location: {
                        address:
                            event.location
                                ?.address
                            ||
                            "",

                        city:
                            event.location
                                ?.city
                            ||
                            "",

                        state:
                            event.location
                                ?.state
                            ||
                            "",

                        geo: {

                            lat:
                                event.location
                                    ?.geo?.lat
                                ||
                                "",

                            lng:
                                event.location
                                    ?.geo?.lng
                                ||
                                ""

                        }

                    }

                });

                setTiers(

                    event.ticketTiers
                        ?.length

                        ?

                        event.ticketTiers

                        :

                        [blankTier()]

                );

                setImageUrls(

                    event.images
                        ?.length

                        ?

                        event.images

                        :

                        [""]

                );

            }
            catch (error) {

                showToast(

                    "Failed loading event",

                    "error"

                );

            }
            finally {

                setLoading(false);

            }

        };

        loadEvent();

    }, [id]);

    // ── ticket tiers ────────────────────────────────────────────────────────
    const [tiers, setTiers] = useState([blankTier()]);

    // ── image URLs ───────────────────────────────────────────────────────────
    const [imageUrls, setImageUrls] = useState([""]);

    // ── field change helpers ─────────────────────────────────────────────────
    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const changeLocation = (e) =>
        setForm({
            ...form,
            location: { ...form.location, [e.target.name]: e.target.value },
        });

    const changeGeo = (e) =>
        setForm({
            ...form,
            location: {
                ...form.location,
                geo: { ...form.location.geo, [e.target.name]: e.target.value },
            },
        });

    // ── tier helpers ─────────────────────────────────────────────────────────
    const changeTier = (index, field, value) => {
        const updated = tiers.map((t, i) =>
            i === index ? { ...t, [field]: value } : t
        );
        setTiers(updated);
    };

    const addTier = () => setTiers([...tiers, blankTier()]);
    const removeTier = (index) =>
        setTiers(tiers.filter((_, i) => i !== index));

    // ── image URL helpers ────────────────────────────────────────────────────
    const changeImageUrl = (index, value) => {
        const updated = imageUrls.map((u, i) => (i === index ? value : u));
        setImageUrls(updated);
    };
    const addImageUrl = () => setImageUrls([...imageUrls, ""]);
    const removeImageUrl = (index) =>
        setImageUrls(imageUrls.filter((_, i) => i !== index));

    // ── submit ───────────────────────────────────────────────────────────────
    const submit = async () => {
        // ── DUPLICATE GUARD ── blocks double-clicks and double buttons
        if (isSubmitting.current) return;

        // basic client-side guards
        if (!isEditMode && !form.title.trim()
        ) return showToast("Title is required", "error");
        if (!isEditMode && !form.description.trim())
            return showToast("Description is required", "error");
        if (!isEditMode && !form.category) return showToast("Category is required", "error");
        if (!isEditMode && !form.date) return showToast("Date is required", "error");
        if (!isEditMode && !form.startTime || !form.endTime)
            return showToast("Start & end time are required", "error");
        if (!isEditMode && !form.location.address.trim())
            return showToast("Address is required", "error");
        if (!isEditMode && !form.location.city.trim())
            return showToast("City is required", "error");
        if (!isEditMode && !form.location.state.trim())
            return showToast("State is required", "error");
        if (!isEditMode && !form.location.geo.lat || !form.location.geo.lng)
            return showToast("Geo coordinates are required", "error");

        for (let i = 0; i < tiers.length; i++) {
            if (!tiers[i].name.trim())
                return showToast(`Tier ${i + 1} needs a name`, "error");
        }

        const payload = {
            ...form,
            location: {
                ...form.location,
                geo: {
                    lat: parseFloat(form.location.geo.lat),
                    lng: parseFloat(form.location.geo.lng),
                },
            },
            tags: form.tags
                ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [],
            ticketTiers: tiers.map((t) => ({
                ...t,
                price: Number(t.price),
                capacity: t.capacity ? Number(t.capacity) : undefined,
            })),
            images: imageUrls.filter((u) => u.trim()),
        };

        try {
            isSubmitting.current = true;  // lock
            setLoading(true);
            const token = JSON.parse(localStorage.getItem("user"))?.token;
            if (isEditMode) {
                await API.put(
                    `/events/${id}`,
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );

                showToast(
                    "Event updated successfully!",
                    "success"
                );

            }
            else {
                await API.post(
                    "/events",
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }

                    }

                );

                showToast(
                    "Event created successfully!",
                    "success"
                );

            }
            showToast("Event created successfully!", "success");
            navigate("/");
        } catch (error) {
            showToast(
                error.response?.data?.message || "Something went wrong",
                "error"
            );
        } finally {
            isSubmitting.current = false; // unlock so user can retry on error
            setLoading(false);
        }
    };

    // ── render (100% your original UI) ──────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* ── Header ── */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">
                            {
                                isEditMode
                                    ?
                                    "Edit Event"
                                    :
                                    "Create Event"
                            }
                        </h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Fill in all details to publish your event
                        </p>
                    </div>
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="bg-purple-600 text-white px-7 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
                    >
                        {loading ? "Publishing…" : isEditMode ? "Update Event" : "Publish Event"}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-10">

                {/* ── 1. Basic Info ── */}
                <Section title="Basic Information">
                    <Field label="Event Title" required>
                        <input
                            name="title"
                            placeholder="e.g. Sunburn Music Festival 2025"
                            onChange={change}
                            value={form.title}
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Description" required>
                        <textarea
                            name="description"
                            placeholder="Tell attendees what makes this event special…"
                            onChange={change}
                            value={form.description}
                            rows={5}
                            className={inputCls + " resize-none"}
                        />
                    </Field>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Category" required>
                            <select
                                name="category"
                                value={form.category}
                                onChange={change}
                                className={inputCls}
                            >
                                <option value="">Select category</option>
                                {CATEGORY_OPTIONS.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Price Type" required>
                            <select
                                name="priceType"
                                value={form.priceType}
                                onChange={change}
                                className={inputCls}
                            >
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                            </select>
                        </Field>
                    </div>

                    <Field
                        label="Tags"
                        hint="Comma-separated, e.g. music, outdoor, festival"
                    >
                        <input
                            name="tags"
                            placeholder="music, outdoor, festival"
                            onChange={change}
                            value={form.tags}
                            className={inputCls}
                        />
                    </Field>
                </Section>

                {/* ── 2. Date & Time ── */}
                <Section title="Date & Time">
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Field label="Date" required>
                            <input
                                type="date"
                                name="date"
                                onChange={change}
                                value={form.date}
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Start Time" required>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    name="startTime"
                                    onChange={change}
                                    value={form.startTime}
                                    className={inputCls}
                                />
                                <select
                                    name="startAmPm"
                                    onChange={change}
                                    value={form.startAmPm}
                                    className={inputCls}
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </Field>

                        <Field label="End Time" required>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    name="endTime"
                                    onChange={change}
                                    value={form.endTime}
                                    className={inputCls}
                                />
                                <select
                                    name="endAmPm"
                                    onChange={change}
                                    value={form.endAmPm}
                                    className={inputCls}
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </Field>
                    </div>
                </Section>

                {/* ── 3. Location ── */}
                <Section title="Location">
                    <Field label="Address" required>
                        <input
                            name="address"
                            placeholder="123 Main Street"
                            onChange={changeLocation}
                            value={form.location.address}
                            className={inputCls}
                        />
                    </Field>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="City" required>
                            <input
                                name="city"
                                placeholder="Mumbai"
                                onChange={changeLocation}
                                value={form.location.city}
                                className={inputCls}
                            />
                        </Field>
                        <Field label="State" required>
                            <input
                                name="state"
                                placeholder="Maharashtra"
                                onChange={changeLocation}
                                value={form.location.state}
                                className={inputCls}
                            />
                        </Field>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field
                            label="Latitude"
                            required
                            hint="e.g. 19.0760"
                        >
                            <input
                                name="lat"
                                type="number"
                                step="any"
                                placeholder="19.0760"
                                onChange={changeGeo}
                                value={form.location.geo.lat}
                                className={inputCls}
                            />
                        </Field>
                        <Field
                            label="Longitude"
                            required
                            hint="e.g. 72.8777"
                        >
                            <input
                                name="lng"
                                type="number"
                                step="any"
                                placeholder="72.8777"
                                onChange={changeGeo}
                                value={form.location.geo.lng}
                                className={inputCls}
                            />
                        </Field>
                    </div>

                    <p className="text-xs text-gray-400 -mt-2">
                        💡 Find coordinates at{" "}
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-purple-500 underline"
                        >
                            Google Maps
                        </a>{" "}
                        → right-click any location → copy lat/lng.
                    </p>
                </Section>

                {/* ── 4. Ticket Tiers ── */}
                <Section title="Ticket Tiers">
                    <div className="space-y-5">
                        {tiers.map((tier, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-2xl p-6 relative"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                        Tier {index + 1}
                                    </span>
                                    {tiers.length > 1 && (
                                        <button
                                            onClick={() => removeTier(index)}
                                            className="text-red-400 hover:text-red-600 text-sm font-medium transition"
                                        >
                                            ✕ Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                    <Field label="Tier Name" required>
                                        <input
                                            placeholder="e.g. General, VIP, Premium"
                                            value={tier.name}
                                            onChange={(e) =>
                                                changeTier(index, "name", e.target.value)
                                            }
                                            className={inputCls}
                                        />
                                    </Field>
                                    <Field label="Price (₹)">
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={tier.price}
                                            onChange={(e) =>
                                                changeTier(index, "price", e.target.value)
                                            }
                                            className={inputCls}
                                        />
                                    </Field>
                                    <Field label="Capacity" hint="Leave blank for unlimited">
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 500"
                                            value={tier.capacity}
                                            onChange={(e) =>
                                                changeTier(index, "capacity", e.target.value)
                                            }
                                            className={inputCls}
                                        />
                                    </Field>
                                </div>

                                <Field label="Tier Description">
                                    <input
                                        placeholder="What's included? e.g. Front row access, backstage pass"
                                        value={tier.description}
                                        onChange={(e) =>
                                            changeTier(index, "description", e.target.value)
                                        }
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addTier}
                        className="mt-4 flex items-center gap-2 text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100 px-5 py-3 rounded-xl text-sm font-semibold transition"
                    >
                        + Add Ticket Tier
                    </button>
                </Section>

                {/* ── 5. Event Images ── */}
                <Section title="Event Images">
                    <p className="text-sm text-gray-500 mb-4">
                        Add image URLs for your event (banner, gallery shots, etc.)
                    </p>
                    <div className="space-y-3">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="flex gap-3 items-start">
                                <input
                                    placeholder={`Image URL ${index + 1}`}
                                    value={url}
                                    onChange={(e) =>
                                        changeImageUrl(index, e.target.value)
                                    }
                                    className={inputCls + " flex-1"}
                                />
                                {url && (
                                    <img
                                        src={url}
                                        alt="preview"
                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                )}
                                {imageUrls.length > 1 && (
                                    <button
                                        onClick={() => removeImageUrl(index)}
                                        className="text-red-400 hover:text-red-600 text-xl leading-none shrink-0 mt-2 transition"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addImageUrl}
                        className="mt-4 flex items-center gap-2 text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100 px-5 py-3 rounded-xl text-sm font-semibold transition"
                    >
                        + Add Image URL
                    </button>
                </Section>

                {/* ── Bottom CTA ── */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-7 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="bg-purple-600 text-white px-10 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
                    >
                        {loading ? "Publishing…" : isEditMode ? "Update Event" : "Publish Event"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;