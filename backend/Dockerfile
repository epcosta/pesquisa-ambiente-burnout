FROM node:24-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx playwright install --with-deps chromium

COPY . .

EXPOSE 3500

CMD ["sh", "-c", "npx prisma generate && npm run dev"]