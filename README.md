# Tribe

Tribe is a [Sails](http://sailsjs.org) application, visit [http://sailsjs.org](http://sailsjs.org) for more info.

The application was tested with node v0.12.7 on the last commit.

To get started install sails

```
npm install sails
```

To start the application, from the Tribe directory, install the modules and run:

```
npm install
sails lift
```

The application will run with a local database. To use mongoDB, make sure to comment localDiskDb and uncomment localMongodbServer at config/models.js

```
//connection: 'localDiskDb',
'connection': 'localMongodbServer'
```


## FRONT-END

A very basic front end app has been created. I'm using mainly JQuery and accessing the API, so you can see how it's done. All you need to know is that:

* The controller lives in: api/controllers/AppController.js
* The views live in views/app

You only need to look at the files in the views directory. I tried to make it easier for you to understand what's going on. So I put the style and javascript dependencies in the files directly. This is BAD!!! as they will not be minimized and served correctly. However, this is easier to get started with:

* The layout file imports JQuery and has the minimal style applied. This is only as example
* Each view file has the corresponding JQuery code, please move it out.

Start the aplication with:

```
sails lift
```

and visit

http://localhost:1337/app

#### NOTE

You will notice that when you upload a file the front end will not find it. This is because the .tmp/public folder is re-built on a schedule, even when you upload a file it will not automatically be available. There's two ways to go at it: 1) use a proper Amazon S3 storage ([following this documentation](http://sailsjs.org/documentation/concepts/file-uploads/uploading-to-s-3)), update the urls on the front end and you're done. 2) you can hack (I really don't like this option) it so that it directly saves it to .tmp/public, however you need to configure grunt not to delete your files upon reload. For more info [see this stackoverflow question](http://stackoverflow.com/questions/32333698/i-can-not-see-the-image-i-just-uploaded-sails-js).



## TRIBE API

The API is straightfoward and you can learn more about it in [Sails Blueprint documentation](http://sailsjs.org/documentation/reference/blueprint-api#?blueprint-actions). Here documented are the ones you might be interested in knowing

Currently the API is locked down so that only session authorized users can access it. If you need to use an API point publicly replace the 'sessionAuth' strategy with the strategy 'bearerAuth' in 'config/policies.js'. Read more there.

To test your public (using bearerAuth) API you can use curl, bearerAuth expects a Bearer authorization header, for example this (use your Bearer token):

```
curl -i http://localhost:1337/user -H "Authorization: Bearer sGNhj+LuygTTS0wv9tLyvICJefbRI/t7xSLYBorL7sHvQsfCUKoHlnSGcP3JRWd"
```

### Data models

The models relationships in Tribe are:

```
User -*---*-> Tribe -1---*-> Topic -1---*-> Photo
```


### USERS

At the moment users need to be created through the signup process at http://localhost:1337/register

### TRIBES

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

### PHOTOS

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
