Spring 容器可以读取 .properties 配置文件，可以将文件中的信息注入给 bean

引入 druid 数据源，配置连接池信息，添加 pom 依赖

```xml
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid</artifactId>
  <version>1.1.24</version>
</dependency>

<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>8.0.33</version>
</dependency>
```



resources 目录下准备一个 jdbc.properties 配置文件，配置文件内容：

```properties
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mydb?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
username=root
password=123456
initialSize=1
```



spring 配置文件 read-config.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 读取 jdbc.properties 配置文件 -->
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${driverClassName}"></property>
        <property name="url" value="${url}"></property>
        <property name="username" value="${username}"></property>
        <property name="password" value="${password}"></property>
        <property name="initialSize" value="${initialSize}"></property>
    </bean>

</beans>
```

注意：在 xml 配置文件中新增了对命名空间 context 的引入：

- `xmlns:context="http://www.springframework.org/schema/context"`
- `http://www.springframework.org/schema/context`
- `http://www.springframework.org/schema/context/spring-context.xsd`



测试代码：

```java
package com.arc.spring.test;

import com.alibaba.druid.pool.DruidDataSource;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.sql.SQLException;

public class ReadConfigTest {

    @Test
    public void readConfigTest() throws SQLException {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("read-config.xml");
        DruidDataSource source = applicationContext.getBean("dataSource", DruidDataSource.class);
        System.out.println(source.getUrl());
        System.out.println(source.getDriverClassName());
        System.out.println(source.getUsername());
        System.out.println(source.getPassword());
        System.out.println(source.getInitialSize());
        System.out.println(source.getConnection());
        applicationContext.close();
    }

}
```



运行程序报错：

```
jdbc:mysql://localhost:3306/mydb?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
com.mysql.cj.jdbc.Driver
YangYunhe
123456
1
3月 07, 2026 9:20:24 下午 com.alibaba.druid.support.logging.JakartaCommonsLoggingImpl error
严重: init datasource error, url: jdbc:mysql://localhost:3306/mydb?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
java.sql.SQLException: Access denied for user 'YangYunhe'@'172.17.0.1' (using password: YES)
	at com.mysql.cj.jdbc.exceptions.SQLError.createSQLException(SQLError.java:130)
	at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:122)
	at com.mysql.cj.jdbc.ConnectionImpl.createNewIO(ConnectionImpl.java:825)
	at com.mysql.cj.jdbc.ConnectionImpl.<init>(ConnectionImpl.java:446)
	at com.mysql.cj.jdbc.ConnectionImpl.getInstance(ConnectionImpl.java:239)
	at com.mysql.cj.jdbc.NonRegisteringDriver.connect(NonRegisteringDriver.java:188)
	at com.alibaba.druid.pool.DruidAbstractDataSource.createPhysicalConnection(DruidAbstractDataSource.java:1644)
	at com.alibaba.druid.pool.DruidAbstractDataSource.createPhysicalConnection(DruidAbstractDataSource.java:1710)
	at com.alibaba.druid.pool.DruidDataSource.init(DruidDataSource.java:912)
	at com.alibaba.druid.pool.DruidDataSource.getConnection(DruidDataSource.java:1378)
	at com.alibaba.druid.pool.DruidDataSource.getConnection(DruidDataSource.java:1374)
	at com.arc.spring.test.ReadConfigTest.readConfigTest(ReadConfigTest.java:20)
	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:59)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:56)
	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
	at org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)
	at org.junit.runners.BlockJUnit4ClassRunner$1.evaluate(BlockJUnit4ClassRunner.java:100)
	at org.junit.runners.ParentRunner.runLeaf(ParentRunner.java:366)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:103)
	at org.junit.runners.BlockJUnit4ClassRunner.runChild(BlockJUnit4ClassRunner.java:63)
	at org.junit.runners.ParentRunner$4.run(ParentRunner.java:331)
	at org.junit.runners.ParentRunner$1.schedule(ParentRunner.java:79)
	at org.junit.runners.ParentRunner.runChildren(ParentRunner.java:329)
	at org.junit.runners.ParentRunner.access$100(ParentRunner.java:66)
	at org.junit.runners.ParentRunner$2.evaluate(ParentRunner.java:293)
	at org.junit.runners.ParentRunner$3.evaluate(ParentRunner.java:306)
	at org.junit.runners.ParentRunner.run(ParentRunner.java:413)
	at org.junit.runner.JUnitCore.run(JUnitCore.java:137)
	at com.intellij.junit4.JUnit4IdeaTestRunner.startRunnerWithArgs(JUnit4IdeaTestRunner.java:69)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater$1.execute(IdeaTestRunner.java:38)
	at com.intellij.rt.execution.junit.TestsRepeater.repeat(TestsRepeater.java:11)
	at com.intellij.rt.junit.IdeaTestRunner$Repeater.startRunnerWithArgs(IdeaTestRunner.java:35)
	at com.intellij.rt.junit.JUnitStarter.prepareStreamsAndStart(JUnitStarter.java:237)
	at com.intellij.rt.junit.JUnitStarter.main(JUnitStarter.java:58)
```



Spring 确实读取了  jdbc.properties 中的配置，但是 username = root，测试代码输出却是 YangYunhe，这是因为 Spring 内置了 username 这个属性，默认是当前的系统用户，为了避免这个问题，jdbc.properties 中 username 这个 key 要修改一下，比如修改为 jdbc_username：

```properties
jdbc_username=root
```

而 read-config.xml 中修改为：

```XML
<property name="username" value="${jdbc_username}"></property>
```



再次运行测试代码，输出结果：

```
jdbc:mysql://localhost:3306/mydb?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
com.mysql.cj.jdbc.Driver
root
123456
1
com.mysql.cj.jdbc.ConnectionImpl@165b2f7f
```

