# Use Node.js LTS (Long Term Support) as the base image
FROM node:20 AS builder

# Set working directory
WORKDIR /wtr-admin

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with increased memory allocation
# and use --no-optional to reduce node_modules size
RUN npm ci --no-optional

# Copy only necessary files for the build
COPY tsconfig*.json ./
COPY src/ ./src/

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Production stage
FROM node:20

# Set working directory
WORKDIR /wtr-admin

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy only the necessary files from the builder stage
COPY --from=builder /wtr-admin/dist ./dist
COPY --from=builder /wtr-admin/node_modules ./node_modules
COPY --from=builder /wtr-admin/package*.json ./

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/main"]