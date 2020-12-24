class ResultResponse {

    constructor(response, modelClass) {

        if (Array.isArray(response)) {
            let ret = [];
    
            response.forEach(element => {

                element = this.convertObjectIdToString(element);
                ret.push(new modelClass(element));
            });    
            return ret;
        }
        
        response = this.convertObjectIdToString(response);
        return new modelClass(response);
    }

    convertObjectIdToString (response){
        if (response.toJSON) {
            response = response.toJSON()
        }

        if (response._id) {
            response.id = response._id.toString()
            delete response._id
        }

        Object.entries(response).map(([elementKey,elementValue]) => {
                
            if(elementValue
                && (typeof elementValue === "object")
                && !(elementValue._bsontype) 
                && !(elementValue === "ObjectID")
                && (elementValue.constructor.name !== 'Date')){
                response[elementKey] = this.convertObjectIdToString(response[elementKey])
            }
            
            if(elementValue 
                && elementValue._bsontype 
                && elementValue._bsontype === 'ObjectID'){
                response[elementKey] = elementValue.toString();
            }


        })        
        return response;
    }
}

module.exports = ResultResponse;