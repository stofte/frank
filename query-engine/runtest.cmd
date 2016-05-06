curl -vX GET  http://localhost:8111/checkreadystatus
curl -vX POST http://localhost:8111/executequery -d @test\query1.json
curl -vX POST http://localhost:8111/executequery -d @test\query2.json
curl -vX POST http://localhost:8111/executequery -d @test\query3.json
curl -vX POST http://localhost:8111/executequery -d @test\query3.json
curl -vX GET http://localhost:8111/stopserver
