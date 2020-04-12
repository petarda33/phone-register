const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'toor',
    database: 'telephonebook'
  }
});

const readlineSync = require('readline-sync');
const {table} = require('table');


const tablename = 'numbers';
const numbers = {
  name: 'name',
  number: 'number'
};

const createTelephoneBook = async () => {
  await knex.schema.createTableIfNotExists(tablename, table => {
    table.string(numbers.name);
    table.string(numbers.number);
  });
};

const drawTable = async () => {
  const data = [
    [
      numbers.name,
      numbers.number
    ]
  ];
  const records = await knex(tablename).select();
  for (let record of records) {
    data.push([
      record.name,
      record.number
    ]);
  }
  console.log(table(data));
};


const search = async () => {
  let searchName = readlineSync.question('Name of the person: ')
  const data = [
    [
      numbers.name,
      numbers.number
    ]
  ];
  const records = await knex(tablename).select().where({name: searchName});
  for (let record of records) {
    data.push([
      record.name,
      record.number
    ]);
  }
  console.log(table(data));
};

const getNewNumbers = async () => {
  let newContact = readlineSync.question('Name: ');
  let newNumber = readlineSync.question('Phone number: ');
  await knex(tablename).insert({name: newContact, number: newNumber});
  drawTable();
};

const modify = async () => {
  let numberToChange = readlineSync.question('Number to change: ');
  let newNumber = readlineSync.question('New number: ');
  await knex(tablename).where({ number: numberToChange }).update ({ number: newNumber });
  drawTable();
};

const deleteNumber = async () => {
  let numberToDel = readlineSync.question('Number to delete: ');
  await knex(tablename).where({ number: numberToDel}).del();
  drawTable();
};

const options = ['Show numbers', 'search', 'add new', 'modify', 'delete number'];

const main = () => {
  createTelephoneBook();
  console.clear();
  let choice = readlineSync.keyInSelect(options, 'What would you like to do?');
switch (choice) {
  case 0:
    drawTable();
    break; 
  case 1:
    search();
    break;
  case 2:
    getNewNumbers();
    break;
  case 3:
    modify();
    break; 
  case 4:
    deleteNumber();
    break;
  default:
    process.exit(0);
}
};

main();