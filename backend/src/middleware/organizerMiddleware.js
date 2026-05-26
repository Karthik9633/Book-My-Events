const organizerOnly = (req, res, next) => {

    if (req.user.role !== "organizer" && req.user.role !== "admin") {

        return res.status(403).json({ message: "Organizer access required" })
    }
    next();

}

export default organizerOnly