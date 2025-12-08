export class VehicleResponse {
  id: number;
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;

  constructor(data: any) {
    this.id = data.id;
    this.vehicle_name = data.vehicle_name;
    this.type = data.type;
    this.registration_number = data.registration_number;
    this.daily_rent_price = data.daily_rent_price;
    this.availability_status = data.availability_status;
  }
}
