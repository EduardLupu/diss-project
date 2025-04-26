plugins {
	java
	id("org.springframework.boot") version "3.4.4"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "org.diss"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	dependencies {
		implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
		implementation("org.springframework.boot:spring-boot-starter-data-jpa")
		implementation("org.springframework.boot:spring-boot-starter-jdbc")
		implementation("org.springframework.boot:spring-boot-starter-web")
		implementation("org.springframework.boot:spring-boot-starter-mail")
		implementation("org.springframework.boot:spring-boot-starter-security")
		implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
		implementation("org.springframework.boot:spring-boot-starter-validation")

		implementation("io.jsonwebtoken:jjwt-api:0.11.5")
		runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
		runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

		implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
		implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.1.0")

		runtimeOnly("com.h2database:h2")
		runtimeOnly("org.postgresql:postgresql")

		compileOnly("org.projectlombok:lombok")
		annotationProcessor("org.projectlombok:lombok")

		testImplementation("org.springframework.boot:spring-boot-starter-test")
		testImplementation("org.springframework.security:spring-security-test")
		testImplementation("org.mockito:mockito-core:3.11.2")
		testImplementation("junit:junit:4.13.2")
		testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	}

}

tasks.withType<Test> {
	useJUnitPlatform()
}
