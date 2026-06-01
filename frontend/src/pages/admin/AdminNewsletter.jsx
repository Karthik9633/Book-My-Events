import { useState } from "react";
import { sendNewsletter } from "../../api/adminApi";

const AdminNewsletter = () => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null); // "success" | "error"
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            setStatus({ type: "error", text: "Subject and message are required." });
            return;
        }
        setSending(true);
        setStatus(null);
        try {
            const { data } = await sendNewsletter({ subject, message });
            if (data.success) {
                setStatus({ type: "success", text: data.message });
                setSubject("");
                setMessage("");
            }
        } catch (error) {
            setStatus({ type: "error", text: error.response?.data?.message || "Failed to send newsletter." });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-2">Newsletter</h1>
            <p className="text-gray-500 mb-8">Send an email to all active users.</p>

            <div className="bg-white rounded-2xl shadow p-8 max-w-2xl">
                {status && (
                    <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${status.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {status.type === "success" ? "✅" : "❌"} {status.text}
                    </div>
                )}

                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Exciting new events this week!"
                        className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your newsletter message here..."
                        rows={8}
                        className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition"
                >
                    {sending ? "Sending..." : "📧 Send Newsletter"}
                </button>
            </div>
        </div>
    );
};

export default AdminNewsletter;