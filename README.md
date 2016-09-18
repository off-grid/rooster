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
