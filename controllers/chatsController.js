import userSchema from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { gemini } from "../server.js";

export const getChats = asyncHandler(async (req, res) => {
  const user = await userSchema.findById(req.user._id);

  await user.updateOne({ lastAccess: new Date(Date.now()).toISOString() });

  res.json(req.user.chats);
});

export const createChat = asyncHandler(async (req, res) => {
  const { chatName, createdAt } = req.body;

  if (!chatName || !createdAt)
    return res.status(400).json({ message: "Chat name and creation required" });

  const user = await userSchema.findById(req.user._id);

  if (
    user.chats.find(
      (c) => c.chatName.trim().toLowerCase() === chatName.trim().toLowerCase()
    )
  )
    return res
      .status(401)
      .json({ message: "Non puoi creare chat con nomi uguali" });

  const request = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=6152467b7e79149d7&q=${chatName} image`,
    { method: "GET" }
  );
  const response = await request.json();

  const chatImage =
    response?.items[1]?.pagemap?.cse_image[0]?.src || null;

  user.chats.push({ chatName, chatImage, messages: [], createdAt });

  const newChat = (await user.save()).chats.at(-1);

  console.log(newChat);

  res.json({ newChat, message: `Chat creata` });
});

export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId, type } = req.query;

  if (!type)
    return res
      .status(400)
      .json({ message: "Please provide a delete type (ALL, BY_ID)" });

  const user = await userSchema.findById(req.user._id);

  let message = "";

  switch (type) {
    case "ALL":
      user.chats = [];
      await user.save();
      message = "Chat eliminate";
      break;
    case "BY_ID":
      if (!chatId)
        return res.status(400).json({ message: "Please provide a chat id " });

      await user.updateOne({
        chats: [...user.chats.filter((c) => c._id.toString() !== chatId)],
      });
      message = "Chat eliminata";
      break;
    default:
      return res
        .status(400)
        .json({ message: "Delete type accepted: ALL, BY_ID" });
  }

  res.json({ message });
});

export const saveChatMsgs = asyncHandler(async (req, res) => {
  const { chatId, newMsg } = req.body;

  if (!chatId || !newMsg)
    return res.status(404).json({ message: "Chat id or user message missing" });

  const user = await userSchema.findById(req.user._id);

  const chat = user.chats.find((c) => c._id.toString() === chatId);

  if (!chat)
    return res.status(404).json({ message: `Chat [${chatId}] not found` });

  const { messages } = chat;

  // GEMINI

  const completion = gemini.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: `In tutta questa chat dovrai rispondere come se fossi il seguente personaggio: ${chat.chatName}, senza mai rivelare di essere un intelligenza artificiale`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `Sono ${chat.chatName}, pronto a rispondere alle vostre domande.`,
          },
        ],
      },
      ...messages.map((m) => {
        return { role: m.role, parts: [{ text: m.content }] };
      }),
    ],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const { response } = await completion.sendMessage(newMsg.content);
  if (!response)
    res.status(400).json({ message: "Erorre di Gemini, riprovare piu tardi" });
  const text = response.text();

  if (!text)
    return res
      .status(400)
      .json({ message: "Erorre di Gemini, riprovare piu tardi" });

  messages.push(newMsg);

  const geminiRes = {
    role: "model",
    content: text,
    createdAt: new Date().toISOString(),
  };
  messages.push(geminiRes);

  await user.save();

  res.json({ speakingWith: chat.chatName, geminiRes });
});

export const deleteChatMsgs = asyncHandler(async (req, res) => {
  const { chatId } = req.query;

  if (!chatId)
    return res.status(400).json({ message: "Please provide a chat id" });

  const user = await userSchema.findById(req.user._id);

  const chatIndex = user.chats.findIndex((c) => c._id.toString() === chatId);

  if (chatIndex === -1)
    return res.status(404).json({ message: `Chat [${chatId}] not found` });

  user.chats[chatIndex].messages = [];

  await user.save();

  res.json({ message: `Messaggi eliminati` });
});
