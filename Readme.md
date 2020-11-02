Distributed logging example
===========================

Pre-requisites
--------------

* Docker
* Node.JS
* Dotnet


Logging back end (Seq)
----------------------

```pwsh
docker up
```

Client app
----------

```pwsh
cd client/weather-app
npm install
copy-item ../../lib/client/* ./node_modules/jsnlog/ -recurse -force -verbose
npm run start
```


Server app
----------

```pwsh
cd server/weather-api
dotnet restore
dotnet run
```


Result
------

See seq-logs.png and console-logs.png

The Seq logs can be correlated on TraceId.

In the console output, you will see the scope for the incoming web request to the 
forwarded log handler has it's own TraceId, which is overridden by the inner scope
for each log message. JSNLog can batch forwarded log messages, so one request may 
have multiple client logs, potentially from different traces.


