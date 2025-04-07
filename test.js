const email = 'sswcwecew'
const verificationCode = email ? Math.floor(1000 + Math.random() * 9000).toString() : null;

console.log(verificationCode)