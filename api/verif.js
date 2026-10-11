
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
  const link = String(req.body?.link || "").trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email) || email.length > 254) {
    return res.status(400).json({
      status: false,
      message: "Format email tidak valid."
    });
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(link);
  } catch {
    return res.status(400).json({
      status: false,
      message: "Tautan tidak valid."
    });
  }

  if (
    parsedUrl.protocol !== "https:" ||
    !parsedUrl.hostname.includes(".")
  ) {
    return res.status(400).json({
      status: false,
      message: "Gunakan tautan HTTPS yang valid."
    });
  }

  return res.status(200).json({
    status: true,
    demo: true,
    message: "Input diterima. Verifier masih dalam mode demo.",
    data: {
      email,
      type: "demo"
    }
  });
};
