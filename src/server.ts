import { getTransacao } from "@routes/get-transaction";
import { fastify } from "fastify";

const app = fastify()

app.register(getTransacao)

app.get('/', () => {
    return 'Hello World'
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP server running')
})