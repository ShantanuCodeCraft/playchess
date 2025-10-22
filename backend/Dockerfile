FROM node:20-alpine As build

WORKDIR /app

COPY package*.json .
RUN npm ci 

COPY . .

RUN npm run build

# < ---------------------------------- >

FROM node:20-alpine

WORKDIR /app

COPY package*.json .
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 8080

CMD ["sh", "-c", "npx prisma db push && node dist/app.js"]



