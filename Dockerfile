# Stage 1: Build Stage
FROM node:22 AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Stage 2: Production Stage
FROM node:22

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY --from=build /app/dist ./dist

RUN groupadd appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

CMD ["node", "dist/index.js"]
