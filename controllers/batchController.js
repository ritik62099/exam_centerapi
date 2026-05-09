const Batch = require("../models/Batch");

const createBatch = async (req, res) => {
  try {
    const batch = await Batch.create(req.body);

    res.status(201).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate("institute", "name code")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: batches,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      data: batch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBatch,
  getBatches,
  updateBatch,
  deleteBatch,
};