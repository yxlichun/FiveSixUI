const app = new (require('express'))()
const port = 8068

const server = new (require("./app"))(app, port)


server.start()


