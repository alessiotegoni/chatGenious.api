import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
      select: true,
    },
    chats: [
      {
        chatName: { type: String, required: [true, "Chat name is required"] },
        chatImage: { type: String },
        messages: [
          {
            role: {
              type: String,
              required: [true, "Message role is required"],
            },
            content: {
              type: String,
              required: [true, "Message content is required"],
            },
            createdAt: {
              type: Date,
              required: [true, "Message timestamp is required"],
            },
          },
        ],
        createdAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

// userSchema.pre("init", function (next) {
//   if (!this.chats) this.chats = {};

//   next();
// });

export default model("users", userSchema);
