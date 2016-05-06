REM curl -vX GET  http://localhost:8111/status
REM curl -vX POST http://localhost:8111/query -d @test\query1.json --header "Content-Type: application/json"
curl -vX POST http://localhost:8111/query -d @test\query2.json --header "Content-Type: application/json"
REM curl -vX POST  http://localhost:8111/debug -d @test\query1.json --header "Content-Type: application/json"
