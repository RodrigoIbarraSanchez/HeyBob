//Dependencias
const Promise = require('bluebird');
const _ = require('lodash');
var unirest = require('unirest');

const pickCategory = {
    quick_replies: [
        {
            content_type: 'text',
            title: '🔥 Pedir algo 🔥',
            payload: 'PEDIDO'
        },
        {
            content_type: 'text',
            title: 'Consultar presio 💲',
            payload: 'PRECIO'
        },
        {
            content_type: 'text',
            title: 'Más información 💻',
            payload: 'INFORMACION'
        },
        {
            content_type: 'text',
            title: 'Hablar con un humano 👨🏼',
            payload: 'HUMANO'
        }
    ],
    typing: true
}

module.exports = function (bp) {

    bp.middlewares.load()

    bp.hear({
        type: 'postback',
        text: 'GET_STARTED'
    }, (event, next) => {
        const { first_name, last_name } = event.user
        bp.logger.info('New user:', first_name, last_name)

        const WELCOME_SENTENCES = [
            "Hola! Yo soy BOB! Tu asistente personal en línea para servicio a domicilio.",
            "Puedes pedirme lo que necesites y yo te lo llevo hasta la puesta de tu casa.",
            "¿Que deseas hoy?"
        ]

        const WELCOME_TEXT_QUICK_REPLY = "Elige una categoría de abajo o usa el menú en cualquier momento que lo necesites!"

        Promise.mapSeries(WELCOME_SENTENCES, txt => {
            bp.messenger.sendText(event.user.id, txt, { typing: true })
            return Promise.delay(4000)
        })
            .then(() => {
                bp.messenger.sendText(event.user.id, WELCOME_TEXT_QUICK_REPLY, pickCategory)
            })
    })

    // Respuestas quick reply
    bp.hear({
        type: 'quick_reply',
        text: 'PEDIDO'
    }, (event, next) => {
        const PICK_TEXT = "Utiliza la palabra Pedir + la lista de lo que necesitas separando cada artículo con una ',' y lo más detallado posible."
        bp.messenger.sendText(event.user.id, PICK_TEXT, { typing: true })
        Promise.delay(3000)
            .then(() => {
                bp.messenger.sendText(event.user.id, 'Ej. Pedido 2 botellas de agua mineral, 1 cacahuates salados, 2 paquetes de donas')
            })
    })
    bp.hear({
        type: 'quick_reply',
        text: 'PRECIO'
    }, (event, next) => {
        const PICK_TEXT = "Opción aún no disponible"
        bp.messenger.sendText(event.user.id, PICK_TEXT, { typing: true })
        /*Promise.delay(3000)
            .then(() => {
                bp.messenger.sendText(event.user.id, 'Ej. Pedido 2 botellas de agua mineral, 1 cacahuates salados, 2 paquetes de donas')
            })*/
    })
    bp.hear({
        type: 'quick_reply',
        text: 'INFORMACION'
    }, (event, next) => {
        const PICK_TEXT = "Opción aún no disponible"
        bp.messenger.sendText(event.user.id, PICK_TEXT, { typing: true })
        /*Promise.delay(3000)
            .then(() => {
                bp.messenger.sendText(event.user.id, 'Ej. Pedido 2 botellas de agua mineral, 1 cacahuates salados, 2 paquetes de donas')
            })*/
    })
    bp.hear({
        type: 'quick_reply',
        text: 'HUMANO'
    }, (event, next) => {
        const PICK_TEXT = "En unos minutos un humano estará atendiéndote"
        bp.messenger.sendText(event.user.id, PICK_TEXT, { typing: true })
        /*Promise.delay(3000)
            .then(() => {
                bp.messenger.sendText(event.user.id, 'Ej. Pedido 2 botellas de agua mineral, 1 cacahuates salados, 2 paquetes de donas')
            })*/
    })
    // Escuchando al usuario
    bp.hear({
        text: 'PEDIDO'
    }, (event, next) => {
        const PICK_TEXT = "Utiliza la palabra Pedir + la lista de lo que necesitas separando cada artículo con una ',' y lo más detallado posible."
        bp.messenger.sendText(event.user.id, PICK_TEXT, { typing: true })
        Promise.delay(3000)
            .then(() => {
                bp.messenger.sendText(event.user.id, 'Ej. Pedido 2 botellas de agua mineral, 1 cacahuates salados, 2 paquetes de donas')
            })
    })
    bp.hear({
        text: 'PRECIO'
    }, (event, next) => {
        const PICK_TEXT = "Opción aún no disponible."
        bp.messenger.sendText(event.user.id, PICK_TEXT, { typing: true })
        /*Promise.delay(3000)
            .then(() => {
                bp.messenger.sendText(event.user.id, 'Ej. Pedido 2 botellas de agua mineral, 1 cacahuates salados, 2 paquetes de donas')
            })*/
    })
    bp.hear({
        text: 'INFORMACION'
    }, (event, next) => {
        const PICK_TEXT = "Opción aún no disponible."
        bp.messenger.sendText(event.user.id, PICK_TEXT, { typing: true })
        /*Promise.delay(3000)
            .then(() => {
                bp.messenger.sendText(event.user.id, 'Ej. Pedido 2 botellas de agua mineral, 1 cacahuates salados, 2 paquetes de donas')
            })*/
    })
    bp.hear({
        text: 'HUMANO'
    }, (event, next) => {
        const PICK_TEXT = "En unos minutos un humano estará atendiéndote."
        bp.messenger.sendText(event.user.id, PICK_TEXT, { typing: true })
        /*Promise.delay(3000)
            .then(() => {
                bp.messenger.sendText(event.user.id, 'Ej. Pedido 2 botellas de agua mineral, 1 cacahuates salados, 2 paquetes de donas')
            })*/
    })

    // API.AI
    bp.hear({ 'nlp.action': 'smalltalk.person' }, (event, next) => {
        bp.messenger.sendText(event.user.id, 'My name is James')
    })


    bp.hear({ type: 'message', text: /Pedir/i }, (event, next) => {
        //exports.name = name;
        var evento = event.raw.message.text.replace('Pedir', '');
        unirest.post('http://localhost:5000/api/pedidos')
            .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
            //.send({"pedidoName": evento})
            .send({ "pedidoName": event.raw.message.text.replace('Pedir', '') })
            .end(function (response) {
                console.log(response.body);
                console.log("El mensaje: " + event.raw.message.text.replace('Pedir', ''));
                bp.messenger.sendText(event.user.id, '¡Muy bien! ¿Es todo lo que necesitas?')
            });
    })
}