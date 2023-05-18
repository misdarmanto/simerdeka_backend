import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface UserAttributes extends ZygoteAttributes {
	user_id: string;
	name: string;
	email: string;
	password: string;
	photo: string;
	role: "mahasiswa" | "prodi" | "jurusan" | "tim_mbkm";
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type UserCreationAttributes = Optional<UserAttributes, "id" | "created_on" | "modified_on">;

// We need to declare an interface for our model that is basically what our class would be
interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export const UserModel = sequelize.define<UserInstance>(
	"user",
	{
		...ZygoteModel,
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		photo: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		role: {
			type: DataTypes.ENUM("mahasiswa", "prodi", "jurusan", "tim_mbkm"),
			allowNull: false,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "user",
		deletedAt: false,
		paranoid: true,
		underscored: true,
		freezeTableName: true,
		engine: "InnoDB",
	}
);