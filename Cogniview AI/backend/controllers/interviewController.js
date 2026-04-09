const service = require("../services/interviewService");

exports.startInterview = async (req, res) => {
  const data = await service.startInterview();
  res.json(data);
};

exports.submitAnswer = async (req, res) => {
  const data = await service.submitAnswer(req.body);
  res.json(data);
};

exports.getResult = async (req, res) => {
  const data = await service.getResult(req.params.sessionId);
  res.json(data);
};