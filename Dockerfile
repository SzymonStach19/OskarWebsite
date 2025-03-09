FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/oskarsawicki-0.0.1-SNAPSHOT.jar oskarsawicki.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "oskarsawicki.jar"]


