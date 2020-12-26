"use strict";
const ResultResponse = require("./BaseResponseModel");
const SchemaObject = require("schema-object");

const IdResponseSchemaObject = new SchemaObject({
    id: { type: String }
});

class IdResponse extends ResultResponse {
    constructor(response) {
        super(response, IdResponseSchemaObject);
    }
}

module.exports = { IdResponse: IdResponse };
