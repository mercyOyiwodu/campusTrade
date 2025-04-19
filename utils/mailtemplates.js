const signUpTemplate = (link, firstName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campus Trade | Verify Account</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7fafc;
                margin: 0;
                padding: 0;
                color: #2D3748;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #2C5282;
                padding: 30px 20px;
                text-align: center;
                color: #ffffff;
            }
            .header img {
                width: 130px;
                margin-bottom: 10px;
            }
            .content {
                padding: 30px 20px;
                text-align: center;
            }
            .button {
                display: inline-block;
                background-color: #38A169;
                color: #ffffff;
                padding: 12px 25px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #2F855A;
            }
            .footer {
                font-size: 14px;
                color: #718096;
                text-align: center;
                padding: 20px;
                background-color: #f7fafc;
            }
            a {
                color: #2C5282;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dvzbt6bxn/image/upload/v1713553316/campustrade-logo-white-bg_o8veja.png" alt="Campus Trade Logo" />
                <h1>Welcome to Campus Trade!</h1>
            </div>
            <div class="content">
                <p>Hi ${firstName},</p>
                <p>Thanks for signing up on Campus Trade. Please verify your email address by clicking the button below.</p>
                <a href="${link}" class="button">Verify My Account</a>
                <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
                <p><a href="${link}">${link}</a></p>
                <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Campus Trade. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
  };
  
  const forgotPasswordTemplate = (link, name) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campus Trade | Reset Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7fafc;
                margin: 0;
                padding: 0;
                color: #2D3748;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #221e75;
                padding: 30px 20px;
                text-align: center;
                color: #ffffff;
            }
            .header img {
                width: 130px;
                margin-bottom: 10px;
            }
            .content {
                padding: 30px 20px;
                text-align: center;
            }
            .button {
                display: inline-block;
                background-color: #218838;
                color: #ffffff;
                padding: 12px 25px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #1e7e34;
            }
            .footer {
                font-size: 14px;
                color: #cccccc;
                text-align: center;
                padding: 20px;
                background-color: #221e75;
            }
            a {
                color: #221e75;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dvzbt6bxn/image/upload/v1713553316/campustrade-logo-white-bg_o8veja.png" alt="Campus Trade Logo" />
                <h1>Password Reset</h1>
            </div>
            <div class="content">
                <p>Hi ${name},</p>
                <p>We received a request to reset your Campus Trade password.</p>
                <a href="${link}" class="button">Reset Password</a>
                <p style="margin-top: 20px;">Or copy and paste this link into your browser:</p>
                <p><a href="${link}">${link}</a></p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Campus Trade. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
  };
  
  module.exports = {
    signUpTemplate,
    forgotPasswordTemplate
  };
  