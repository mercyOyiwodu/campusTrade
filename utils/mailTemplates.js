const html = (verifyLink, firstName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #2D3748;
                background-color: #F7FAFC;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                max-width: 600px;
                margin: 30px auto;
                padding: 20px;
                background-color: #FFFFFF;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: #2C5282;
                padding: 20px;
                text-align: center;
                color: #FFFFFF;
                font-size: 22px;
                font-weight: bold;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 25px;
                text-align: center;
            }
            .button-container {
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background-color: #38A169;
                color: #FFFFFF;
                padding: 12px 25px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #2F855A;
            }
            .footer {
                margin-top: 20px;
                padding: 10px;
                text-align: center;
                font-size: 14px;
                color: #718096;
            }
            .link {
                color: #2C5282;
                font-weight: bold;
                text-decoration: none;
            }
            .link:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>

        <div class="container">
            <div class="header">
                Welcome to Our Platform!
            </div>
            <div class="content">
                <p>Hello ${firstName},</p>
                <p>We’re thrilled to have you join us! To get started, please verify your email address by clicking the button below:</p>
                <div class="button-container">
                    <a href="${verifyLink}" class="button">Verify My Account</a>
                </div>
                <p>If the button above doesn't work, you can also verify your account by clicking this link:</p>
                <p><a href="${verifyLink}" class="link">${verifyLink}</a></p>
                <p>If you did not sign up for this account, please ignore this email.</p>
                <p>Best regards,<br>Team</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Our Platform. All rights reserved.
            </div>
        </div>

    </body>
    </html>
    `;
};

module.exports = html;