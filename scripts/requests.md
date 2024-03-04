curl -X POST http://localhost:7998/api/agents/newuser \
     -H "Content-Type: application/json" \
     -d '{"token": "<bearer token>", "user_id": "0e12a182-27e0-4339-98ad-4f70405f7c44"}'

curl -X POST http://localhost:7998/api/agents/message \
     -H "Content-Type: application/json" \
     -d '{"token": "<bearer token>", "senderId": "18322518-fded-400f-a83d-c40732d7c9df", "agentId": "00000000-0000-0000-0000-000000000000", "room_id": "628fc3ba-b8f5-4b98-9347-92fab4f2551e", "content": { "content": "Hello!", "action": "WAIT" } }'