# syntax=docker/dockerfile:1.7

FROM maven:3.9.9-eclipse-temurin-21 AS dependencies
WORKDIR /workspace

COPY .mvn .mvn
COPY mvnw mvnw.cmd pom.xml ./
RUN chmod +x ./mvnw && ./mvnw -B -ntp dependency:go-offline

FROM dependencies AS development
COPY src src
EXPOSE 8080
CMD ["./mvnw", "-B", "spring-boot:run"]

FROM dependencies AS build
COPY src src
RUN ./mvnw -B -ntp -DskipTests package

FROM eclipse-temurin:21-jre-alpine AS production
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
COPY --from=build /workspace/target/*.jar /app/app.jar

USER app
EXPOSE 8080
ENV JAVA_OPTS=""
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 CMD wget -q -O /dev/null "http://127.0.0.1:${SERVER_PORT:-8080}/api/health/readiness" || exit 1
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
