const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try { 
    const { ip, timestamp, browser, rawJson, ipApiName } = req.body; 
    console.log('接收到的请求数据:', { ip, timestamp, browser, rawJson, ipApiName }); // 更新日志

    // QQ邮箱SMTP配置 - 修正方法名
    const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.QQ_EMAIL,        // 你的QQ邮箱
            pass: process.env.QQ_PASSWORD      // QQ邮箱授权码
        }
    });
    console.log('SMTP 配置完成'); // 添加日志

    // 邮件内容
    const mailOptions = { 
        from: process.env.QQ_EMAIL, 
        to: process.env.QQ_EMAIL, 
        subject: `网站访问通知${ip}${timestamp}`, 
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff4757;">网站访问者通知</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                <p><strong>IP地址：</strong> ${ip}</p> 
                <p><strong>IP来源：</strong> ${ipApiName}</p>
                <p><strong>访问时间：</strong> ${timestamp}</p>
                <p><strong>浏览器：</strong> ${browser}</p>
                <p><strong>原始JSON数据：</strong></p>
                <pre style="background: #e9ecef; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${rawJson.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
              </div>
            </div>
          `
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'win' });
  } catch (error) {
    console.error('bad:', error);
    res.status(500).json({ error: 'bad and bad', details: error.message });
  }
};