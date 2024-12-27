const createHTTPError = require("http-errors");
const categoryModel = require("../../models/category_model.js");

const deleteTransaction=async(req,res,next)=>{
    try {
        const userId=req.user.id
        const mainCategory = req.params.mainCategory;
        const subCategory = req.params.subCategory;
        const transactionId=req.params.id;

        try {
            const toDelete=await categoryModel.findOne({userId,flowType:mainCategory,"subCategories.name":subCategory,"subCategories.transactions._id":transactionId})
            if (!toDelete) {
                return next(createHTTPError(404, `Transaction not found`));
            }
            const indexOfSubCat=toDelete.subCategories.findIndex((i)=>i.name==subCategory)
            const indexToDelete=toDelete.subCategories[indexOfSubCat].transactions.findIndex((i)=>i._id.toString()==transactionId)
            console.log({indexOfSubCat, indexToDelete})
            if(indexOfSubCat==-1 || indexToDelete==-1){return next(createHTTPError(404,`Can't match index to delete`))}
            try {
                toDelete.subCategories[indexOfSubCat].transactions.splice(indexToDelete,1)
                await toDelete.save();
            } catch (error) {
                return next(createHTTPError(500,`Error deleting transaction in db:${error}`))
            }
            res.json({toDel: toDelete})
            // const indexToDelete=toDelete.subCategories
        } catch (error) {
            return next(createHTTPError(404,`Error can't find transaction to delete`))
        }
    } catch (error) {
        return next(createHTTPError(500, `Error deleting transaction: ${error}`))
    }
}

const deleteSubCategory=async(req,res,next)=>{
    const mainCategory = req.params.mainCategory;
    const subCategory = req.params.id;
    const userId=req.user.id;

    try {
        const toDelete=await categoryModel.findOne({userId,flowType:mainCategory,"subCategories._id":subCategory})
        if (!toDelete) {
            return next(createHTTPError(404, `Subcategory not found`));
        }
        const indexToDelete=toDelete.subCategories.findIndex(i => i._id.toString() === subCategory)
        toDelete.subCategories.splice(indexToDelete,1)
        
        try {
            await toDelete.save()
            res.json({toDelete: toDelete.subCategories})
        } catch (error) {
            return next(createHTTPError(500,`Can't update deleted subCat to db: ${error}`))
        }
    } catch (error) {
        return next(createHTTPError(500,`Can't find subCategory to delete: ${error}`));
    }
}

module.exports={deleteTransaction, deleteSubCategory}