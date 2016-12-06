const app = new (require('express'))()
const port = 5656

const server = new (require("./app"))(app, port)


server.start()


