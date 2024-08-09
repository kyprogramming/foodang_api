<!-- GitHub API  -->

https://github.com/kyprogramming/foodang_api

<!-- postman to swagger converter -->

https://metamug.com/util/postman-to-swagger/

http://localhost:8000/swagger/docs/

<!-- find list of all package installed globally -->

npm list -g --depth=0

npm uninstall -g package_name

<!-- Kill PORT -->

netstat -ano | findstr :8000

taskkill /PID 10276 /F

<!-- API Best practice -->

https://chatgpt.com/c/c4ba4183-92bb-4c17-be9d-e1252b2838f0

<!-- Class Validators validation decorators -->

https://github.com/typestack/class-validator#validation-decorators

// "exec": "node --inspect=0.0.0.0:9229 -r ts-node/register src/server.ts"

<!-- docker layered file sample -->

#Build stage

FROM node:22.6.0-alpine AS build WORKDIR /src COPY package\*.json ./ RUN npm install COPY . . RUN npm run build

#Production stage

FROM node:22.6.0-alpine AS production WORKDIR /src COPY package\*.json ./ RUN npm ci COPY --from=build /src/dist /src/dist EXPOSE 5001 CMD [ "node", "dist/src/server.js" ]
