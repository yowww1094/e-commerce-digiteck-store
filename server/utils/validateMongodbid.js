import mongoose from "mongoose"

const validateMongodbid = (id) => {
    const validateId = mongoose.Types.ObjectId.isValid(id);
    if (!validateId) {
        throw new Error("Id is not valide or does not exist!");
    }
}

export default validateMongodbid;