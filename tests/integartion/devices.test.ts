import request from 'supertest';
import app from '../../src/app';

describe('Devices API - Create (POST)', () => {
  it('should create a new device with valid data', async () => {
    const res = await request(app).post('/api/devices').send({
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      state: 'available',
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Device created successfully');
    expect(res.body.data).toMatchObject({
      name: 'iPhone 15 Pro Max',
      brand: 'Apple',
      state: 'available',
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/devices').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toHaveProperty('name');
    expect(res.body.errors).toHaveProperty('brand');
  });

  it('should return 400 if state is invalid', async () => {
    const res = await request(app).post('/api/devices').send({
      name: 'Pixel 8',
      brand: 'Google',
      state: 'broken',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toHaveProperty('state');
  });
});

describe('Devices API - Find & Search (GET)', () => {
  let createdId: string;

  beforeAll(async () => {
    const res1 = await request(app).post('/api/devices').send({
      name: 'Galaxy S24',
      brand: 'Samsung',
      state: 'available',
    });

    createdId = res1.body.data.id;
  });

  it('should list all devices', async () => {
    const response = await request(app).get('/api/devices');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.message).toBe('Devices retrieved successfully');
  });

  it('should retrieve a device by ID', async () => {
    const response = await request(app).get(`/api/devices/${createdId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.id).toBe(createdId);
  });

  it('should return 404 for non-existent device', async () => {
    const response = await request(app).get('/api/devices/non-existent-id');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Device not found');
  });

  it('should filter devices by brand', async () => {
    const response = await request(app).get('/api/devices?brand=Apple');

    expect(response.status).toBe(200);
    expect(response.body.data.every((d: any) => d.brand === 'Apple')).toBe(
      true
    );
  });

  it('should filter devices by state', async () => {
    const response = await request(app).get('/api/devices?state=available');

    expect(response.status).toBe(200);
    expect(response.body.data.every((d: any) => d.state === 'available')).toBe(
      true
    );
  });

  it('should return 400 for invalid query param', async () => {
    const response = await request(app).get('/api/devices?state=wrong-value');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid query parameters');
  });
});

describe('Devices API - Update (PUT & PATCH)', () => {
  let deviceId: string;

  beforeEach(async () => {
    const res = await request(app).post('/api/devices').send({
      name: 'Pixel 8',
      brand: 'Google',
    });

    deviceId = res.body.data.id;
  });

  it('should update a device with PUT', async () => {
    const res = await request(app).put(`/api/devices/${deviceId}`).send({
      name: 'Galaxy S24 Ultra',
      brand: 'Samsung',
      state: 'in-use',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Galaxy S24 Ultra');
  });

  it('should partially update a device with PATCH', async () => {
    const res = await request(app).patch(`/api/devices/${deviceId}`).send({
      state: 'inactive',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.state).toBe('inactive');
  });

  it('should delete a device successfully', async () => {
    await request(app).patch(`/api/devices/${deviceId}`).send({
      state: 'available',
    });

    const res = await request(app).delete(`/api/devices/${deviceId}`);
    expect(res.status).toBe(204);
  });

  it('should return 400 when updating creationTime', async () => {
    const res = await request(app).put(`/api/devices/${deviceId}`).send({
      name: 'Same Name',
      brand: 'Same Brand',
      state: 'available',
      creationTime: new Date().toISOString(),
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('creationTime');
  });

  it('should not allow PATCHing name while device is in use', async () => {
    await request(app)
      .patch(`/api/devices/${deviceId}`)
      .send({ state: 'in-use' });

    const res = await request(app).patch(`/api/devices/${deviceId}`).send({
      name: 'NewName',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      'Cannot update name or brand while device is in use'
    );
  });

  it('should not allow PATCHing brand while device is in use', async () => {
    await request(app)
      .patch(`/api/devices/${deviceId}`)
      .send({ state: 'in-use' });

    const res = await request(app).patch(`/api/devices/${deviceId}`).send({
      brand: 'NewBrand',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      'Cannot update name or brand while device is in use'
    );
  });

  it('should not allow PUTting name while device is in use', async () => {
    await request(app)
      .patch(`/api/devices/${deviceId}`)
      .send({ state: 'in-use' });

    const res = await request(app).put(`/api/devices/${deviceId}`).send({
      name: 'HackedName',
      brand: 'OriginalBrand',
      state: 'in-use',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      'Cannot update name or brand while device is in use'
    );
  });

  it('should not allow PUTting brand while device is in use', async () => {
    await request(app)
      .patch(`/api/devices/${deviceId}`)
      .send({ state: 'in-use' });

    const res = await request(app).put(`/api/devices/${deviceId}`).send({
      name: 'OriginalName',
      brand: 'HackedBrand',
      state: 'in-use',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      'Cannot update name or brand while device is in use'
    );
  });
});

describe('Devices API - Delete (DELETE)', () => {
  let deviceId: string;

  beforeEach(async () => {
    const res = await request(app).post('/api/devices').send({
      name: 'A312',
      brand: 'Nokia',
      state: 'available',
    });

    deviceId = res.body.data.id;
  });

  it('should delete a device that is not in use', async () => {
    const res = await request(app).delete(`/api/devices/${deviceId}`);
    expect(res.status).toBe(204);
  });

  it('should return 404 when deleting a non-existent device', async () => {
    const res = await request(app).delete('/api/devices/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Device not found');
  });

  it('should not allow deleting a device that is in use', async () => {
    await request(app).patch(`/api/devices/${deviceId}`).send({
      state: 'in-use',
    });

    const res = await request(app).delete(`/api/devices/${deviceId}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cannot delete device in use');
  });
});
