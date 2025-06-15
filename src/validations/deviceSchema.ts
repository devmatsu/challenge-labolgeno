import { z } from 'zod';

import { DeviceState } from '../domain/device';

export const createDeviceSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, { message: 'Name must not be empty' }),
  brand: z
    .string({ required_error: 'Brand is required' })
    .min(1, { message: 'Brand must not be empty' }),
  state: z
    .nativeEnum(DeviceState, {
      errorMap: () => ({
        message: 'State must be one of: available, in-use, inactive',
      }),
    })
    .optional(),
});

export const putDeviceSchema = createDeviceSchema.extend({
  state: z.nativeEnum(DeviceState, {
    errorMap: () => ({
      message: 'State must be one of: available, in-use, inactive',
    }),
  }),
  creationTime: z
    .never({ message: 'creationTime cannot be updated' })
    .optional(),
});

export const updateDeviceSchema = z
  .object({
    name: z.string().min(1, 'Name must not be empty').optional(),
    brand: z.string().min(1, 'Brand must not be empty').optional(),
    state: z
      .nativeEnum(DeviceState, {
        errorMap: () => ({
          message: 'State must be one of: available, in-use, inactive',
        }),
      })
      .optional(),
    creationTime: z
      .never({ message: 'creationTime cannot be updated' })
      .optional(),
  })
  .strict();

export const queryDeviceSchema = z.object({
  brand: z.string().optional(),
  state: z.nativeEnum(DeviceState).optional(),
});
