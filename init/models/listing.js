const mongoose = require("mongoose")
const Review = require("./review.js");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        // image: {
        //     type: mongoose.Schema.Types.Mixed,
        //     set: (v) => v === "" ? "https://images.pexels.com/photos/2422259/pexels-photo-2422259.jpeg?auto=compress&cs=tinysrgb&w=600" : v
        // },
        image: {
            url: {
                type: String,
                default: 'https://images.pexels.com/photos/2422259/pexels-photo-2422259.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            filename: {
                type: String,
            },
        },
        name: {
            type: String
        },
        price: {
            type: Number
        },
        location: {
            type: String
        },
        country: {
            type: String
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
);

listingSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });  //  _id use, not use id
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;