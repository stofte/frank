curl -vX GET  http://localhost:2000/checkreadystatus
curl -vX GET  http://localhost:2000/projects
curl -vX POST http://localhost:2000/updatebuffer -d @updatebuffer.json
curl -vX POST http://localhost:2000/autocomplete -d @autocomplete.json
