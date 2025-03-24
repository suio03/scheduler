# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .


# Build the Next.js app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]