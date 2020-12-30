const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const DisciplineRepository = require("../repositories/DisciplineRepository");
const BaseService = require("./BaseService");

class DisciplineService extends BaseService {
    constructor() {
        super()
        this.repository = new DisciplineRepository();
    }

    async createDiscipline({ name, description }) {
        const createdDiscipline = await this.repository.$save({ name, description })

        return createdDiscipline;
    }

    async listDisciplines({ page, limit, search }) {
        const disciplines = await this.repository.listDisciplines({ page, limit, search });

        if (!disciplines)
            throw new NotFoundException("Nenhuma disciplina encontrada para os termos informados", { page, limit, search })

        return disciplines;
    }
}

module.exports = DisciplineService
