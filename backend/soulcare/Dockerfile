# Stage 1: Build the application using Maven and Java 17
# This stage is for compiling the Java code into a JAR file.
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Since the build context is now 'backend/soulcare', the paths are relative to it.
# Copy the Maven wrapper and pom.xml to leverage Docker's layer caching.
COPY mvnw .
COPY .mvn ./.mvn
COPY pom.xml .

# Grant execute permission to the wrapper script to prevent "Permission Denied" error
RUN chmod +x ./mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of your backend source code
COPY src ./src

# Package the application, skipping tests for a faster build
RUN ./mvnw package -DskipTests

# Stage 2: Create the final, lightweight runtime image
FROM openjdk:17-jre-slim
WORKDIR /app

# Copy the built JAR file from the 'build' stage
COPY --from=build /app/target/soulcare-0.0.1-SNAPSHOT.jar app.jar

# The port your Spring Boot application runs on (default is 8080)
EXPOSE 8080

# The command to run your application
ENTRYPOINT ["java", "-jar", "app.jar"]