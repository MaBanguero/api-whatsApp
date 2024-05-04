import {createBot, createProvider, createFlow, MemoryDB , addKeyword} from '@bot-whatsapp/bot'
import {BaileysProvider, handleCtx} from '@bot-whatsapp/provider-baileys'

const flowBienvenida = addKeyword('hola').addAnswer('Hey Nigga')
const flowBoton = addKeyword('boton').addAnswer('Hey Nigga', {
    buttons:[
    {
        'body':'hola'
    },
    {
        'body':'comprar'
    }
]})



const main  = async () => {

    const provider =  createProvider(BaileysProvider)

    provider.on('message',async (msg)=>{
        //console.log(msg)
        const { body, from } = msg;
        const prevMsg = await new MemoryDB().getPrevByNumber(from);
        const pre = await coreInstance.databaseClass.listHistory
        const orderRecogida = /^recogida [0-9]*$/i;
        const orderEntregada = /^entregada [0-9]*$/i;
        const entregaSinExito = /^entrega sin exito [0-9]*$/i;
        let  order_id = ''
        let action = ''
        console.log('Core Instance', pre)
        console.log(body)
        if (orderRecogida.test(body)) {
            const regex = /recogida/gi; 
            order_id = body.replace(regex, '');
            action ='recogida'
            
            
        } else if(orderEntregada.test(body)) {
            const regex = /entregada/gi; 
            order_id = body.replace(regex, '');
            action = 'entregada'

        } else if(entregaSinExito.test(body)) {
            const regex = /entrega sin exito/gi; 
            order_id = body.replace(regex, '');
            action = 'entrega sin exito'
        }
        orderUpdate({
            'telephone':from,
            'order_id':order_id,
            'action': action
        })
        /*if (prevMsg?.ref) {
                delete prevMsg._id;
                const ctxByNumber = toCtx({
                    body,
                    from,
                    prevRef: prevMsg.refSerialize,
                });
                await this.databaseClass.save(ctxByNumber);
        }*/
        const state = coreInstance.stateHandler.get(from)
        console.log('state', state(from))
    })

    const orderUpdate = (data) => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'content-type':'application/json', 
                'Authorization':'token c3d3f84514338861617367fef6f80582e110755c'
            }),
            body: JSON.stringify(data)
        };
            
        fetch(`http://18.221.153.229/api/V1/orders/changestatus`, options)
        .then((response) => response.json())
        .then((response)=> {
            console.log(response)
        })
    }



    provider.initHttpServer(3002)
    const button= [{'body':'Tomar Orden'}]

    provider.http?.server.post('/sendmessage', handleCtx(async(bot, req, res) => {
        console.log(req.body.telephone)
        await bot.sendMessage(req.body.telephone, req.body.message,{})
        res.end('mensaje enviado')
    }))

    const coreInstance = await createBot({
        flow: createFlow([flowBienvenida, flowBoton]),
        database: new MemoryDB(),
        provider
    })

    /*coreInstance.listenerBusEvents().forEach(eventConfig => {
        coreInstance.on(eventConfig.event, eventConfig.func);
    });*/
}

main()