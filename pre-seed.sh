#!/bin/sh
API="http://localhost:3000"

AUTHOR_ID=$(
  curl -s -X POST "$API/authors" \
    -H 'Content-Type: application/json' \
    -d '{"firstName":"Robert","lastName":"Martin","pictureUrl":"https://example.com/authors/uncle-bob.jpg"}' |
  jq -r '.id // ._id // empty'
)

[ -n "$AUTHOR_ID" ] || { echo "could not extract author id" >&2; exit 1; }
echo "line 12:"
curl -s -X POST "$API/authors" \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Joseph","lastName":"Fowler","pictureUrl":"https://example.com/authors/fowler.jpg"}' >/dev/null
echo "line 16:"
curl -s -X POST "$API/books" \
  -H 'Content-Type: application/json' \
  -d @- <<EOF | jq
{
  "title": "Clean Architecture",
  "yearPublished": 2017,
  "authorId": "$AUTHOR_ID",
  "pictureUrl": "https://example.com/books/clean-architecture.jpg",
  "description": "Notes"
}
EOF

echo "curl books output:"
curl -s "$API/books"   | jq
echo "curl authors output:"
curl -s "$API/authors" | jq

