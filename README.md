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

### User

At the moment users need to be created through the signup process at http://localhost:1337/register

### Tribes

Tribes are collections of topics. Tribes have members, which can be associated with users.

#### Retrieve all tribes

* URL: http://localhost:1337/tribe
* METHOD: GET
* PARAMS: none

#### Retrieve one tribe

* URL: http://localhost:1337/tribe/:id
* METHOD: GET
* PARAMS: none

#### Create a tribe

* URL: http://localhost:1337/tribe
* METHOD: POST 
* PARAMS: name (string), description (string), members(int id of user member)

Example JSON payload:

```
{"name":"Founders", "description": "The first tribe", "members":7}
```

Note that this will not upload an image. you can use http://localhost:1337/tribe/upload to upload an image with that tribe. Add the parameter 'photo'. A testing form is available at http://localhost:1337/tribe/new

#### Update a tribe

* URL: http://localhost:1337/tribe/:id
* METHOD: PUT
* PARAMS: name (string), description (string), members(int id of user member), topics (int id of topics), image_url (string)

Example JSON payload:

```
{"name":"Founders", "description": "Modified tribe", "members":7}
```

#### Delete a tribe

* URL: http://localhost:1337/tribe/:id
* METHOD: DELETE
* PARAMS: none

### TOPICS

Topics are string "questions" or "goals" that belong to one or many tribes and have photos associated with them.

#### Retrieve all topics

* URL: http://localhost:1337/topic
* METHOD: GET
* PARAMS: none

#### Retrieve one topic

* URL: http://localhost:1337/topic/:id
* METHOD: GET
* PARAMS: none

#### Create a topic

* URL: http://localhost:1337/topic
* METHOD: POST
* PARAMS: description (string), tribes (int id of tribe it belongs to)

Example JSON payload:

```
{"description": "Best time of the year", "tribes":7}
```

#### Update a topic

* URL: http://localhost:1337/topic/:id
* METHOD: PUT
* PARAMS: description (string), tribes (int id of tribes)

Example JSON payload:

```
{"description": "Modified topic", "tribes":7}
```

#### Delete a topic

* URL:http://localhost:1337/topic/:id
* METHOD: DELETE
* PARAMS: none

### Photos

Photos are, what they say they are, photos. They have a description, votes. Each photo has an owner, associated with a user, and a topic they belong to.

#### Retrieve all photos

* URL: http://localhost:1337/photo
* METHOD: GET
* PARAMS: none

#### Retrieve one photo

* URL: http://localhost:1337/photo/:id
* METHOD: GET
* PARAMS: none

#### Create a photo

* URL: http://localhost:1337/photo
* METHOD: POST
* PARAMS: description (string), topic (int id of topic it belongs to), owner (int id of user), image_url (string)

Example JSON payload:

```
{"description": "My best friend", "topic":7}
```

Note that this will not upload an image. you can use http://localhost:1337/photo/upload to upload an image and create a new record. Add the parameter 'photo'. A testing form is available at http://localhost:1337/photo/new


#### Update a photo

* URLhttp://localhost:1337/photo/:id
* METHOD: PUT
* PARAMS: description (string)

Example JSON payload:

```
{"description": "Modified topic"}
```

#### Delete a photo

* URL: http://localhost:1337/photo/:id
* METHOD: DELETE
* PARAMS: none

#### Upvote a photo

A custom controller method exists to do this.

* URL: http://localhost:1337/photo/:id/upvote
* METHOD: POST
* PARAMS: none

No parameters are needed and users can upvote as many as they want, for now, like cookie clicker.
