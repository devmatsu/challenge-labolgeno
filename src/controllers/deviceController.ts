import { Request, Response } from 'express';

import { DeviceRepository } from '../repositories/DeviceRepository';
import {
  createDeviceSchema,
  updateDeviceSchema,
  putDeviceSchema,
  queryDeviceSchema,
} from '../validations/deviceSchema';
import { formatZodError } from '../utils/formatZodError';
import { DeviceState } from '../domain/device';

export async function createDevice(req: Request, res: Response): Promise<void> {
  const parsed = createDeviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: formatZodError(parsed.error),
    });
    return;
  }

  const { name, brand, state = DeviceState.AVAILABLE } = parsed.data;

  const newDevice = await DeviceRepository.create({
    name,
    brand,
    state,
  });

  res.status(201).json({
    message: 'Device created successfully',
    data: newDevice,
  });
  return;
}

export async function getDevices(req: Request, res: Response): Promise<void> {
  const parsed = queryDeviceSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Invalid query parameters',
      errors: formatZodError(parsed.error),
    });
    return;
  }

  const { brand, state } = req.query;
  const devices = await DeviceRepository.findAll({
    brand: brand as string,
    state: state as DeviceState,
  });

  res.json({
    message: 'Devices retrieved successfully',
    data: devices,
  });
  return;
}

export async function getDeviceById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const device = await DeviceRepository.findById(id);

  if (!device) {
    res.status(404).json({
      message: 'Device not found',
    });
    return;
  }

  res.json({
    message: 'Device retrieved successfully',
    data: device,
  });
  return;
}

export async function updateDevice(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existingDevice = await DeviceRepository.findById(id);
  if (!existingDevice) {
    res.status(404).json({ message: 'Device not found' });
    return;
  }

  const parsed = putDeviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: formatZodError(parsed.error),
    });
    return;
  }

  const { name, brand, state } = parsed.data;
  const isDeviceInUse = existingDevice.state === DeviceState.IN_USE;
  const isNameOrBrandChanging =
    name !== existingDevice.name || brand !== existingDevice.brand;

  if (isDeviceInUse && isNameOrBrandChanging) {
    res.status(400).json({
      message: 'Cannot update name or brand while device is in use',
    });
    return;
  }

  const updatedDevice = await DeviceRepository.update(id, {
    name,
    brand,
    state,
  });

  res.json({
    message: 'Device updated successfully',
    data: updatedDevice,
  });
  return;
}

export async function partialUpdateDevice(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const existingDevice = await DeviceRepository.findById(id);
  if (!existingDevice) {
    res.status(404).json({ message: 'Device not found' });
    return;
  }

  const parsed = updateDeviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: formatZodError(parsed.error),
    });
    return;
  }

  const { name, brand, state } = parsed.data;
  const isDeviceInUse = existingDevice.state === DeviceState.IN_USE;
  const isNameOrBrandChanging =
    name !== existingDevice.name || brand !== existingDevice.brand;

  if (isDeviceInUse && isNameOrBrandChanging) {
    res.status(400).json({
      message: 'Cannot update name or brand while device is in use',
    });
    return;
  }

  const updatedDevice = await DeviceRepository.update(id, {
    name: name ?? existingDevice.name,
    brand: brand ?? existingDevice.brand,
    state: state ?? existingDevice.state,
  });

  res.json({
    message: 'Device updated successfully',
    data: updatedDevice,
  });
  return;
}

export async function deleteDevice(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const existingDevice = await DeviceRepository.findById(id);
  if (!existingDevice) {
    res.status(404).json({ message: 'Device not found' });
    return;
  }

  const isDeviceInUse = existingDevice.state === DeviceState.IN_USE;
  if (isDeviceInUse) {
    res.status(400).json({ message: 'Cannot delete device in use' });
    return;
  }

  await DeviceRepository.delete(id);

  res.status(204).send();
  return;
}
