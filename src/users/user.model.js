import { Schema, model } from "mongoose";

const UserSchema = Schema({
    profilePhoto: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, 'Cannot exceed 25 characters']
    },
    surname: {
        type: String,
        required: [true, 'Surname is required'],
        maxLength: [25, 'Cannot exceed 25 characters']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        maxLength: [25, 'Cannot exceed 25 characters']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    birthday: {
        type: Date,
        required: false
    },
    role: {
        type: String,
        required: true,
        enum: [
            'DEVELOPER_ROLE',
            'USER_ROLE'
        ],
        default: "USER_ROLE"
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model('user', UserSchema);