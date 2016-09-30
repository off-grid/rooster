# Rooster - The Server-side to Client-side Messaging Service

## Installation:
### General setup

```
git clone < repo url >
cd < folder >
npm install // Fetches dependencies. Do not push dependencies to source control
nodemon server.js // Starts up localhost at port 3000
```

### Development Environment: Reverse Proxy

We will use ngrok as our reverse proxy to twilio. That way, there will be no need to deploy to a server to test the backend. Instead, we will deploy this reverse proxy to fetch content from localhost. The net benefit of this approach is that we can have the server running on localhost with `nodemon server.js` while still being able to reach it through a URL. Download [ngrok](https://ngrok.com/download)

```
cd < root dir of Rooster >
./ngrok http 3000
```

If everything works fine, you will receive a message similar to this:

```
Session Status                online
Version                       2.1.14
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://b262f500.ngrok.io -> localhost:3000
Forwarding                    https://b262f500.ngrok.io -> localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              18      0       0.00    0.00    0.00    121.52

HTTP Requests
-------------

GET /v1/users                  200 OK
```

To get access to `localhost:3000`, simply hit `http://b262f500.ngrok.io`. We will also point twilio-dev to this endpoint during development.

### Development Environment: MySQL
Install and setup MySQL. Rooster interacts with MySQL through an ORM. You can view the ORM configs in the configs folder. The configs expect to see a database called twiliodb. Initially, you won't have this DB. So go into the MySQL shell using `mysql -u root` and enter the following:

```
mysql> SHOW DATABASES; // Ensure twiliodb doesn't exist
mysql> CREATE DATABASE twiliodb; // Create it
mysql> exit;
```

## API:
### Subreddit
To request the json for a subreddit. Send the message **subreddit \<subreddit\>**

*eg: subreddit all, subreddit funny*

The response will look like this:
```
{"type":"reddit","children":[{"text":"Dick face pussy","score":396,"author":"Lucflip","time":1474379271,"num_children":6,"id":"d7u9byb","children":[]},{"text":"When around grannies and small children, he could be called Richard.","score":111,"author":"timesuck897","time":1474401657,"num_children":3,"id":"d7ugpml","children":[]},{"text":"If I had a cat with a Dick on their face all the time, I'd call them Sasha Grey. ","score":30,"author":"iznottatoomah","time":1474407216,"num_children":"0","id":"d7ujmu7","children":[]},{"text":"http://i.imgur.com/GhZ9w.jpg","score":147,"author":"sirJackHandy","time":1474380007,"num_children":3,"id":"d7u9mg8","children":[]},{"text":"I think nutcheeks fits, too!","score":40,"author":"-MadameOvaries-","time":1474376636,"num_children":1,"id":"d7u84k0","children":[]}]}
```

### Comments
To request the json for comments of a specific reddit thread. Send the message **comments \<subreddit of comment\> \<comment-id\>**

*eg: comments funny 53lu2x*

The response will look like this:
```
{"type":"reddit","children":[{"text":"","score":2624,"author":"DieMikrowelle","time":1474413836,"num_children":"","id":"d7uocg1","children":[]},{"text":"","score":3344,"author":"alphacentaurai","time":1474409725,"num_children":"","id":"d7ul9fd","children":[]},{"text":"","score":4024,"author":"The_Red_Paw","time":1474409266,"num_children":"","id":"d7uky9o","children":[]},{"text":"","score":8714,"author":"RingoStarrVevo","time":1474412370,"num_children":"","id":"d7un82v","children":[]},{"text":"","score":102,"author":"maurosQQ","time":1474412927,"num_children":"","id":"d7unn6c","children":[]}]}
```

**Comment ID can be retrieved from the id element of responses**


## Workflow:
### Adding Dependencies
The `--save` flag adds the dependency to the `package.json` file. Thats the file which is used to determine which packages to install during `npm install`.
```
npm install < name of package > --save
```

### Merging process
Rooster will follow a strict merging process since it contains critical communication code between client-side and backend. Get LGTM by Wasiur or Owen before merging code. New code should also have at least 80% test coverage. (Travis test integration coming soon)

### Testing code
All API endpoints will be tested thoroughly. Refer to testing directory.
