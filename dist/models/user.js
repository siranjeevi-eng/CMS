"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require('bcrypt');
const Schema = mongoose_1.default.Schema;
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["DOCTOR"] = "doctor";
})(Role || (exports.Role = Role = {}));
const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.DOCTOR
    }
});
UserSchema.pre("save", async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=user.js.map