
module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      status: false,
      message: "Gunakan metode POST."
    });
  }

  const email = String(req.body?.email || "").trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email) || email.length > 254) {
    return res.status(400).json({
      status: false,
      message: "Format email tidak valid."
    });
  }

  return res.status(200).json({
    status: true,
    demo: true,
    message: "Email valid. Backend Sender berhasil menerima permintaan.",
    data: {
      email,
      type: "demo"
    }
  });
};
