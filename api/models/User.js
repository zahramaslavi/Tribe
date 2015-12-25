var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
    tribes: {
      collection: 'tribe',
      via:'members'
    },
    photos:{
      collection:'photo',
      via: 'owner'
    }
  }
};

module.exports = User;
