const { PrismaClient } = require('@prisma/client');
const { GameStatus, PlayerRole } = require('../types/game');
const { generateGameCode } = require('../utils/helpers');

const prisma = new PrismaClient();

const createGame = async (req, res) => {
  try {
    const { userId } = req.user;
    const code = generateGameCode();

    const game = await prisma.game.create({
      data: {
        code,
        status: GameStatus.WAITING,
        players: {
          create: {
            userId,
            role: PlayerRole.MR_X,
            isActive: true,
          }
        }
      },
      include: {
        players: {
          include: {
            user: {
              select: {
                username: true,
              }
            }
          }
        }
      }
    });

    res.json(game);
  } catch (error) {
    res.status(400).json({ error: 'Game creation failed' });
  }
};

const joinGame = async (req, res) => {
  try {
    const { code } = req.params;
    const { userId } = req.user;

    const game = await prisma.game.findUnique({
      where: { code },
      include: { players: true }
    });

    if (!game || game.status !== GameStatus.WAITING) {
      return res.status(400).json({ error: 'Game not available' });
    }

    const player = await prisma.player.create({
      data: {
        gameId: game.id,
        userId,
        role: PlayerRole.DETECTIVE,
        isActive: true,
      }
    });

    res.json(player);
  } catch (error) {
    res.status(400).json({ error: 'Failed to join game' });
  }
};

const makeMove = async (req, res) => {
  try {
    const { gameId, fromLocation, toLocation, transportType } = req.body;
    const { userId } = req.user;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true }
    });

    if (!game || game.status !== GameStatus.IN_PROGRESS) {
      return res.status(400).json({ error: 'Invalid game' });
    }

    const player = game.players.find(p => p.userId === userId);
    if (!player || !player.isActive) {
      return res.status(400).json({ error: 'Invalid player' });
    }

    const move = await prisma.move.create({
      data: {
        gameId,
        playerId: player.id,
        round: game.currentRound,
        fromLocation,
        toLocation,
        transportType,
      }
    });

    await prisma.player.update({
      where: { id: player.id },
      data: { location: toLocation }
    });

    res.json(move);
  } catch (error) {
    res.status(400).json({ error: 'Move failed' });
  }
};

module.exports = { createGame, joinGame, makeMove };