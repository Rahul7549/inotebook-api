const express = require('express')
const Note = require('../models/Note')
const router = express.Router();
const fetchUser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


router.get('/getnote', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        return res.send(notes);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal error occurred')
    }
})

router.get(`/getnote/:noteId`, fetchUser, async (req, res) => {
    try {
        // const notes = await Note.find({ user: req.user.id })
        // return res.send(notes);

        let note = await Note.findById(req.params.noteId);
        if (!note) {
            return res.status(404).send('Not found');
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }
        return res.status(200).json(note);

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal error occurred')
    }
})

router.post('/createnote', [
    body('title', 'Please enter valid title').isLength({ min: 5 }),
    body('description', 'Please enter valid description').isLength({ min: 5 }),
], fetchUser, async (req, res) => {
    try {
        const inputValidation = await validationResult(req)
        if (!inputValidation.isEmpty()) {
            return res.status(400).send({ errors: inputValidation.array() })
        }
        const id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).send({ errors: 'Please authenticate using the valid token' })
        }
        const note = new Note({
            title: req.body.title,
            description: req.body.description,
            user: user.id
        })
        note.save()
            .then(() => {
                return res.send(note)
            })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ errors: 'Internal Error occurred' })
    }
})


router.put('/updatenote/:noteId', [
    body('title', 'Enter valid title').isLength({ min: 5 }),
    body('description', 'Please enter valid description').isLength({ min: 5 })
], fetchUser, async (req, res) => {
    try {
        const inputValidation = await validationResult(req);
        if (!inputValidation.isEmpty()) {
            return res.status(400).send({ errors: inputValidation.array() })
        }
        let note = await Note.findById(req.params.noteId);
        if (!note) {
            return res.status(404).send('Not found');

        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }

        const newNote = {}
        const { title, description, tag } = req.body;
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag;
        }
        console.log("newNote ",newNote);
        note=await Note.findByIdAndUpdate(req.params.noteId,{$set:newNote},{new:true})
        res.send(note);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal error occurred')

    }
})

router.delete('/deletenote/:noteId',fetchUser, async (req, res) => {
    try {

        let note = await Note.findById(req.params.noteId);
        if (!note) {
            return res.status(404).send('Not found');

        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }

        note=await Note.findByIdAndDelete(req.params.noteId)
        res.json({success:'Note deleted successfully'});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal error occurred')

    }
})

module.exports = router



