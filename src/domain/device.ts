export enum DeviceState {
  AVAILABLE = 'available',
  IN_USE = 'in-use',
  INACTIVE = 'inactive',
}

export interface Device {
  id: string;
  name: string;
  brand: string;
  state: DeviceState;
  creationTime: Date;
}
