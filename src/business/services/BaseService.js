class BaseService {

    constructor(classRepository) {
        this.repository = new classRepository();
    }

    async findById({ id }) {
        const entity = await this.repository.$getById(id);

        if (!entity)
            throw new Error("Não encontrado");

        return entity
    }
}

module.exports = BaseService