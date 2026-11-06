注解方式创建对象：



- @Component 放在类上，用于标记，告诉 Spring 当前类需要由容器实例化 bean 并放入容器中，该注解有三个子注解：
  - @Controller 用于实例化 Controller 层 bean
  - @Service 用于实例化 Service 层 bean
  - @Repository 用于实力化持久层 bean
- 当不确定是哪一层，就用 @Component
- 这几个注解互相混用也不会报错，但是不推荐
- 确保 spring-aop 被项目引入



Spring 配置文件 ioc-by-annotation.xml

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

    <!-- 添加注解扫描，扫描指定的包，将包中所有带注解的类实例化
        base-package 设置要扫描的包
        如果有多个包要扫描，可以使用逗号隔开 com.arc.spring.bean,com.arc.spring.service
        或者可以写上一层包路径 com.arc.spring
        可以通过注解指定 bean 的 id @Component("user1")
        如果不指定，默认 id 是类名首字母小写

        use-default-filters="true"（默认就是 true） 使用默认的扫描过滤器
        默认的扫描过滤器会识别 @Component、@Controller、@Service、@Repository 这 4 个注解
        
        假设只想识别 @Service 这个注解，则配置 use-default-filters="false"，并添加：
            <context:include-filter type="annotation" expression="org.springframework.stereotype.Service"/>

        假设要排除掉 @Service 这个注释，识别其他 3 个注解，则配置 use-default-filters="false"，并添加：
            <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Service"/>
    -->
    <context:component-scan base-package="com.arc.spring" use-default-filters="true">
        <!-- <context:include-filter type="annotation" expression="org.springframework.stereotype.Service"/> -->
        <!-- <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Service"/> -->
    </context:component-scan>

</beans>
```



实体类：

```java
package com.arc.spring.bean;

import org.springframework.stereotype.Component;

@Component
public class Apple {
}
```



```java
package com.arc.spring.controller;

import org.springframework.stereotype.Controller;

@Controller("ccc")
public class Controller1 {
}
```



```java
package com.arc.spring.dao;

import org.springframework.stereotype.Repository;

@Repository
public class Dao1 {
}
```



```java
package com.arc.spring.service;

import org.springframework.stereotype.Service;

@Service
public class Service1 {
}
```



测试类：

```java
package com.arc.spring.test;

import com.arc.spring.bean.Apple;
import com.arc.spring.controller.Controller1;
import com.arc.spring.dao.Dao1;
import com.arc.spring.service.Service1;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class IocByAnnotationTest {

    ApplicationContext applicationContext;

    @Before
    public void getApplicationContext() {
        applicationContext = new ClassPathXmlApplicationContext("ioc-by-annotation.xml");
    }

    @Test
    public void getBeanTest1() {
        Service1 s = (Service1) applicationContext.getBean("service1");
        Dao1 d = (Dao1) applicationContext.getBean("dao1");
        Controller1 c = (Controller1) applicationContext.getBean("ccc");
        Apple a = (Apple) applicationContext.getBean("apple");
        System.out.println(s);
        System.out.println(d);
        System.out.println(c);
        System.out.println(a);
    }

}

```



输出：

```
com.arc.spring.service.Service1@5ddeb7cb
com.arc.spring.dao.Dao1@70ed52de
com.arc.spring.controller.Controller1@496bc455
com.arc.spring.bean.Apple@59402b8f
```

