import express from 'express';

// REST APIS: GET (retrieve), POST (create), PUT (replace), PATCH (update), and DELETE (remove).

const app = express()

// Middleware -- parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

const PORT = 5001;

const server = app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})

