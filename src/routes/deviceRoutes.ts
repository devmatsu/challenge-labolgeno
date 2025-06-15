import { Router } from 'express';

import {
  createDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  partialUpdateDevice,
  deleteDevice,
} from '../controllers/deviceController';

const router = Router();

router.get('/devices', getDevices);
router.get('/devices/:id', getDeviceById);
router.post('/devices', createDevice);
router.put('/devices/:id', updateDevice);
router.patch('/devices/:id', partialUpdateDevice);
router.delete('/devices/:id', deleteDevice);

export default router;
