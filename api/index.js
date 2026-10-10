module.exports = (req, res) => {
  res.status(200).json({ status: "AWESOME-MD is running", uptime: process.uptime() });
};
