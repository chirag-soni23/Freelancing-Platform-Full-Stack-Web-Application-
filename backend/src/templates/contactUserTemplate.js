const contactUserTemplate = ({
  name,
  description,
}) => {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f7f5; padding:20px; font-family: Arial, sans-serif;">
    
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #eee;">
          
          <!-- HEADER -->
          <tr>
            <td style="background:#111827; color:#fff; padding:18px; font-size:24px; font-weight:bold;">
              🚀 Thank You
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:25px; color:#333;">

              <p style="margin:0 0 20px; font-size:18px;">
                Hello <strong>${name}</strong>,
              </p>

              <p style="margin:0 0 20px; line-height:1.7;">
                Thank you for contacting us.
                We have successfully received your message and our team will get back to you soon.
              </p>

              <p style="margin:0 0 10px;">
                <strong>Your Message:</strong>
              </p>

              <div
                style="
                  background:#f4f4f4;
                  padding:15px;
                  border:1px solid #ddd;
                  color:#333;
                  line-height:1.7;
                "
              >
                ${description}
              </div>

              <p style="margin-top:25px; line-height:1.7;">
                We appreciate your interest in our platform.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:12px; font-size:12px; color:#777; text-align:center;">
              © ${new Date().getFullYear()} Freelancer Platform
            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>
  `;
};

export default contactUserTemplate;