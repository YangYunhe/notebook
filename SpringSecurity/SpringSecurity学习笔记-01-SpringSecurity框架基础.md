# 1. 什么是 Spring Security

官网：https://spring.io/projects/spring-security

Spring Security 是一个功能强大且高度可定制的身份认证和访问控制框架。它是保护基于 Spring 的应用程序的事实上的标准。

Spring Security 是一个致力于为 Java 应用程序提供身份认证和授权的框架。像所有Spring项目一样，Spring Security 的真正强大之处在于它可以非常轻松地扩展来满足自定义需求；

作用：做**认证**和**授权**的；

- 认证：登录；

- 授权：权限管理，给用户颁发权限，有一些资源不能让用户看，只有有权限的人才能看，比如不同的用户被授权不同的权限后，登录同一套应用系统，能看到的菜单是不一样的。



# 2. Spring Security 快速上手

创建一个 Spring Boot 项目，关键依赖如下：

```xml
<properties>
    <java.version>17</java.version>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <spring-boot.version>3.5.16</spring-boot.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

写一个 Controller：

```java
package com.arc.springsecurity.controller;

import org.springframework.web.bind.annotation.*;

/**
 * @RestController 返回字符串或者 json
 * @Controller 跳转页面
 */
@RestController
public class BasicController {

    // http://127.0.0.1:8080/hello
    @RequestMapping("/hello")
    public String hello() {
        return "Hello Spring Security";
    }
}
```

启动服务，日志中有关键信息：

```
Using generated security password: c3652b5d-02be-4bb3-abb6-db06f0ab2668

This generated password is for development use only. Your security configuration must be updated before running your application in production.
```

访问：http://127.0.0.1:8080/hello

自动跳转到了一个登录页面。

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261104173533490-2119248402.png)

- 用户名：user
- 密码（日志中的密码）：c3652b5d-02be-4bb3-abb6-db06f0ab2668

点击“Sign in”，才能在页面上看到“Hello Spring Security”。

登录成功后，浏览器的 Cookie 中生成了一个 SessionID，后端服务与前端页面使用这个 SessionID 绑定，在本页面，以后访问 /hello 路径就无须登录了。

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261104172946120-1525204466.png)

项目中一旦添加了 spring security 的 jar 包依赖，那么所有的 Controller 接口路径访问时都会被 Spring Security 拦截，它会检查你是否登录，如果未登录，就会跳转到它的一个默认登录页，登录成功后，才可以直接访问 Controller 的路径。

页面跳转规则是登录成功之后，跳转到登录前要访问的那个路径：

- 登录前访问 http://127.0.0.1:8080/hello -> 登录成功 -> 继续访问 http://127.0.0.1:8080/hello
- 登录前访问 http://127.0.0.1:8080/index -> 登录成功 -> 继续访问 http://127.0.0.1:8080/index

# 3. 基本原理分析

在未登录的情况下，访问 http://127.0.0.1:8080/hello，重定向到了 http://127.0.0.1:8080/login

Spring Security 使用 16 个 Filter 进行过滤拦截。

入口：org.springframework.security.web.FilterChainProxy

```
doFilter() -> doFilterInternal()

List<Filter> filters = getFilters(firewallRequest);
```

打个断点，以 Debug 模式重启服务。

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261104180705224-393283292.png)

访问 http://127.0.0.1:8080/hello 之后，在 IDEA 中观察：

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261104181025251-1368339235.png)

其中：

- org.springframework.security.web.authentication.ui.DefaultLoginPageGeneratingFilter：生成登录页面，登录的路径是 /login（Spring Security 框架提供）
- org.springframework.security.web.authentication.ui.DefaultLogoutPageGeneratingFilter：生成登出页面，登出的路径是 /logout（Spring Security 框架提供）

默认情况下，用户名是 user，密码是临时生成的 uuid。可以在 org.springframework.boot.autoconfigure.security.SecurityProperties 类中查看：

```java
public static class User {
	private String name = "user";
	private String password = UUID.randomUUID().toString();
    ...
}
```

# 4. 配置默认的用户名和密码

application.yml

```yaml
spring:
  security:
    user:
      name: my_user
      password: 123456
```

重启服务后可以使用此用户和密码登录。