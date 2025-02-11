### Build Stage###
# Get Gradle for JDK17 and run it on Alpine Linux
FROM gradle:8-jdk17 as build

# Environment
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src src

# Build the application
RUN ./gradlew bootJar --no-daemon

# Production stage
FROM openjdk:17

# Production environment
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# Running the backend
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

