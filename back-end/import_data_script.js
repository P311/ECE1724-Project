// This script is used to import data from CSV file into the database.
// CSV source: https://www.kaggle.com/datasets/jahaidulislam/car-specification-dataset-1945-2020

const fs = require("fs");
const { parse } = require("csv-parse");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const csvFilePath = "./car-dataset.csv";

// we just found out that the dataset description is different from the actual dataset.
// since we already implemented databse, here uses a transfer map to map our database
transfer_map = {
  make: "make",
  model: "model",
  year_from: "year",
  generation: "generation",
  capacity_cm3: "engine_size_cc",
  engine_type: "fuel_type",
  transmission: "transmission",
  drive_wheels: "drivetrain",
  body_type: "body_type",
  number_of_doors: "num_doors",
  country_of_origin: "country",
  city_fuel_per_100km_l: "mpg_city",
  highway_fuel_per_100km_l: "mpg_highway",
  engine_hp: "horsepower_hp",
  maximum_torque_n_m: "torque_ftlb",
  acceleration_0_100_km_h_s: "acceleration",
};

number_attrbutes = [
  "year",
  "engine_size_cc",
  "num_doors",
  "horsepower_hp",
  "torque_ftlb",
  "mpg_city",
  "mpg_highway",
  "acceleration",
];

// for simplicity, choose some well known makes only
// load from cars.com
availableMakes = [
  "",
  "acura",
  "alfa_romeo",
  "am_general",
  "aston_martin",
  "audi",
  "bentley",
  "bmw",
  "buick",
  "cadillac",
  "chevrolet",
  "chrysler",
  "daewoo",
  "daihatsu",
  "dodge",
  "eagle",
  "ferrari",
  "fiat",
  "fisker",
  "ford",
  "genesis",
  "geo",
  "gmc",
  "honda",
  "hummer",
  "hyundai",
  "ineos",
  "infiniti",
  "isuzu",
  "jaguar",
  "jeep",
  "karma",
  "kia",
  "lamborghini",
  "land_rover",
  "lexus",
  "lincoln",
  "lotus",
  "lucid",
  "maserati",
  "maybach",
  "mazda",
  "mclaren",
  "mercedes_benz",
  "mercury",
  "mini",
  "mitsubishi",
  "nissan",
  "oldsmobile",
  "panoz",
  "plymouth",
  "polestar",
  "pontiac",
  "porsche",
  "ram",
  "rivian",
  "rolls_royce",
  "saab",
  "saturn",
  "scion",
  "smart",
  "subaru",
  "suzuki",
  "tesla",
  "toyota",
  "vinfast",
  "volkswagen",
  "volvo",
];

async function loadCsv(csvFilePath) {
  const records = [];

  const parser = fs.createReadStream(csvFilePath).pipe(
    parse({
      columns: true, // Use first row as column names
      skip_empty_lines: true,
    }),
  );

  for await (const record of parser) {
    const processedRecord = Object.entries(record).reduce(
      (acc, [key, value]) => {
        // Convert empty strings to null
        key = key.toLowerCase();
        if (key in transfer_map) {
          key = transfer_map[key];
          if (value === "") {
            acc[key] = null;
          }
          // Convert numeric strings to numbers
          else if (number_attrbutes.includes(key)) {
            if (!isNaN(value) && value.trim() !== "") {
              acc[key] = Number.isInteger(value)
                ? parseInt(value, 10)
                : parseFloat(value);
            } else {
              acc[key] = null;
            }
          } else {
            acc[key] = value.trim().toLowerCase();
          }
        }
        return acc;
      },
      {},
    );
    records.push(processedRecord);
  }

  // we have more than 70k records in the dataset, and for a course project we don't need that much.
  console.log(`Total records: ${records.length}`);
  // for each (make, model, year) combination, we only keep one record for simplicity.
  // keep the one with most non-null values
  const uniqueRecords = {};
  const unique_countrys = new Set();
  const unique_makes = new Set();
  const unique_models = new Set();
  const unique_types = new Set();
  const unique_years = new Set();

  for (const record of records) {
    if (record.year < 2000) {
      // buy a car older than 2000? really?
      continue;
    }
    if (!availableMakes.includes(record.make)) {
      // we only care about some well known makes
      continue;
    }
    const key = `${record.make}-${record.model}-${record.year}`;
    if (!uniqueRecords[key]) {
      uniqueRecords[key] = record;
    } else {
      const currentNonNullCount = Object.values(uniqueRecords[key]).filter(
        (value) => value !== null,
      ).length;
      const newNonNullCount = Object.values(record).filter(
        (value) => value !== null,
      ).length;

      if (newNonNullCount > currentNonNullCount) {
        uniqueRecords[key] = record;
      }
    }
    unique_countrys.add(record.country);
    unique_makes.add(record.make);
    unique_models.add(record.model);
    unique_types.add(record.body_type);
    unique_years.add(record.year);
  }

  // Replace records with the filtered unique records
  const result = [];
  result.push(...Object.values(uniqueRecords));

  // For analysis purpose
  console.log(`Unique records: ${result.length}`);
  console.log(`Unique countries: ${unique_countrys.size}`);
  console.log(`Unique makes: ${unique_makes.size}`);
  console.log(`Unique models: ${unique_models.size}`);
  console.log(`Unique types: ${unique_types.size}`);
  console.log(`Unique years: ${unique_years.size}`);

  return result;
}

async function insertData(records) {
  await prisma.car.createMany({
    data: records,
  });
}

(async () => {
  const records = await loadCsv(csvFilePath);
  await insertData(records);
})();
