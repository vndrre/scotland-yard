const express = require('express');
const { createGame, joinGame, makeMove } = require('../controllers/gameController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createGame);
router.post('/:code/join', auth, joinGame);
router.post('/:id/move', auth, makeMove);

module.exports = router;