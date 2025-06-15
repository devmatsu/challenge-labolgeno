import { queryDeviceSchema } from '../../../src/validations/deviceSchema';

describe('queryDeviceSchema', () => {
  it('should pass with valid brand and state', () => {
    const result = queryDeviceSchema.safeParse({
      brand: 'Apple',
      state: 'available',
    });

    expect(result.success).toBe(true);
  });

  it('should fail with invalid state', () => {
    const result = queryDeviceSchema.safeParse({
      brand: 'Apple',
      state: 'broken',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('state');
    }
  });
});
