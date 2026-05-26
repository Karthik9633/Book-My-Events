import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyEvents, deleteEvent } from "../api/eventApi";

const MyEvents = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadEvents = async () => {

        try {

            const { data } = await fetchMyEvents();
            if (data.success) {
                setEvents(data.events);
            }
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

    const handleDelete =
        async (id) => {

            if (!window.confirm("Delete event?")
            ) return;

            try {

                await deleteEvent(id);
                setEvents(prev =>
                    prev.filter(
                        event =>
                            event._id !== id
                    )
                );

            }
            catch (error) {
                console.log(error);
            }

        };

    if (loading) {
        return (
            <div>  Loading...  </div>
        );

    }

    return (

        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8" >My Events</h1>
            <div className="grid gap-6">
                {
                    events.map(
                        event => (
                            <div key={event._id} className=" bg-white rounded-xl shadow p-6 flex justify-between items-center" >
                                <div>
                                    <h2 className=" font-bold text-xl"> {event.title} </h2>
                                    <p> {event.category?.name}  </p>

                                    <p> {
                                        new Date(
                                            event.date
                                        )
                                            .toDateString()
                                    }

                                    </p>

                                </div>

                                <div className=" flex gap-3">

                                    <Link to={`/edit-event/${String(event._id).trim()}`} className=" bg-blue-500 text-white px-4 py-2 rounded" >

                                        Edit

                                    </Link>

                                    <button

                                        onClick={() =>

                                            handleDelete(
                                                event._id
                                            )

                                        }

                                        className="
bg-red-500
text-white
px-4 py-2
rounded"

                                    >

                                        Delete

                                    </button>

                                </div>

                            </div>

                        )

                    )

                }

            </div>

        </div>

    );

};

export default MyEvents;