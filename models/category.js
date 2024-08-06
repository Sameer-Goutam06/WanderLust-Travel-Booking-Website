const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Ensures each category name is unique
    },
    icon: {
        type: String,
        required: true,  // Stores the icon class name or file path
    }
});

const Category = mongoose.model('Category', categorySchema);

categorySchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        console.log('Deleted category:', doc);
        try {
            // Remove the deleted category from all listings
            await Listing.updateMany(
                { categories: doc._id },
                { $pull: { categories: doc._id } }
            );
            console.log('Category removed from listings successfully');
        } catch (error) {
            console.error('Error removing category from listings:', error);
        }
    }
});

module.exports = Category;
