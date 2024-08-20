# Stage 1: Build the Vite application
FROM node:21 as build

RUN mkdir /funil_vendas

# Create and set the working directory
WORKDIR /funil_vendas

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json /funil_vendas/

ENV VITE_ENV_NAME=prd

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . /funil_vendas

# Build the Vite application
RUN npm run build

# Stage 2: Serve the built files with NGINX
FROM nginx:latest

# Copy the built files from the build stage to NGINX web root
COPY --from=build /funil_vendas/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports (if needed)
EXPOSE 8007


# NGINX should automatically start, so no need for CMD
#comentario pra commitar denovo