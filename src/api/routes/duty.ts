import util from 'util';
import express from 'express';
import { logger } from '../../express-bootstrap';
import * as duty from '../../domain/duty';
import { DutyNotFoundError } from '../../error/duty';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    logger.info(
      `Duty API was called to add new duty ${util.inspect(req.body)}`
    );

    const { name } = req.body;

    const result = await duty.addDuty(name);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    logger.info(`Duty API was called to get all duty`);
    const result = await duty.getDuties();

    if (!result.length) {
      throw new DutyNotFoundError('No duty found');
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    logger.info(`Duty API was called to get duty by id ${req.params.id}`);
    const result = await duty.getDutyById(req.params.id);

    if (!result) {
      throw new DutyNotFoundError(`Duty with id ${req.params.id} not found`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    logger.info(`Duty API was called to update duty by id ${req.params.id}`);
    const { id } = req.params;
    const { name, is_completed: isCompleted } = req.body;

    const result = await duty.updateDutyById(id, { name, isCompleted });

    if (!result) {
      res.status(404).end();
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res) => {
  logger.info(`Duty API was called to delete duty ${req.params.id}`);
  await duty.deleteDutyById(req.params.id);
  res.status(204).end();
});

export { router as dutyRouter };
