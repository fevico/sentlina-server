import express from "express"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Server running fine!")
})

app.listen(() => {
    console.log("Server started!")
})