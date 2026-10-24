
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/onlinesurvey")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB error:", error));

const surveySchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  responses: [
    {
      answer: String,
    },
  ],
});

const Survey = mongoose.model("Survey", surveySchema);

app.get("/surveys", async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch surveys" });
  }
});

app.post("/surveys", async (req, res) => {
  try {
    const { question, options } = req.body;

    if (
      !question ||
      !Array.isArray(options) ||
      options.length < 2 ||
      options.some((option) => typeof option !== "string" || !option.trim())
    ) {
      return res.status(400).json({
        message: "Enter a question and at least two valid options",
      });
    }

    const survey = await Survey.create({
      question: question.trim(),
      options: options.map((option) => option.trim()),
    });

    res.status(201).json(survey);
  } catch (error) {
    res.status(400).json({ message: "Unable to create survey" });
  }
});

app.post("/surveys/:id/responses", async (req, res) => {
  try {
    const { answer } = req.body;
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    if (!survey.options.includes(answer)) {
      return res.status(400).json({ message: "Choose a valid option" });
    }

    survey.responses.push({ answer });
    await survey.save();

    res.json({ message: "Response submitted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Unable to submit response" });
  }
});

app.get("/surveys/:id/results", async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const results = survey.options.map((option) => ({
      option,
      votes: survey.responses.filter(
        (response) => response.answer === option
      ).length,
    }));

    res.json({
      question: survey.question,
      totalResponses: survey.responses.length,
      results,
    });
  } catch (error) {
    res.status(400).json({ message: "Unable to fetch results" });
  }
});

app.listen(5001, () => {
  console.log("Survey server running on port 5001");
});
