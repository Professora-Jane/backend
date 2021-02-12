const RoomController = require("../../controllers/RoomController");
const fastify = require('fastify');
const IdSchemaRequest = require("../../schemas/requests/IdSchemaRequest");
const DefaultPaginationQuery = require("../../schemas/requests/DefaultPaginationQuery");
const IdResponseSchema = require("../../schemas/responses/IdResponseSchema");
const creteRoomSchema = require("../../schemas/requests/CreateRoomRequest")


/**
 * 
 * @param { fastify.FastifyInstance } app 
 * @param {*} opts 
 * @param {*} done 
 */
module.exports = (app, opts, done) => {

    app.get(
        '/room/:id', 
        { 
            schema: { 
                tags: ['Room'],
                params: IdSchemaRequest.params,
            }
        },
        async (req, res) => await new RoomController().getRoomById(req, res)
    );
    
    app.get(
        '/room/current/:id', 
        { 
            schema: { 
                tags: ['Room'],
                params: IdSchemaRequest.params,
            }
        },
        async (req, res) => await new RoomController().getCurrentRoom(req, res)
    );
    
    app.get(
        '/room/list/finished/:id', 
        { 
            schema: { 
                tags: ['Room'],
                params: IdSchemaRequest.params,
                query: DefaultPaginationQuery,
            }
        },
        async (req, res) => await new RoomController().listFinishedRooms(req, res)
    );

    app.post(
        '/room', 
        { 
            schema: { 
                tags: ['Room'],
                body: creteRoomSchema.body,
                response: IdResponseSchema("Sala criada!!").response
            }
        },
        async (req, res) => await new RoomController().createRoom(req, res)
    );
    
    app.put(
        '/room/start/:id', 
        { 
            schema: { 
                tags: ['Room'],
                params: IdSchemaRequest.params
            }
        },
        async (req, res) => await new RoomController().startRoom(req, res)
    );

    app.put(
        '/room/finish/:id', 
        { 
            schema: { 
                tags: ['Room'],
                params: IdSchemaRequest.params
            }
        },
        async (req, res) => await new RoomController().finishRoom(req, res)
    );

    done()
}