import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Device } from '../domain/device';
import {
  createDeviceSchema,
  updateDeviceSchema,
  putDeviceSchema,
  queryDeviceSchema,
} from '../validations/deviceSchema';
import { formatZodError } from '../utils/formatZodError';
import { DeviceState } from '../domain/device';

const devices: Device[] = [];

export function createDevice(req: Request, res: Response): void {
  const parsed = createDeviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: formatZodError(parsed.error),
    });
    return;
  }

  const { name, brand, state = DeviceState.AVAILABLE } = parsed.data;

  const newDevice: Device = {
    id: uuidv4(),
    name,
    brand,
    state,
    creationTime: new Date(),
  };

  devices.push(newDevice);

  res.status(201).json({
    message: 'Device created successfully',
    data: newDevice,
  });
  return;
}

export function getDevices(req: Request, res: Response): void {
  const parsed = queryDeviceSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Invalid query parameters',
      errors: formatZodError(parsed.error),
    });
    return;
  }

  let result = devices;

  const { brand, state } = req.query;
  if (brand) {
    result = result.filter(
      (d) => d.brand.toLowerCase() === String(brand).toLowerCase()
    );
  }

  if (state) {
    result = result.filter((d) => d.state === state);
  }

  res.json({
    message: 'Devices retrieved successfully',
    data: result,
  });
  return;
}

export function getDeviceById(req: Request, res: Response): void {
  const device = devices.find((d) => d.id === req.params.id);

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

export function updateDevice(req: Request, res: Response): void {
  const index = devices.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
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
  const existing = devices[index];

  if (
    existing.state === DeviceState.IN_USE &&
    (name !== existing.name || brand !== existing.brand)
  ) {
    res
      .status(400)
      .json({ message: 'Cannot update name or brand while device is in use' });
    return;
  }

  const updatedDevice = {
    ...existing,
    name,
    brand,
    state,
  };

  devices[index] = updatedDevice;

  res.json({
    message: 'Device updated successfully',
    data: updatedDevice,
  });
  return;
}

export function partialUpdateDevice(req: Request, res: Response): void {
  const index = devices.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ message: 'Device not found' });
    return;
  }

  const parsed = updateDeviceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { name, brand, state } = parsed.data;
  const existing = devices[index];

  if (existing.state === DeviceState.IN_USE && (name || brand)) {
    res
      .status(400)
      .json({ message: 'Cannot update name or brand while device is in use' });
    return;
  }

  const updatedDevice = {
    ...existing,
    name: name ?? existing.name,
    brand: brand ?? existing.brand,
    state: state ?? existing.state,
  };

  devices[index] = updatedDevice;

  res.json({
    message: 'Device updated successfully',
    data: updatedDevice,
  });
  return;
}

export function deleteDevice(req: Request, res: Response): void {
  const index = devices.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ message: 'Device not found' });
    return;
  }

  const device = devices[index];
  if (device.state === DeviceState.IN_USE) {
    res.status(400).json({ message: 'Cannot delete device in use' });
    return;
  }

  devices.splice(index, 1);
  res.status(204).send();
  return;
}
