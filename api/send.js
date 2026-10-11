
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email) || email.length > 254) {
    return res.status(400).json({
      status: false,
      message: "Format email tidak valid."
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
    const params = new URLSearchParams({ akseskey, email });
    const response = await fetch(
      `https://ndxhs.my.id/alightmotion/send?${params}`
    );

    const data = await response.json();

    if (!response.ok || data?.status !== true) {
      return res.status(502).json({
        status: false,
        message: data?.message || "Permintaan Sender gagal."
      });
    }

    return res.status(200).json({
      status: true,
      message: data.message || "Link verifikasi berhasil dikirim!",
      data: {
        email: data.data?.email || email,
        type: data.data?.type || "need_link"
      }
    });
  } catch {
    return res.status(502).json({
      status: false,
      message: "Layanan Sender tidak dapat dihubungi."
    });
  }
};
