# Stage 1: Build the application using Maven and Java 17
# This stage is for compiling the Java code into a JAR file.
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy only the pom.xml to leverage Docker's layer caching.
# This downloads dependencies only when pom.xml changes.
COPY backend/soulcare/pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of your backend source code
COPY backend/soulcare/src ./src

# Package the application, skipping tests for a faster build
RUN mvn package -DskipTests

# Stage 2: Create the final, lightweight runtime image
FROM openjdk:17-jre-slim
WORKDIR /app

# Copy the built JAR file from the 'build' stage
COPY --from=build /app/target/soulcare-0.0.1-SNAPSHOT.jar app.jar

# The port your Spring Boot application runs on (default is 8080)
EXPOSE 8080

# The command to run your application
ENTRYPOINT ["java", "-jar", "app.jar"]