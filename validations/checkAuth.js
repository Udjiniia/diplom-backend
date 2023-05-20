import jwt from "jsonwebtoken"

export const checkUser = (req, res, next) => {
    const token = (req.headers.authorization || "Empty").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'diplom');
            if (decodedToken.role === "user") {
                req.userId = decodedToken._id;
                req.userRole = decodedToken.role
                next();
            } else {
                return res.status(403).json({
                    message: "Not authorized"
                })
            }
        } catch (err) {
            res.status(403).json({
                message: "Not authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "Not authorized"
        })
    }
}
export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || "Empty").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'diplom');
                req.userId = decodedToken._id;
                req.userRole = decodedToken.role
                next();
        } catch (err) {
            res.status(403).json({
                message: "Not authorized!"
            })
        }
    } else {
        return res.status(403).json({
            message: "Not authorized"
        })
    }
}

export const checkAdmin = (req, res, next) => {
    const token = (req.headers.authorization || "Empty").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'diplom');
            if (decodedToken.role === "admin") {
                req.userId = decodedToken._id;
                req.userRole = decodedToken.role
                next();
            } else {
                return res.status(403).json({
                    message: "Not authorized"
                })
            }
        } catch (err) {
            res.status(403).json({
                message: "Not authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "Not authorized"
        })
    }
}

export const checkHead = (req, res, next) => {
    const token = (req.headers.authorization || "Empty").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'diplom');
            if (decodedToken.role === "head") {
                req.userId = decodedToken._id;
                req.userRole = decodedToken.role
                next();
            } else {
                return res.status(403).json({
                    message: "Not authorized"
                })
            }
        } catch (err) {
            res.status(403).json({
                message: "Not authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "Not authorized"
        })
    }
}

export const checkAdministration = (req, res, next) => {
    const token = (req.headers.authorization || "Empty").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'diplom');
            if (decodedToken.role === "head" || "admin") {
                req.userId = decodedToken._id;
                req.userRole = decodedToken.role
                next();
            } else {
                return res.status(403).json({
                    message: "Not authorized"
                })
            }
        } catch (err) {
            res.status(403).json({
                message: "Not authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "Not authorized"
        })
    }
}

export const checkWorker = (req, res, next) => {
    const token = (req.headers.authorization || "Empty").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'diplom');
            if (decodedToken.role === "worker") {
                req.userId = decodedToken._id;
                req.userRole = decodedToken.role
                next();
            } else {
                return res.status(403).json({
                    message: "Not authorized"
                })
            }
        } catch (err) {
            res.status(403).json({
                message: "Not authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "Not authorized"
        })
    }
}

export const checkRole = (req, res) => {
    const token = (req.headers.authorization || "Empty").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'diplom');
            res.json({role: decodedToken.role})
        } catch (err) {
            res.status(403).json({
                message: "Not authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "Not authorized"
        })
    }
}


