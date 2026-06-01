import {
    useEffect,
    useState
}
    from "react";

import {

    getAllUsers,

    toggleUserStatus,

    changeUserRole

}

    from "../../api/adminApi";

const AdminUsers = () => {

    const [

        users,

        setUsers

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(true);

    const loadUsers = async () => {

        try {

            const { data } =
                await getAllUsers();

            setUsers(data.users);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadUsers();

    }, []);

    const handleToggle =
        async (id) => {

            await toggleUserStatus(id);

            loadUsers();

        };

    const handleRoleChange =
        async (id, role) => {

            await changeUserRole(
                id,
                role
            );

            loadUsers();

        };

    if (loading) {

        return (

            <div
                className="
                    p-10
                "
            >

                Loading Users...

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
                    mb-8
                "
            >

                User Management

            </h1>

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

                            <th
                                className="
                                    p-4
                                    text-left
                                "
                            >
                                Name
                            </th>

                            <th
                                className="
                                    p-4
                                    text-left
                                "
                            >
                                Email
                            </th>

                            <th
                                className="
                                    p-4
                                    text-left
                                "
                            >
                                Role
                            </th>

                            <th
                                className="
                                    p-4
                                    text-left
                                "
                            >
                                Status
                            </th>

                            <th
                                className="
                                    p-4
                                    text-left
                                "
                            >
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.map((user) => (

                            <tr
                                key={user._id}
                                className="
                                    border-b
                                "
                            >

                                <td
                                    className="
                                        p-4
                                    "
                                >
                                    {user.name}
                                </td>

                                <td
                                    className="
                                        p-4
                                    "
                                >
                                    {user.email}
                                </td>

                                <td
                                    className="
                                        p-4
                                    "
                                >

                                    <select
                                        value={
                                            user.role
                                        }
                                        onChange={(e) =>
                                            handleRoleChange(
                                                user._id,
                                                e.target.value
                                            )
                                        }
                                        className="
                                            border
                                            rounded-lg
                                            px-3
                                            py-1
                                        "
                                    >

                                        <option value="user">
                                            User
                                        </option>

                                        <option value="organizer">
                                            Organizer
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>

                                    </select>

                                </td>

                                <td
                                    className="
                                        p-4
                                    "
                                >

                                    {user.isActive
                                        ? "🟢 Active"
                                        : "🔴 Disabled"}

                                </td>

                                <td
                                    className="
                                        p-4
                                    "
                                >

                                    <button
                                        onClick={() =>
                                            handleToggle(
                                                user._id
                                            )
                                        }
                                        className="
                                            bg-purple-600
                                            text-white
                                            px-4
                                            py-2
                                            rounded-lg
                                        "
                                    >

                                        {user.isActive
                                            ? "Disable"
                                            : "Enable"}

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default AdminUsers;