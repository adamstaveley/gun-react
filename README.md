# Magic Link + GunDB showcase

Basic distributed login application w/ key generation.

Run nodes:
```
NODE=0 node server.js
NODE=1 node server.js
```

Run frontends:
```
PORT=3000 npx start
PORT=3001 npx start
```

When using the client on http://localhost:3001, change port to 8091 instead of 8081 in `./src/hooks/useNode.ts` so that
it connects to the correct node.
