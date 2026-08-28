#!/bin/bash
queries=(
  "How many credits do I have?"
  "How many credits do I still need?"
  "Can I graduate next year?"
  "Am I on track to finish in 2027?"
  "What do I still need to graduate?"
  "What should I take next?"
  "What's the weather today?"
  "Hello"
  ""
)

for q in "${queries[@]}"; do
  echo "----------------------------------------"
  echo "Q: $q"
  curl -s -w "\nLATENCY: %{time_total}s\n" -X POST -H "Content-Type: application/json" -d "{\"question\":\"$q\"}" http://localhost:4174/api/chat
  echo ""
done
