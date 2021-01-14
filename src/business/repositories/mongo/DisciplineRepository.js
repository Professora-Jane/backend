const BaseRepository = require("./BaseRepository");
const DisciplineModel = require("../../models/DisciplineModel");

class DisciplineRepository extends BaseRepository {
    constructor() {
        super(DisciplineModel)
    }

    async listDisciplines({ page, limit, search }) {
        const searchKeys = ["name", "description"]
        
        const response = await this.$paginate({ page, limit, search, searchFields: searchKeys, autoPopulateId: true })

        return response;
    }
}

module.exports = DisciplineRepository