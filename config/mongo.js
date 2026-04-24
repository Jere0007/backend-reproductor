import mongoose from "mongoose";
import User from "../src/users/user.model.js";
import Role from "../src/role/role.model.js";
import { hash } from "argon2";

export const dbConnection = async() => {
    try {
        mongoose.connection.on('error', () => {
            console.log("MongoDB | could not be connected to MongoDB");
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log("Mongo | Try connection")
        });
        mongoose.connection.on('connected', () => {
            console.log("Mongo | connected to MongoDB")
        });
        mongoose.connection.on('open', () => {
            console.log("Mongo | connected to database")
        });
        mongoose.connection.on('reconnected', () => {
            console.log("Mongo | reconnected to MongoDB")
        });
        mongoose.connection.on('disconnected', () => {
            console.log("Mongo | disconnected")
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

        await createDev();
        await createRoles();

    } catch (error) {
        console.log('Database connection failed', error);
    }
};

const createDev = async () => {
    try {
        const user = await User.findOne({ username: 'Developer1' });

        if (!user) {
            const cryptedPassword = await hash('dev123456');

            const userDev = new User({
                username: 'Developer1',
                name: 'Developer',
                surname: "developer",
                email: 'developer@gmail.com',
                password: cryptedPassword,
                role: 'DEVELOPER_ROLE'
            });

            await userDev.save();
            console.log('Developer user created successfully');
        } else {
            console.log("Developer already exists");
        }
    } catch (error) {
        console.log('Error creating Developer', error);
    }
};

const createRoles = async () => {
    try {
        const roles = [
            'DEVELOPER_ROLE',
            'USER_ROLE'
        ];

        for (let role of roles) {
            const exists = await Role.findOne({ role });
            if (!exists) {
                const newRole = new Role({ role });
                await newRole.save();
                console.log(`Rol ${role} creado correctamente`);
            } else {
                console.log(`El rol ${role} ya existe`);
            }
        }
    } catch (error) {
        console.log('Error creando roles:', error);
    }
};