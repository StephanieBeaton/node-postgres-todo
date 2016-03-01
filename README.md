
// curl to insert rows
curl --data "text=test&complete=false" http://127.0.0.1:3000/api/v1/todos

curl --data "text=study express&complete=false" http://127.0.0.1:3000/api/v1/todos
curl --data "text=study bootstrap&complete=false" http://127.0.0.1:3000/api/v1/todos
curl --data "text=create website&complete=false" http://127.0.0.1:3000/api/v1/todos

// Read end point from browser
http://localhost:3000/api/v1/todos
