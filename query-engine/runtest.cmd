curl -vX GET  http://localhost:8111/status
curl -vX POST http://localhost:8111/query -d @query1.json --header "Content-Type: application/json"
curl -vX POST http://localhost:8111/query -d @query2.json --header "Content-Type: application/json"
curl -vX POST  http://localhost:8111/debug -d @query1.json --header "Content-Type: application/json"
