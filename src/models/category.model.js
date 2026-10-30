import { model, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 30,
    },
    description: {
      type: String,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
  CategorySchema.virtual("events", {
    ref: "Event",
    localField: _id,
    foreignField: "categories",
  }),
);

export const CategoryModel = model("Category", CategorySchema)