import { createDeviceSchema } from '../../../src/validations/deviceSchema';

describe('createDeviceSchema', () => {
  it('should pass with valid data', () => {
    const result = createDeviceSchema.safeParse({
      name: 'iPhone 13',
      brand: 'Apple',
      state: 'available',
    });

    expect(result.success).toBe(true);
  });

  it('should fail if name is missing', () => {
    const result = createDeviceSchema.safeParse({
      brand: 'Apple',
      state: 'available',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('name');
    }
  });

  it('should fail if state is invalid', () => {
    const result = createDeviceSchema.safeParse({
      name: 'Galaxy S21',
      brand: 'Samsung',
      state: 'broken',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('state');
    }
  });
});
