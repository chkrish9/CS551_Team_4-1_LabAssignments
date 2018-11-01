const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ToDo = require('./../models/todo');

router.post('/', (req, res) => {
  const io = req.app.get('io');
  const toDo = new ToDo({
    description: req.body.description
  });
  toDo.save().then(()=> {
    io.emit('newTaskAdded');
  });
});

//Get method
router.get('/', (req, res) => {
  ToDo.find({}).then((todos) => {
    res.send(todos);
  });
});

router.put('/update/:id', (req, res) => {
  const io = req.app.get('io');
  console.log(req.body);
  ToDo.findByIdAndUpdate(req.params.id,{ $set: { description : req.body.description } },(err, todo) => {
    if (err) {
       res.json({ msg: 'Failed while updating todo', status: 'error' });
   } else {
    io.emit('newTaskAdded');
       res.json({ msg: 'Todo updated successfully' });
   }
});
});

//Delete method.
router.delete('/delete/:id', (req, res) => {
  const io = req.app.get('io');
  console.log(req.params.id);
  ToDo.remove({ _id: req.params.id },(err, result) => {
    if (err) {
        res.json({ msg: 'Failed while deleting todo', status: 'error',success:false });
    } else {
      io.emit('newTaskAdded');
      res.json({ msg: 'Todo deleted successfully' });
    }
});
});
module.exports = router;
