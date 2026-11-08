import { model, Schema } from "mongoose";

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      minlength: 20,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "La capacidad debe ser un número entero",
      },
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "finished"],
      default: "scheduled",
    },
    location: {
      venue: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
      },
      address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 150,
      },
      city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
      },
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const EventModel = model("Event", EventSchema);
