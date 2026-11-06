# 1. SpringBoot 简介

## 1.1 互联网架构演变之路

- 第一代：单体架构（单一应用架构）——all in one，将一个应用中的所有服务都封装到一个应用中，无论什么系统，都将数据库，web 等各个功能模块放到一个可执行文件中。

- 第二代：面向服务的架构（SOA）是一个组件模型，它将应用程序的不同功能单元（称为服务）通过这些服务之间定义良好的接口和契约联系起来。接口是采用中立的方式进行定义的，它应该独立于实现服务的硬件平台、操作系统和编程语言。这使得构建在各种各样的系统中的服务可以以一种统一和通用的方式进行交互。

- 第三代：微服务架构是一种将单个应用程序作为一套小型服务开发的方法，每种应用程序都在自己的进程中运行，并与轻量级机制（通常是 HTTP 资源 API）进行通信。这些服务是围绕业务功能构建的，可以通过全自动部署机制独立部署。这些服务的集中管理最少，可以用不同的编程语言编写，并使用不同的数据存储技术。
  - 微服务剔除 SOA 中复杂的 ESB 企业服务总线，所有的业务智能逻辑在服务内部处理，使用 Http（Rest API）进行轻量化通讯
  
  - SOA 强调按水平架构划分为：前、后端、数据库、测试等，微服务强调按垂直架构划分，按业务能力划分，每个服务完成一种特定的功能，服务即产品。
  
  - SOA 将组件以 library 的方式和应用部署在同一个进程中运行，微服务则是各个服务独立运行。
  
  - 传统应用倾向于使用统一的技术平台来解决所有问题，微服务可以针对不同业务特征选择不同技术平台，去中心统一化，发挥各种技术平台的特长。
  
  - SOA 架构强调的是异构系统之间的通信和解耦合；（一种粗粒度、松耦合的服务架构）
  
  - 微服务架构强调的是系统按业务边界做细粒度的拆分和部署。
  
    
## 1.2 回顾 Spring

Spring 是为了解决企业级应用开发的复杂性而创建的，就是简化开发。

Spring 是 Java 企业版（Java Enterprise Edition，JEE，也称 J2EE）的轻量级代替品。无需开发重级的 Enterprise JavaBean（EJB），Spring 为企业级 Java 开发提供了一种相对简单的方法，通过依赖注入和面向切面编程，用简单的 Java 对象（Plain Old Java Object，POJO）实现了 EJB 的功能。

Spring 降低开发复杂性的 4 种关键策略：

1. 基于 pojo 的轻量级和最小倾入性编程
2. 通过 IoC，依赖注入和面向接口实现松耦合
3. 基于切面 AOP 和惯例进行声明式编程
4. 通过切面和模板减少样式代码

Spring 的缺点分析：

虽然 Spring 的组件代码是轻量级的，但它的配置却是重量级的。一开始，Spring 用 XML 配置，而且是很多 XML 配 置。Spring 2.5 引入了基于注解的组件扫描，这消除了大量针对应用程序自身组件的显式 XML 配置。Spring 3.0 引入 了基于 Java 的配置，这是一种类型安全的可重构配置方式，可以代替 XML。 所有这些配置都代表了开发时的损耗。因为在思考 Spring 特性配置和解决业务问题之间需要进行思维切换，所以编写配置挤占了编写应用程序逻辑的时间。和所有框架一样，Spring 实用，但与此同时它要求的回报也不少。 除此之外，项目的依赖管理也是一件耗时耗力的事情。在环境搭建时，需要分析要导入哪些库的坐标，而且还需要分析导入与之有依赖关系的其他库的坐标，一旦选错了依赖的版本，随之而来的不兼容问题就会严重阻碍项目的开发进度。 



## 1.3 Spring Boot 概念简介

Spring Boot 是 Spring 公司的一个顶级项目，和 Spring Framework 是一个级别的。

Spring Boot 实际上是利用 Spring Framework 4 自动配置特性完成。编写项目时不需要编写 xml 文件。发展到现在，Spring Boot 已经具有很很大的生态圈，各种主流技术已经都提供了 Spring Boot 的启动器。

什么是启动器？

Spring 框架在项目中作用是 Spring 整合各种其他技术，让其他技术使用更加方便。Spring Boot 的启动器实际上就是一个依赖。这个依赖中包含了整个这个技术的相关 jar 包，还包含了这个技术的自动配置，以前绝大多数 XML 配置都不需要配置了。当然了，启动器中自动配置无法实现所有内容的自动配置，在使用 Spring Boot 时还需要进行少量的配置（这个配置不是在 xml 中了，而是在properties 或 yml 中即可）。如果是 Spring 自己封装的启动器的 artifact id 名字满足：spring-boot-starter-xxxx，如果是第三方公司提供的启动器满足：xxxx-spring-boot-starter。以后每次使用 Spring Boot 整合其他技术时首先需要考虑导入启动器。



Spring Boot 优点：

- 为所有 Spring 开发者更快的入门，使用 Spring Boot 可以创建独立的 Spring 应用程序
- 开箱即用，提供各种默认配置和启动器（Starter）来简化项目配置，尽量的自动配置 Spring 和第三方库
- 内嵌式容器简化 web 项目，在 Spring Boot 中直接嵌入了 Tomcat、Jetty、Undertow 等 Web 容器，在使用 Spring Boot 做 Web 开发时不需要部署 WAR 文件
- 没有冗余代码生成和 xml  配置的要求，绝对没有代码生成，也不需要 XML 配置文件



Spring 全家桶：

- 构建一个个功能独立的微服务应用单元，可以使用 Spring Boot（Build Anything），可以帮我们快速构建一个应用
- 大型分布式网络服务的调用，这部分由 Spring Cloud（Coordinate Anything） 来完成，实现分布式
- 在分布式中间，进行流式数据计算、批处理，我们有 Spring Cloud Data Flow（Connect Everything）
- Spring 为我们想清楚了整个从开始构建应用到大型分布式应用全流程方案



Spring Boot 版本介绍：`https://spring.io/projects/spring-boot#learn`

- SNAPSHOT：快照版，即开发版。
- CURRENT：最新版，但是不一定是稳定版。
- GA：General Availability，正式发布的版本。



Spring Boot 的核心： 

- 起步依赖：起步依赖本质上是一个 Maven 项目对象模型（Project Object Model，POM），定义了对其他库的传递依赖，这些东西加在一起即支持某项功能。 简单的说，起步依赖就是将具备某种功能的坐标打包到一起，并提供一些默认的功能。
- 自动配置：Spring Boot 的自动配置是一个运行时（更准确地说，是应用程序启动时）的过程，考虑了众多因素，才决定 Spring 配置应该用哪个，不该用哪个。该过程是 Spring 自动完成的。 



SpringBoot 是由 Pivotal 团队提供的全新框架，其设计目的是用来简化 Spring 应用的初始搭建以及开发过程。“简化”要从如下两个方面来说：

- Spring 程序初始搭建过程
- Spring 程序的开发过程
	

SpringBoot 开发团队认为原始的 Spring 程序初始搭建的时候有些繁琐，这个过程是可以简化的，最基本的 Spring 程序至少有一个配置文件或配置类，用来描述 Spring 的配置信息，此外现在企业级开发使用 Spring 大部分情况下是做 web 开发，如果做 web 开发的话，还要在加载 web 环境时加载指定的Spring 配置，这是最基本的需求。这个过程可以简化。

SpringBoot 开发团队认为原始的 Spring 程序开发的过程也有些繁琐，这个过程仍然可以简化。开发过程无外乎使用什么技术，导入对应的 jar 包（或坐标）然后将这个技术的核心对象交给 Spring 容器管理，也就是配置成 Spring 容器管控的 bean 就可以了。



# 2. 创建 SpringBoot 项目

## 2.1 方法一：从普通的 Maven 工程创建

导入依赖：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.arc</groupId>
    <artifactId>SpringBoot</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.6</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.7.6</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

开发一个 Controller：

```java
package com.arc.springboot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class BasicController {

    @RequestMapping("/hello")
    @ResponseBody
    public String hello(@RequestParam(name = "name", defaultValue = "unknown user") String name) {
        return "Hello " + name;
    }

}
```

新建启动类：

```java
package com.arc.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

Application 类是 Spring Boot 的启动类，作用是启动 Spring Boot 项目，是基于 main方法来运行的。 注意：启动类在启动时会做注解扫描（@Controller、@Service、@Repository 等)，扫描位置为同包或者子包下的注解，所以启动类的位置应放于包的根下。

启动类与启动器区别： 

- 启动类表示项目的启动入口 

- 启动器表示 jar 包的坐标

必须在包中新建启动类，不能直接放入到 src/main/java 文件夹下， 在 com.arc.springboot 下新建自定义名称的类，命名为 XxxApplication。 

运行 Application 类的 main() 方法后，访问：`http://127.0.0.1:8080/hello?name=lisi`，页面输出：`Hello lisi`。



在实际开发中，可能会出现必须继承某个其他项目，如果 Spring Boot 用了继承就不能继承别的项目了。因为在 maven 中继承机会只有一次，上述继承的格式还可以切换成导入的形式进行：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.arc</groupId>
    <artifactId>SpringBoot</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.7.6</spring-boot.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
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

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```



## 2.2 方法二：使用官网的初始化工具

说明：现在已经无法使用这种方法创建 Spring Boot 2.x 和 3.x 版本的项目，官网现在打开后只能选择 4.x 版本。所以这一小节仅起一个记录的作用。

访问：`https://start.spring.io/`

![image](https://img2024.cnblogs.com/blog/3706506/202604/3706506-20260404114722130-1576270268.png)

![image](https://img2024.cnblogs.com/blog/3706506/202604/3706506-20260404114805753-376589438.png)

![image](https://img2024.cnblogs.com/blog/3706506/202604/3706506-20260404114937451-279937909.png)

点击`GENERATE`后，会下载到本地一个压缩包：`springboot.zip`，解压后使用 IDEA 打开就可以得到一个 Spring Boot 项目的基础框架。

## 2.3 方法三：IDEA + 阿里云 start 源

要求：电脑有网

版本：IntelliJ IDEA 2025.3.6.2

步骤：

1. 创建项目

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261106125405881-978085514.png)

输入：https://start.aliyun.com 后保存

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261106125504900-395133482.png)

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261106125813654-547688408.png)

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261106131625364-1814466463.png)

此处选择的 SpringBoot 的版本使用 2.7.6 版本，阿里云地址提供了一些 SpringBoot 工程版本给用户选择，提供的版本可能会变，先选一个，如有需要，创建项目后手工修改为其他版本即可。

删除无用文件以及调整目录结构之后：

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261106142212239-1186493793.png)

2. 查看 Controller

```java
/*
 * Copyright 2013-2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author <a href="mailto:chenxilzx1@gmail.com">theonefx</a>
 */
@Controller
public class BasicController {

    // http://127.0.0.1:8080/hello?name=lisi
    @RequestMapping("/hello")
    @ResponseBody
    public String hello(@RequestParam(name = "name", defaultValue = "unknown user") String name) {
        return "Hello " + name;
    }
}
```

3. 运行自动生成的 Application 类：DemoApplication

这个类功能很简单，就一句代码，运行程序就是运行的这个类。

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```

运行后，观察日志，可以看到这里启动了 Tomcat 服务器。

![image](https://img2024.cnblogs.com/blog/3706506/202611/3706506-20261106132046062-755453249.png)

4. 访问：http://127.0.0.1:8080/hello?name=lisi

页面输出：`Hello lisi`。

Application 类是 Spring Boot 的启动类，作用是启动 Spring Boot 项目，是基于 main方法来运行的。 注意：启动类在启动时会做注解扫描（@Controller、@Service、@Repository 等)，扫描位置为同包或者子包下的注解，所以启动类的位置应放于包的根下。

工程的 pom 文件如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.arc</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>demo</description>
    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.7.6</spring-boot.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
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

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
                <configuration>
                    <mainClass>com.example.demo.DemoApplication</mainClass>
                    <skip>true</skip>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>
```

配置中有两个信息需要关注，一个是 spring-boot-dependencies，当前工程的 jar 包依赖均来自于这里。考虑到项目还需要继承其他项目，所以阿里云的 starter 在创建工程时就使用了直接引入依赖的方式。

通过上面的制作，不难发现，SpringBoot 程序简直太好写了，几乎什么都没写，功能就有了，这也是 SpringBoot 技术为什么火爆的原因，和 Spirng 程序相比，SpringBoot 程序在开发的过程中各个层面均具有优势。

| **类配置文件**          | **Spring**   | **Spring Boot** |
| ----------------------- | ------------ | --------------- |
| pom 文件中的坐标        | **手工添加** | **勾选添加**    |
| web3.0 配置类           | **手工制作** | **无**          |
| Spring/SpringMVC 配置类 | **手工制作** | **无**          |
| 控制器                  | **手工制作** | **手工制作**    |

Spring Boot 的原则是<font color="#ff0000"><b>能少写就少写</b></font>，<font color="#ff0000"><b>能不写就不写</b></font>。

**总结**

- 开发 SpringBoot 程序可以根据向导进行联网快速制作
- SpringBoot 2.x 程序需要基于 JDK8 以上版本进行制作
- 运行 SpringBoot 程序通过运行 Application 程序入口进行



## 2.4 动态生成 banner

在 Spring Boot 项目启动时，会先打印一段 Logo：

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v2.7.6)
```

这个 LOGO 可以替换，在 resources 目录下创建 banner.txt 文件，访问：`https://www.bootschool.net/ascii`或`https://patorjk.com/software/taag/`

![image](https://img2024.cnblogs.com/blog/3706506/202604/3706506-20260404120102329-952694719.png)

点击 Copy 把生成的文本粘贴到 banner.txt 文件中，再次启动项目：

![image](https://img2024.cnblogs.com/blog/3706506/202604/3706506-20260404120224777-1593754290.png)



# 3. 总结

上述简化操作在 SpringBoot 中有专业的术语，也是 SpringBoot 程序的核心功能及优点：

- 起步依赖（简化依赖配置）
  - 依赖配置的书写简化就是靠起步依赖达成的
- 自动配置（简化常用工程相关配置）
  - 配置过于繁琐，使用自动配置就可以做响应的简化（虽然内部还是很复杂的）
- 辅助功能（内置服务器，……）
  - 除了上面的功能，其实 SpringBoot 程序还有其他的一些优势，比如内置 Tomcat 服务器

​	

下面结合入门程序来说说这些简化操作都在哪些方面进行体现的，一共分为 4 个方面：

- parent
- starter
- 引导类
- 内嵌 Tomcat



## 3.1 parent

SpringBoot 关注到开发者在进行开发时，往往对依赖版本的选择具有固定的搭配格式，并且这些依赖版本的选择还不能乱搭配。比如 A 组件的 2.0 版与 B 组件的 3.5 版可以合作在一起，但是和 B 组件的 3.7 版合并使用时就有冲突。其实很多开发者都一直想做一件事情，就是将各种各样的组件配合使用的常见依赖版本进行收集整理，制作出最合理的依赖版本配置方案，这样使用起来就方便多了。

SpringBoot 做了这个事情，它将所有的组件版本的常见使用方案都给开发者整理了出来，开发者使用时直接用它提供的版本方案，就不用担心冲突问题了，相当于 SpringBoot 做了无数个组件版本搭配的列表，这个组件搭配列表的名字叫做 parent。

parent 自身具有很多个版本，每个 parent 版本中包含有几百个其他组件的版本号，不同的 parent 间使用的各种组件的版本号有可能会发生变化。当开发者使用某些组件时，直接使用 SpringBoot 提供的 parent 就行了，由 parent 帮助开发者统一的进行各种组件的版本管理。

parent 仅帮开发者进行版本管理，不负责帮你导入坐标，说白了用什么还是由开发者自己定，只不过版本不需要开发者管理了。整体上来说，使用 parent 可以帮助开发者进行版本的统一管理。

项目中的 pom.xml 中继承了一个坐标：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.6</version>
</parent>
```

或者引入了这样一个依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>${spring-boot.version}</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

其实 parent 也是使用的 spring-boot-dependencies 这个依赖。

打开 spring-boot-dependencies 的 pom，其中定义了两组信息，第一组是各式各样的依赖版本号属性：

```xml
<properties>
  <activemq.version>5.16.5</activemq.version>
  <antlr2.version>2.7.7</antlr2.version>
  <appengine-sdk.version>1.9.98</appengine-sdk.version>
  <artemis.version>2.19.1</artemis.version>
  <aspectj.version>1.9.7</aspectj.version>
  <assertj.version>3.21.0</assertj.version>
  <atomikos.version>4.0.6</atomikos.version>
  ...
</properties>
```

第二组是各式各样的的依赖坐标信息，可以看出依赖坐标定义中没有具体的依赖版本号，而是引用了第一组信息中定义的依赖版本属性值。

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-amqp</artifactId>
      <version>${activemq.version}</version>
    </dependency>
	...
	<dependency>
      <groupId>org.apache.kafka</groupId>
      <artifactId>kafka_2.13</artifactId>
      <version>${kafka.version}</version>
    </dependency>
	...
	<dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>2.7.6</version>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-webflux</artifactId>
      <version>2.7.6</version>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-websocket</artifactId>
      <version>2.7.6</version>
    </dependency>
	...
  </dependencies>
</dependencyManagement>
```

上面的依赖坐标定义是出现在`<dependencyManagement>`标签中的，这是对引用坐标的依赖管理，并不是实际使用的坐标。因此当你的项目中继承了这组 parent 信息后，在不使用对应坐标的情况下，前面的这组定义是不会具体导入某个依赖的。

**总结**

1. 开发 SpringBoot 程序要继承 spring-boot-starter-parent
2. spring-boot-starter-parent 中定义了若干个依赖管理
3. 继承 parent 模块可以避免多个依赖使用相同组件时出现依赖版本冲突
4. 继承 parent 的形式也可以采用引入依赖的形式实现效果

## 3.2 starter

SpringBoot 关注到开发者在实际开发时，对于依赖坐标的使用往往都有一些固定的组合方式，比如使用 spring-webmvc 就一定要使用spring-web。每次都要固定搭配着写，非常繁琐，而且格式固定，没有任何技术含量。

SpringBoot 把所有的组件使用的固定搭配格式都给开发出来，开发者用某个组件，就不用一次写一堆依赖了，对于这样的固定组件搭配，SpringBoot 给它起了个名字叫做 starter。

starter 定义了使用某种组件时对于依赖的固定搭配格式，也是一种最佳解决方案，使用starter 可以帮助开发者减少依赖配置。

入门案例中的 web 功能就是使用这种方式添加依赖的。

- 项目中的 pom.xml 定义了使用 SpringMVC 组件，但是并没有写 SpringMVC 的坐标，而是添加了一个名字中包含 starter 的依赖

```XML
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

- 在 spring-boot-starter-web 中又定义了若干个具体依赖的坐标

```XML
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.7.6</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-json</artifactId>
    <version>2.7.6</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <version>2.7.6</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.3.24</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>5.3.24</version>
    <scope>compile</scope>
  </dependency>
</dependencies>
```

之前提到过开发 SpringMVC 程序需要导入 spring-webmvc 的坐标和 spring 整合 web 开发的坐标，就是上面这组坐标中的最后两个了。

但是我们发现除了这两个还有其他的，比如第二个，叫做 spring-boot-starter-json。看名称就知道，这个是与 json 有关的坐标了，但是看名字发现和最后两个又不太一样，它的名字中也有 starter，点进入看：

```XML
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.7.6</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.3.24</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.4.2</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jdk8</artifactId>
    <version>2.13.4</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
    <version>2.13.4</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>com.fasterxml.jackson.module</groupId>
    <artifactId>jackson-module-parameter-names</artifactId>
    <version>2.13.4</version>
    <scope>compile</scope>
  </dependency>
</dependencies>
```

可以发现，这个 starter 中又包含了若干个坐标，其实就是使用 SpringMVC 开发通常都会使用到 json，使用 json 又离不开这里面定义的这些坐标，SpringBoot 把我们开发中使用的东西能用到的都给提前做好了。这种机制可能导致过量导入的问题，你可以通过 maven 中的排除依赖剔除掉一部分。不想处理的话，随它吧。

所以使用 starter作用就是帮开发者快速配置依赖关系。以前写依赖 3 个坐标的，现在写导入一个就搞定了，就是加速依赖配置。

starter 与 parent 的区别：

- starter 是一个坐标中定了若干个坐标，以前写多个的，现在写一个，**是用来减少依赖配置的书写量的**
- parent 是定义了几百个依赖版本号，以前写依赖需要自己手工控制版本，现在由 SpringBoot 统一管理，这样就不存在版本冲突了，**是用来减少依赖冲突的**



实际开发应用方式：

- 实际开发中如果需要用什么组件，先去找有没有这个组件对应的 starter

  - 如果有对应的 starter，直接写 starter，而且无需指定版本，版本由 parent 提供
  - 如果没有对应的 starter，手写坐标即可

- 实际开发中如果发现坐标出现了冲突现象，确认你要使用的可行的版本号，使用手工书写的方式添加对应依赖，覆盖 SpringBoot 提供的配置管理。这种操作有风险，你引入新的版本组件，可能与其他组件有冲突。

  - 方式一：直接写坐标
  - 方式二：覆盖`<properties>`中定义的版本号，哪个冲突了改哪个

  ```XML
  <properties>
      <activemq.version>5.16.3</activemq.version>
      <aspectj.version>1.9.7</aspectj.version>
      <assertj.version>3.19.0</assertj.version>
      <commons-codec.version>1.15</commons-codec.version>
      <commons-dbcp2.version>2.8.0</commons-dbcp2.version>
      <commons-lang3.version>3.12.0</commons-lang3.version>
      <commons-pool.version>1.6</commons-pool.version>
      <commons-pool2.version>2.9.0</commons-pool2.version>
      <h2.version>1.4.200</h2.version>
      <hibernate.version>5.4.32.Final</hibernate.version>
      <hibernate-validator.version>6.2.0.Final</hibernate-validator.version>
      <httpclient.version>4.5.13</httpclient.version>
      <jackson-bom.version>2.12.4</jackson-bom.version>
      <javax-jms.version>2.0.1</javax-jms.version>
      <javax-json.version>1.1.4</javax-json.version>
      <javax-websocket.version>1.1</javax-websocket.version>
      <jetty-el.version>9.0.48</jetty-el.version>
      <junit.version>4.13.2</junit.version>
      ...
  </properties>
  ```



SpringBoot 官方给出了很多个 starter 的定义，名称都是如下格式：

```
spring-boot-starter-组件名
```

**总结**

1. 开发 SpringBoot 程序需要导入坐标时通常导入对应的 starter
2. 每个不同的 starter 根据功能不同，通常包含多个依赖坐标
3. 使用 starter 可以实现快速配置的效果，达到简化配置的目的



## 3.3 引导类

程序运行的入口就是 SpringBoot 工程创建时自带的那个带有 main 方法的类，运行这个类就可以启动 SpringBoot 工程。

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```

SpringBoot 本身是为了加速 Spring 程序的开发的，而 Spring 程序运行的基础是需要创建自己的 Spring 容器对象（IoC 容器）并将所有的对象交给 Spring 的容器管理，也就是一个一个的 Bean。当前这个类运行后就会产生一个 Spring 容器对象，并且可以将这个对象保存起来，通过容器对象直接操作 Bean。

```java
package com.example.demo;

import com.example.demo.controller.BasicController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext applicationContext = SpringApplication.run(DemoApplication.class, args);
        BasicController bean = applicationContext.getBean(BasicController.class);
        System.out.println(bean);
    }

}
```

通过上述操作不难看出，其实 SpringBoot 程序启动还是创建了一个 Spring 容器对象。这个类在 SpringBoot 程序中是所有功能的入口，称这个类为**引导类**。

作为一个引导类最典型的特征就是当前类上方声明了一个注解`@SpringBootApplication`

**总结**

1. SpringBoot 工程提供引导类用来启动程序
2. SpringBoot 工程启动后创建并初始化 Spring 容器

## 3.4 内嵌 Tomcat

内嵌 Tomcat 这个功能不属于程序的主体功能，可用可不用，于是 SpringBoot 将其定位成辅助功能。

**内嵌 Tomcat 定义位置**

点击 `spring-boot-starter-web`

```XML
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```



```XML
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.7.6</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-json</artifactId>
    <version>2.7.6</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <version>2.7.6</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.3.24</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>5.3.24</version>
    <scope>compile</scope>
  </dependency>
</dependencies>
```

点击 spring-boot-starter-tomcat

```XML
<dependencies>
  <dependency>
    <groupId>jakarta.annotation</groupId>
    <artifactId>jakarta.annotation-api</artifactId>
    <version>1.3.5</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-core</artifactId>
    <version>9.0.69</version>
    <scope>compile</scope>
    <exclusions>
      <exclusion>
        <artifactId>tomcat-annotations-api</artifactId>
        <groupId>org.apache.tomcat</groupId>
      </exclusion>
    </exclusions>
  </dependency>
  <dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-el</artifactId>
    <version>9.0.69</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-websocket</artifactId>
    <version>9.0.69</version>
    <scope>compile</scope>
    <exclusions>
      <exclusion>
        <artifactId>tomcat-annotations-api</artifactId>
        <groupId>org.apache.tomcat</groupId>
      </exclusion>
    </exclusions>
  </dependency>
</dependencies>
```

这里面有一个核心的坐标，tomcat-embed-core，就是这个依赖把 tomcat 功能引入到了 SpringBoot 程序中。

**内嵌 Tomcat 运行原理**

Tomcat 服务器是一款软件，而且是一款使用 java 语言开发的软件，tomcat 安装目录中有很多个 jar。

既然是 Java 语言开发，那么 Tomcat 也是使用一个对象去运行的。

如果是对象，那 Spring 容器是用来管理对象的，这个对象能不能交给 Spring 容器管理呢？答案是肯定的。是个对象都可以交给 Spring 容器管理，Tomcat 服务器运行其实是以对象的形式在 Spring 容器中运行的。

```XML
<dependencies>
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-core</artifactId>
        <version>9.0.69</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

既然是个对象，如果把这个对象从 Spring 容器中去掉是不是就没有 web 服务器的功能呢？是这样的，通过依赖排除可以去掉这个 web 服务器功能。

```XML
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
</dependencies>
```

上面对 web-starter 做了一个操作，使用 maven 的排除依赖去掉了使用 tomcat 的 starter。这时运行程序，启动后就直接停止了。

**更换内嵌 Tomcat**

根据 SpringBoot 的工作机制，用什么组件，加入对应依赖就行了。SpringBoot 提供了 3 款内置的服务器：

- tomcat（默认）：apache 出品，粉丝多，应用面广，负载了若干较重的组件

- jetty：更轻量级，负载性能远不及 tomcat

- undertow：负载性能勉强跑赢 tomcat


想用哪个，加个坐标就 OK。前提是把 tomcat 排除掉，因为 tomcat 是默认加载的。

```XML
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jetty</artifactId>
    </dependency>
</dependencies>
```

现在就已经成功把 tomcat 服务器替换成了 jetty 服务器。

**总结**

1. 内嵌 Tomcat 服务器是 SpringBoot 辅助功能之一
2. 内嵌 Tomcat 工作原理是将 Tomcat 服务器作为对象运行，并将该对象交给 Spring 容器管理
3. 变更内嵌服务器思想是去除现有服务器，添加全新的服务器

