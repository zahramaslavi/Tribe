# Tribe

Tribe is a [Sails](http://sailsjs.org) application, visit [http://sailsjs.org](http://sailsjs.org) for more info.

The application was tested with node v0.12.7 on the last commit.

To get started install sails

```
npm install sails
```

To start the application run:

```
sails lift
```

The application will run with a local database. To use mongoDB, make sure to comment localDiskDb and uncomment localMongodbServer at config/models.js

```
//connection: 'localDiskDb',
'connection': 'localMongodbServer'
```

## Data models

The models relationships in Tribe are:

```
User -*---*-> Tribe -1---*-> Topic -1---*-> Photo
```

## API

The API is straightfoward and you can learn more about it in [Sails Blueprint documentation](http://sailsjs.org/documentation/reference/blueprint-api#?blueprint-actions). Here documented are the ones you might be interested in knowing

### Create new tribe

* POST http://localhost:1337/tribe
* PARAMS: name (string), description(string), members(int id of member)

```
{"name":"Founders", "description": "The first tribe", "members":7}
```

This is meant to be done through the app, via '/tribe/new' to upload an image with that tribe.

You can POST to '/tribe/upload' and add the parameter 'image_url' with multi-part data to upload an image and create a new tribe.

### Upload a photo

* POST http://localhost:1337/photo/upload

* PARAMS: description(string), owner(int id of owner) and topic (int id of topic)

This is meant to be done through the app, via '/photo/new'
