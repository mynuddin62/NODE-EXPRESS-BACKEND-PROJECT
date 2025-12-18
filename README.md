users

{
  "email": "super.admin@company.com",
  "password": "sadmin"
}

{
  "email": "admin@b6a2.com",
  "password": "admin#"
}

{
  "email": "cus@tom.er",
  "password": "cU$2m@R"
}

{
  "email": "c2@ena.com",
  "password": "123456"
}

{
  "email": "p.hero.2@hero.com",
  "password": "level2"
}

{
  "email": "com@com.com",
  "password": "kas2mr"
}



const startDate = new Date(existingBooking[0]!.rent_start_date);
    const today = new Date();

    console.log(startDate,'startdate');
    console.log(today, 'today');
    
    console.log(startDate >= today);
    
    
    
    today.setHours(0, 0, 0, 0)

    if (startDate >= today) {

      throw new CustomError("Rent start date is not before today",400, "INVALID_RENT_START_DATE");
    }