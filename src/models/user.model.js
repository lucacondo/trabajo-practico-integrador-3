import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      maxlength: 20,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profile: {
      firstName: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 2,
      },

      lastName: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 2,
      },

      birthDate: {
        type: Date,
      },

      phone: {
        type: String,
      },
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = model("User", UserSchema);