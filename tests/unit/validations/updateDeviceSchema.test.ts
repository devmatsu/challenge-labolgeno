import { updateDeviceSchema } from '../../../src/validations/deviceSchema';

describe('updateDeviceSchema', () => {
  it('should pass with partial fields', () => {
    const result = updateDeviceSchema.safeParse({
      state: 'inactive',
    });

    expect(result.success).toBe(true);
  });

  it('should fail with unknown field', () => {
    const result = updateDeviceSchema.safeParse({
      creationTime: '2024-01-01',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('creationTime');
    }
  });
});
