const mongoose = require("mongoose");
const promocodeSchema = new mongoose.Schema({

    discountPromocode : {
        type : String
    },
    createdOn : {
        type : String
    },
    discountType : {
        type : String
    },
    discountValue : {
        type : String
    }
})


const promo = mongoose.model("promocode", promocodeSchema);
module.exports = promo;