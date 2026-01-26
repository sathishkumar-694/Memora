const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });
    }
    const note = new Note({
      title,
      content,
      status,
      user: req.user.userId,
    });
    await note.save();
    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;
    
    // Find note by id and user to ensure ownership
    let note = await Note.findOne({ _id: id, user: req.user.userId });
    
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (status) note.status = status;

    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: req.user.userId });

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
