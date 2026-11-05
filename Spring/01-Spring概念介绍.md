# 1. 简介

Spring 框架是由于软件开发的复杂性而创建的。Spring 使用的是基本的 JavaBean 来完成以前只可能由 EJB 完成的事情。然而，Spring 的用途不仅仅限于服务器端的开发。从简单性、可测试性和松耦合性角度而言，绝大部分 Java 应用都可以从 Spring 中受益。

- 目的：解决企业应用开发的复杂性
- 功能：使用基本的 JavaBean 代替 EJB，并提供了更多的企业应用功能
- 范围：任何 Java 应用

Spring 是一个轻量级控制反转（IOC）和面向切面（AOP）的容器框架。
Spring 是分层的全栈式的轻量级开发框架，以 IOC 和 AOP 为核心，官网是 https://spring.io

# 2. 版本

Spring 版本情况：https://spring.io/projects/spring-framework#learn

- SNAPSHOT：快照版
  - 该版本仍在开发或测试中；
  - 随时可能被替换或更新；
  - 不建议用于生产环境；

- PRE（Pre-release）预发布版
  - 该版本是正式发布（GA）之前的一个候选版本，用于最后阶段的测试和验证；

- GA（General Availability）正式发布版
  - 经过完整测试、验证和质量保证；  
  - 可用于生产环境；  

# 3. 优势

1. 方便解耦，简化开发

Spring 通过容器，将对象的创建从代码中剥离出来，交给 Spring 控制，避免直接编码造成模块之间的耦合度高，用户也不必自己编码处理对象的单例和多例控制，主要关注接口功能即可，不用关注具体使用哪个实现类和实现细节问题；

2. AOP 切面编程

AOP 切面编程是程序设计的一种概念，Spring 对该概念实现的比较好，通过切面编程我们可以在不修改原有代码的情况下实现功能的增加，通常用于事务控制、日志记录、性能检测、权限控制等等；

3. 声明式事务

事务的控制可以托管给 Spring，我们通过注解或者配置文件声明事务的处理方式即可，不用去编码处理；

4. 整合 JUNIT，方便测试

Spring 整合 JUNIT 单元测试，对于项目的功能都可以进行轻松快速的测试，便于调试程序；

5. 方便整合各种优秀的框架

SSM = Spring+SpringMVC+MyBatis
SSH = Spring+Hibernate+Strust
各种其他框架；

6. 丰富的功能封装

Spring 对 JavaEE（JDBC、JavaMail）都进行了一系列的封装，简化对于 API 的使用，提高程序的开发效率；

7. 规范的源码学习样本

Spring 的源码设计巧妙，结构清晰，大量使用了设计模式，是 Java 代码规范编写的典范，也是高级程序员面试中经常会问到的源码；

# 4. 体系结构

https://docs.spring.io/spring-framework/docs/4.3.30.RELEASE/spring-framework-reference/html/images/spring-overview.png

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260307170905344-2099067473.png)


1. Data Access/lntegration（数据访问/集成）

数据访问/集成层包括 JDBC、ORM、OXM、JMS 和 Transactions 模块，具体介绍如下：

- JDBC 模块：提供了一个 JDBC 的抽象层，大幅度减少了在开发过程中对数据库操作的编码；
- ORM 模块：对流行的对象关系映射 API，包括 JPA、JDO、Hibernate 和 iBatis 提供了的集成层；
- OXM 模块：提供了一个支持对象/XML 映射的抽象层实现，如 JAXB、Castor、XMLBeans、JiBX 和 XStream；
- JMS 模块：指 Java 消息服务，包含的功能为生产和消费的信息；
- Transactions 事务模块：支持编程和声明式事务管理实现特殊接口类，并为所有的 POJO。

2. Web 模块

Spring 的 Web 层包括 Web、Servlet、Struts 和 Portlet 组件，具体介绍如下：

- Web 模块：提供了基本的 Web 开发集成特性，例如多文件上传功能、使用的 Servlet 监听器的 IoC 容器初始化以及 Web 应用上下文；
- Servlet 模块：包括 Spring 模型——视图——控制器（MVC）实现 Web 应用程序；
- Struts 模块：包含支持类内的 Spring 应用程序，集成了经典的 Struts Web 层；
- Portlet 模块：提供了在 Portlet 环境中使用 MVC实现，类似 Web-Servlet 模块的功能。

3. Core Container

Spring 的核心容器是其他模块建立的基础，由 Beans 模块、Core 核心模块、Context 上下文模块和 Expression Language 表达式语言模块组成，具体介绍如下：

- Beans 模块：提供了 BeanFactory，是工厂模式的经典实现，Spring 将管理对象称为 Bean；
- Core 核心模块：提供了 Spring 框架的基本组成部分，包括 IoC 和 DI 功能。
- Context 上下文模块：建立在核心和 Beans 模块的基础之上，它是访问定义和配置任何对象的媒介。Application Context 接口是上下文模块的焦点；
- Expression Language 模块：是运行时查询和操作对象图的强大的表达式语言。

4. 其他模块

Spring 的其他模块还有 AOP、Aspects、Instrumentation 以及 Test 模块，具体介绍如下：

- AOP 模块：提供了面向切面编程实现，允许定义方法拦截器和切入点，将代码按照功能进行分离，以降低耦合性；
- Aspects 模块：提供与 AspectJ 的集成，是一个功能强大且成熟的面向切面编程（AOP）框架；
- Instrumentation 模块：提供了类工县的支持和类加载器的实现，可以在特定的应用服务器中使用；
- Test 模块：支持 Spring 组件，使用 JUnit 或 TestNG 框架的测试。

