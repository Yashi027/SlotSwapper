import mongoose from "mongoose"

export const connectdb = async () => {
    await mongoose.connect('mongodb+srv://anant_05:abcd1234@cluster0.trhvbj5.mongodb.net/slot-swapper')
        .then(() => console.log("DB Connected"))
}
