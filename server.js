// this import is pulling from node_modules now
const express = require("express")
const db = require("./database")

const server = express()

// this is instaling some middleware to allow Express to parse json request bodies.
server.use(express.json())

server.get("/api/users", (req, res) => {
    const users = db.getUsers()

    if (users) {
        res.json(users)
    } else {
        res.status(500).json({
            errorMessage: "The users information could not be retrieved.",
        })
    }
})

server.get("/api/users/:id", (req, res) => {
    // the param variable matches up to the name of our URL param above
    const user = db.getUserById(req.params.id)

    if (user) {
        res.json(user)
    } else if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist.",
        })
    } else {
        res.status(500).json({
            errorMessage: "The user information could not be retrieved.",
        })
    }
})

server.post("/api/users", (req, res) => {
    if (!req.body.name || !req.body.bio) {
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user.",
        })
    } else if (req.body.name && req.body.bio) {
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio,
        })

        res.status(201).json(newUser)
    } else {
        res.status(500).json({
            errorMessage: "There was an error while saving the user to the database",
        })
    }
})

server.put("/api/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id)

    if (user) {
        const updatedUser =  db.updateUser(req.params.id, {
            name: req.body.name || user.name,
        })

        res.json(updatedUser)
    } else {
        res.status(404).json({
            message: "The user with the specified ID does not exist.",
        })
    }
})

server.delete("/api/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id)

    if (user) {
        res.json(db.deleteUser(req.params.id))
    } else {
        res.status(404).json({
            message: "The user with the specified ID does not exist.",
        })
    }
})

server.listen(8080, () => {
    console.log("server started on port 8080")
})
