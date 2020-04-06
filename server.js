const express = require("express")
const jsonServer = require("json-server");
const chokidar = require("chokidar");
const cors = require("cors");
const dotenv = require('dotenv');


// const port = process = process.argv[3] || 3500;


dotenv.config();

let router = undefined;

const app = express();

const createServer = () => {
    delete require.cache[require.resolve(process.env.FILENAME)];
    setTimeout(() => {
        router = jsonServer.router(process.env.FILENAME.endsWith(".js")
        ? require(process.env.FILENAME)() : process.env.FILENAME);
    }, 100)
}

createServer();

app.use(cors());
app.use(jsonServer.bodyParser)
app.use("/api", (req, resp, next) => router(req, resp, next));

chokidar.watch(process.env.FILENAME).on("change", () => {
    console.log("Reloading web services data...");
    createServer();
    console.log("Reloading web service data complete.")
});

app.listen(process.env.PORT, () => console.log(`Web service running on port ${process.env.PORT}`));