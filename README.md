# Tribe

a [Sails](http://sailsjs.org) application

Tested with node v0.12.7

```
npm install sails
sails lift
```

The models relationships in Tribe are:

```
User -*---*-> Tribe -1---*-> Topic -1---*-> Photo
```

To use mongoDB, make sure to comment localDiskDb and uncomment localMongodbServer at config/models.js

```
//connection: 'localDiskDb',
'connection': 'localMongodbServer'
```
