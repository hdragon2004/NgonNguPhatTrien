var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')
let { Response } = require('../utils/responseHandler')
let { Authentication, Authorization } = require('../utils/authHandler')
let { validatorRegister, validatorChangpassword, validatorForgotPassword, validatedResult } = require('../utils/validator')
let { sendMail } = require('../utils/sendMailHandler');

router.post('/register', validatorRegister, validatedResult, async function (req, res, next) {
  try {
    console.log('Register request received:', req.body);
    
    let role = await roles.findOne({ name: "USER" });
    if (!role) {
      console.log('Role USER not found');
      return Response(res, 500, false, "Role USER không tồn tại");
    }
    
    // Kiểm tra username đã tồn tại
    let existingUser = await users.findOne({ username: req.body.username });
    if (existingUser) {
      console.log('Username already exists');
      return Response(res, 400, false, "Tên đăng nhập đã tồn tại");
    }
    
    // Kiểm tra email đã tồn tại
    let existingEmail = await users.findOne({ email: req.body.email });
    if (existingEmail) {
      console.log('Email already exists');
      return Response(res, 400, false, "Email đã tồn tại");
    }
    
    let newUser = new users({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: role._id
    });
    
    await newUser.save();
    console.log('User created successfully');
    Response(res, 200, true, "Đăng ký thành công");
  } catch (error) {
    console.error('Register error:', error);
    Response(res, 500, false, "Lỗi server: " + error.message);
  }
});
router.post('/login', async function (req, res, next) {
  try {
    console.log('Login request received:', req.body);
    
    let username = req.body.username;
    let password = req.body.password;
    
    if (!username || !password) {
      return Response(res, 400, false, "Vui lòng nhập đầy đủ thông tin");
    }
    
    let user = await users.findOne({
      username: username
    });
    
    if (!user) {
      console.log('User not found:', username);
      return Response(res, 404, false, "Tên đăng nhập không tồn tại");
    }
    
    let result = bcrypt.compareSync(password, user.password);
    if (result) {
      let token = jwt.sign({
        _id: user._id,
        exp: Date.now() + 15 * 60 * 1000
      }, "NNPTUD");
      
      res.cookie("token", "Bearer " + token, {
        httpOnly: true,
        maxAge: 60 * 1000 * 60 * 24 * 7
      });
      
      console.log('Login successful for user:', username);
      Response(res, 200, true, {
        message: "Đăng nhập thành công",
        token: token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } else {
      console.log('Wrong password for user:', username);
      Response(res, 403, false, "Mật khẩu không đúng");
    }
  } catch (error) {
    console.error('Login error:', error);
    Response(res, 500, false, "Lỗi server: " + error.message);
  }
});
router.post("/logout", function (req, res, next) {
  try {
    res.cookie("token", "");
    Response(res, 200, true, "logout thanh cong");
  } catch (error) {
    Response(res, 404, false, "token sai");
  }
})
router.get('/me', Authentication, Authorization("ADMIN", "MOD", "USER"), async function (req, res, next) {
  let user = await users.findById(req.userId).select(
    "username email fullname avatarURL"
  ).populate({
    path: 'role',
    select: 'name'
  });
  Response(res, 200, true, user)
})
router.post('/changepassword', Authentication, validatorChangpassword, validatedResult, async function (req, res, next) {
  let user = await users.findById(req.userId);
  if (bcrypt.compareSync(req.body.oldpassword, user.password)) {
    user.password = req.body.newpassword;
    await user.save();
    Response(res, 200, true, "doi password thanh cong");
  } else {
    Response(res, 400, false, "oldpassword khong dung");
  }

})
router.post('/forgotpassword', validatorForgotPassword, async function (req, res, next) {
  let user = await users.find({
    email: req.body.email
  })
  if (user.length > 0) {
    user = user[0];
    user.forgotPasswordToken = GenerateRandomString(64);
    user.forgotPasswordTokenExp = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    let URL = "http://localhost:3000/auth/resetpassword/" + user.forgotPasswordToken;
    await sendMail(URL,user)
    Response(res, 200, true, URL);
  } else {
    Response(res, 404, false, "email khogn ton tai");
  }
})
router.post('/resetpassword/:token', async function (req, res, next) {
  let user = await users.find({
    forgotPasswordToken: req.params.token
  })
  if (user.length > 0) {
    user = user[0];
    if (user.forgotPasswordTokenExp < Date.now()) {
      user.forgotPasswordToken = "";
      user.forgotPasswordTokenExp = 0;
      await user.save();
      Response(res, 404, false, "token het han");
    } else {
      user.password = req.body.newpassword;
      user.forgotPasswordToken = "";
      user.forgotPasswordTokenExp = 0;
      await user.save();
      Response(res, 200, true, "doi pass thanh cong");
    }
  } else {
    Response(res, 404, false, "token khong ton tai");
  }

})


function GenerateRandomString(length) {
  let result = "";
  let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let index = 0; index < length; index++) {
    let random = Math.floor(Math.random() * source.length);
    result += source.charAt(random);
  }
  return result;
}


module.exports = router;
