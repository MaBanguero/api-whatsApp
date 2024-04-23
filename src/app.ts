import {createBot, createProvider, createFlow, MemoryDB , addKeyword} from '@bot-whatsapp/bot'
import {BaileysProvider, handleCtx} from '@bot-whatsapp/provider-baileys'

const flowBienvenida = addKeyword('hola').addAnswer('Hey Nigga')

const main  = async () => {

    const provider =  createProvider(BaileysProvider)

    provider.initHttpServer(3002)

    provider.http?.server.post('/sendmessage', handleCtx(async(bot, req, res) => {
        await bot.sendMessage(req.body.telephone, req.body.message, {})
        res.end('mensaje enviado')
    }))

    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    })
}

main()