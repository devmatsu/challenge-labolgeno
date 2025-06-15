import { putDeviceSchema } from '../../../src/validations/deviceSchema';

describe('putDeviceSchema', () => {
  it('should validate a valid payload', () => {
    const result = putDeviceSchema.safeParse({
      name: 'Galaxy S24',
      brand: 'Samsung',
      state: 'available',
    });

    expect(result.success).toBe(true);
  });

  it('should fail if name is missing', () => {
    const result = putDeviceSchema.safeParse({
      brand: 'Samsung',
      state: 'available',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('name');
    }
  });

  it('should fail if brand is missing', () => {
    const result = putDeviceSchema.safeParse({
      name: 'Galaxy S24',
      state: 'available',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('brand');
    }
  });

  it('should fail if state is invalid', () => {
    const result = putDeviceSchema.safeParse({
      name: 'Galaxy S24',
      brand: 'Samsung',
      state: 'broken',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('state');
    }
  });

  it('should fail if creationTime is present', () => {
    const result = putDeviceSchema.safeParse({
      name: 'Galaxy S24',
      brand: 'Samsung',
      creationTime: new Date(),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toHaveProperty('creationTime');
    }
  });
});
