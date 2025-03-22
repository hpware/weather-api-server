# Production stage
FROM oven/bun:1-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/dist ./dis
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/bun.lock* ./
RUN bun install --production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=productions
EXPOSE 3000
CMD ["bun", "./app/hardcoded"]