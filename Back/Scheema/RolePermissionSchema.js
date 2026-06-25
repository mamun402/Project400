const mongoose = require("mongoose");

const RolePermissionSchema = mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true, // Ensures role is unique
  },
  permissions: {
    addNotice: { type: Boolean, default: false },
    addEvent: { type: Boolean, default: false },
    addBlog: { type: Boolean, default: false },
    addGallery: { type: Boolean, default: false },
    addTestimonial: { type: Boolean, default: false },
  },
});

// Create a model from the schema
const RolePermission = mongoose.model("RolePermission", RolePermissionSchema);

// Export the model (not the schema)
module.exports = RolePermission;
