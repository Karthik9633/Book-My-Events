import {
    useEffect,
    useState
}
    from "react";

import {
    getAnalytics,
    getRevenueStats
}
    from "../../api/adminApi";

import {

    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid

}

    from "recharts";

const AdminAnalytics = () => {

    const [
        revenueStats,
        setRevenueStats
    ] = useState(null);

    const [
        chartData,
        setChartData
    ] = useState([]);

    useEffect(() => {

        loadData();

    }, []);

    const loadData =
        async () => {

            try {

                const [
                    revenueRes,
                    analyticsRes
                ] =
                    await Promise.all([

                        getRevenueStats(),

                        getAnalytics()

                    ]);

                setRevenueStats(
                    revenueRes.data.stats
                );

                const chart =
                    Object.entries(
                        analyticsRes.data.monthlyRevenue
                    )
                        .map(
                            ([month, revenue]) => ({

                                month,

                                revenue

                            })
                        );

                setChartData(
                    chart
                );

            }

            catch (error) {

                console.log(error);

            }

        };

    return (

        <div
            className="
                p-8
                bg-gray-50
                min-h-screen
            "
        >

            <h1
                className="
                    text-3xl
                    font-bold
                    mb-8
                "
            >
                Analytics
            </h1>

            {/* Cards */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                    mb-8
                "
            >

                <div
                    className="
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "
                >

                    <h3
                        className="
                            text-gray-500
                        "
                    >
                        Revenue
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        ₹
                        {
                            revenueStats?.totalRevenue || 0
                        }
                    </p>

                </div>

                <div
                    className="
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "
                >

                    <h3>
                        Tickets Sold
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        {
                            revenueStats?.ticketsSold || 0
                        }
                    </p>

                </div>

                <div
                    className="
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "
                >

                    <h3>
                        Bookings
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        {
                            revenueStats?.totalBookings || 0
                        }
                    </p>

                </div>

                <div
                    className="
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "
                >

                    <h3>
                        Events With Sales
                    </h3>

                    <p
                        className="
                            text-3xl
                            font-bold
                            mt-2
                        "
                    >
                        {
                            revenueStats?.uniqueEvents || 0
                        }
                    </p>

                </div>

            </div>

            {/* Revenue Chart */}

            <div
                className="
                    bg-white
                    p-6
                    rounded-2xl
                    shadow
                "
            >

                <h2
                    className="
                        text-xl
                        font-bold
                        mb-6
                    "
                >
                    Monthly Revenue
                </h2>

                <div
                    className="
                        h-[400px]
                    "
                >

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <LineChart
                            data={chartData}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="month"
                            />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#7c3aed"
                                strokeWidth={3}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>

    );

};

export default AdminAnalytics;