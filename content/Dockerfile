# This image should be built with the parent directory as context
FROM public.ecr.aws/docker/library/node:20-bookworm-slim as builder

ARG NEXT_PUBLIC_CIVICUK_API_KEY

WORKDIR /app

COPY package.json yarn.lock ./
COPY common ./common
COPY toggles/webapp ./toggles/webapp
COPY config/tsconfig-base.json ./config/

WORKDIR content/webapp
COPY content/webapp/package.json ./
RUN yarn --frozen-lockfile && yarn cache clean

COPY content/webapp .

RUN yarn next build && \
    mkdir -p .next/standalone/.next && \
    ([ -d "public" ] && cp -r public/ .next/standalone/public || true) && \
    ([ -d ".next/static" ] && cp -r .next/static .next/standalone/.next/static || true) && \
    yarn cache clean

# Production stage
FROM public.ecr.aws/docker/library/node:20-bookworm-slim AS runner

WORKDIR /app

# Create user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs



# Copy only the standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/content/webapp/.next/standalone ./

USER nextjs

EXPOSE 3000
ENV PORT=3000
CMD ["node", "content/webapp/server.js"]
