import { prisma } from '../infra/prisma';

interface CreateDeviceInput {
  name: string;
  brand: string;
  state: string;
}

interface UpdateDeviceInput {
  name?: string;
  brand?: string;
  state?: string;
}

export const DeviceRepository = {
  async create(data: CreateDeviceInput) {
    return prisma.device.create({ data });
  },

  async findAll(filter?: { brand?: string; state?: string }) {
    return prisma.device.findMany({
      where: {
        ...(filter?.brand && { brand: filter.brand }),
        ...(filter?.state && { state: filter.state }),
      },
      orderBy: { creationTime: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.device.findUnique({ where: { id } });
  },

  async update(id: string, data: UpdateDeviceInput) {
    return prisma.device.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.device.delete({ where: { id } });
  },
};
