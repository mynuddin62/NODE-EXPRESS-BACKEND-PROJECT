import { VehicleResponse } from "../vehicle/vehicleResponse";

export class BookingResponse {
  id: number;
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
  vehicle?: VehicleResponse;

  constructor(data: any) {
    this.id = data.id;
    this.vehicle_name = data.vehicle_name;
    this.type = data.type;
    this.registration_number = data.registration_number;
    this.daily_rent_price = data.daily_rent_price;
    this.availability_status = data.availability_status;
    this.vehicle = data.vehicle
  }
}
