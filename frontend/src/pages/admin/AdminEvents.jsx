import {
    useEffect,
    useState
}
    from "react";

import {

    getAllEvents,

    approveEvent,

    rejectEvent,

    deleteEventAdmin

}

    from "../../api/adminApi";

const AdminEvents = () => {

    const [
        events,
        setEvents
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        search,
        setSearch
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter
    ] = useState("all");

    const loadEvents =
        async () => {

            try {

                const { data } =
                    await getAllEvents();

                setEvents(
                    data.events
                );

            }

            catch (error) {

                console.log(error);

            }

            finally {

                setLoading(false);

            }

        };

    useEffect(() => {

        loadEvents();

    }, []);

    const handleApprove =
        async (id) => {

            await approveEvent(id);

            loadEvents();

        };

    const handleReject =
        async (id) => {

            const reason =
                prompt(
                    "Rejection reason"
                );

            if (!reason) return;

            await rejectEvent(
                id,
                reason
            );

            loadEvents();

        };

    const handleDelete =
        async (id) => {

            const confirmDelete =
                window.confirm(
                    "Delete this event?"
                );

            if (
                !confirmDelete
            )
                return;

            await deleteEventAdmin(
                id
            );

            loadEvents();

        };

    const filteredEvents =
        events.filter(
            (event) => {

                const matchesSearch =
                    event.title
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchesStatus =
                    statusFilter ===
                        "all"
                        ? true
                        : event.status ===
                        statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );

    if (loading) {

        return (

            <div
                className="
                    p-8
                "
            >
                Loading...
            </div>

        );

    }

    return (

        <div
            className="
                p-8
            "
        >

            <h1
                className="
                    text-3xl
                    font-bold
                    mb-6
                "
            >
                Event Moderation
            </h1>

            <div
                className="
                    flex
                    gap-4
                    mb-6
                "
            >

                <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="
                        border
                        rounded-xl
                        px-4
                        py-2
                        w-72
                    "
                />

                <select
                    value={
                        statusFilter
                    }
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                    className="
                        border
                        rounded-xl
                        px-4
                        py-2
                    "
                >

                    <option value="all">
                        All
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="approved">
                        Approved
                    </option>

                    <option value="rejected">
                        Rejected
                    </option>

                </select>

            </div>

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    overflow-hidden
                "
            >

                <table
                    className="
                        w-full
                    "
                >

                    <thead
                        className="
                            bg-gray-100
                        "
                    >

                        <tr>

                            <th className="p-4 text-left">
                                Event
                            </th>

                            <th className="p-4 text-left">
                                Organizer
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-left">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredEvents.map(
                                (
                                    event
                                ) => (

                                    <tr
                                        key={
                                            event._id
                                        }
                                        className="
                                            border-b
                                        "
                                    >

                                        <td className="p-4">
                                            {
                                                event.title
                                            }
                                        </td>

                                        <td className="p-4">
                                            {
                                                event.organizer?.name
                                            }
                                        </td>

                                        <td className="p-4">

                                            {
                                                event.status
                                            }

                                        </td>

                                        <td className="p-4 flex gap-2">

                                            <button
                                                onClick={() =>
                                                    handleApprove(
                                                        event._id
                                                    )
                                                }
                                                className="
                                                    bg-green-600
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                "
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleReject(
                                                        event._id
                                                    )
                                                }
                                                className="
                                                    bg-yellow-500
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                "
                                            >
                                                Reject
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        event._id
                                                    )
                                                }
                                                className="
                                                    bg-red-600
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                "
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default AdminEvents;