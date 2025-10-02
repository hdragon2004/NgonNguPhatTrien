var express = require('express');
var router = express.Router();
let userModel = require('../schemas/user');

router.get('/', async function (req, res, next) {
  try {
    let query = { isDelete: false };

    if (req.query.search) {
      query.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { fullName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    let users = await userModel.find(query).populate('role');
    res.send({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    let user = await userModel.findById(req.params.id).populate('role');
    if (!user || user.isDelete) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
    res.send({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.get('/username/:username', async function (req, res, next) {
  try {
    let user = await userModel.findOne({
      username: req.params.username,
      isDelete: false
    }).populate('role');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
    res.send({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.post('/', async function (req, res, next) {
  try {
    let newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName || "",
      avatarUrl: req.body.avatarUrl || "",
      status: req.body.status || false,
      role: req.body.role,
      loginCount: req.body.loginCount || 0
    });
    await newUser.save();

    await newUser.populate('role');

    res.send({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    let updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        status: req.body.status,
        role: req.body.role,
        loginCount: req.body.loginCount
      },
      { new: true }
    ).populate('role');

    if (!updatedUser || updatedUser.isDelete) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
    res.send({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    let deletedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    ).populate('role');

    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }
    res.send({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

router.post('/verify', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).send({
        success: false,
        message: 'Email and username are required'
      });
    }

    let user = await userModel.findOne({
      email: email,
      username: username,
      isDelete: false
    }).populate('role');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found with provided email and username'
      });
    }

    let updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { status: true },
      { new: true }
    ).populate('role');

    res.send({
      success: true,
      message: 'User verified successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
