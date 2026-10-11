
module.exports = async (req, res) => {
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

  let parsedLink;
  try {
    parsedLink = new URL(link);
  } catch {
    return res.status(400).json({
      status: false,
      message: "Format tautan tidak valid."
    });
  }

  if (parsedLink.protocol !== "https:") {
    return res.status(400).json({
      status: false,
      message: "Tautan harus menggunakan HTTPS."
    });
  }

  const akseskey = process.env.AM_API_KEY;
  if (!akseskey) {
    return res.status(500).json({
      status: false,
      message: "API key belum dikonfigurasi di Vercel."
    });
  }

  try {
    const params = new URLSearchParams({
      akseskey,
      email,
      link
    });

    const response = await fetch(
      `https://ndxhs.my.id/alightmotion/verify?${params}`
    );

    const data = await response.json();

    if (!response.ok || data?.status !== true) {
      return res.status(502).json({
        status: false,
        message: data?.message || "Verifikasi gagal."
      });
    }

    const duration = data.data?.duration || "";
    const durationText = duration === "1_year"
      ? "1 Tahun"
      : duration.replaceAll("_", " ");

    return res.status(200).json({
      status: true,
      message: data.message || "Verifikasi berhasil!",
      data: {
        email: data.data?.email || email,
        type: data.data?.type || "success",
        duration: durationText
      }
    });
  } catch {
    return res.status(502).json({
      status: false,
      message: "Layanan Verifier tidak dapat dihubungi."
    });
  }
};
