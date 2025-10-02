var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/role');

router.get('/', async function (req, res, next) {
  try {
    let roles = await roleModel.find({ isDelete: false });
    res.send({
      success: true,
      data: roles
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
    let role = await roleModel.findById(req.params.id);
    if (!role || role.isDelete) {
      return res.status(404).send({
        success: false,
        message: 'Role not found'
      });
    }
    res.send({
      success: true,
      data: role
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
    let newRole = new roleModel({
      name: req.body.name,
      description: req.body.description
    });
    await newRole.save();
    res.send({
      success: true,
      data: newRole
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
    let updatedRole = await roleModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description
      },
      { new: true }
    );
    if (!updatedRole || updatedRole.isDelete) {
      return res.status(404).send({
        success: false,
        message: 'Role not found'
      });
    }
    res.send({
      success: true,
      data: updatedRole
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
    let deletedRole = await roleModel.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );
    if (!deletedRole) {
      return res.status(404).send({
        success: false,
        message: 'Role not found'
      });
    }
    res.send({
      success: true,
      message: 'Role deleted successfully',
      data: deletedRole
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
