const html = (Link, firstName) => {
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
                Welcome to Campus Trade!
            </div>
            <div class="content">
                <p>Hello ${firstName},</p>
                <p>We’re thrilled to have you join us! To get started, please verify your email address by clicking the button below:</p>
                <div class="button-container">
                    <a href="${Link}" class="button">Verify My Account</a>
                </div>
                <p>If the button above doesn't work, you can also verify your account by clicking this link:</p>
                <p><a href="${Link}" class="link">${Link}</a></p>
                <p>If you did not sign up for this account, please ignore this email.</p>
                <p>Best regards,<br>Team</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Campus Trade. All rights reserved.
            </div>
        </div>

    </body>
    </html>
    `;
};

module.exports = html;

exports.forgotTemplate = (link, name) => {
    return ` 
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campus Trade </title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #2c2c2c; /* Dark background */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                background-color: #f4f4f4; /* Light grey background */
            }
            .header {
                background: #221e75;
                padding: 20px;
                text-align: center;
                border-bottom: 1px solid #ddd;
                color: #ffffff;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                color: #333333;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background-color: #218838; /* Green background */
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #218838;
            }
            .footer {
                background: #221e75;
                padding: 10px;
                text-align: center;
                border-top: 1px solid #ddd;
                font-size: 0.9em;
                color: #cccccc;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Hello!</h1>
            </div>
            <div class="content">
                <p>Hello ${name},</p>
                <p>A password reset has been initiated on your account.</p>
                <p>Please click on the link to reset your password:</p>
                <div class="button-container">
                    <a href="${link}" class="button">Reset Password</a>
                </div>
                <p>If you did not initiate the request, kindly ignore this email.</p>
                <p>Best regards,<br>G3 team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
            </div>  
        </div>
    </body>
    </html>
    `
}
module.exports = html