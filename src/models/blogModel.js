const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const blogSchema = new mongoose.Schema(

    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        body: {
            type: String,
            required: true,
            trim: true
        },

        authorId: {
            type: objectId,
            trim: true,
            ref: "author"

        },

        tags: [String],


        category: {
            type: [String],
            trim: true,
            required: true

        },
        subcategory: {
            type: [String],
            required: true
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        deletedAt: { type: String },

        isPublished: {
            type: Boolean,
            default: false
        },
        
        publishedAt: { type: String },
    },

    { timestamps: true },
);

module.exports = mongoose.model("blog", blogSchema)
