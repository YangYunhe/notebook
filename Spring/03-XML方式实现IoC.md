# 1. bean 标签常用属性 id 和 class

```java
package com.arc.spring.entity;

public class User {

    private Integer userid;
    private String username;
    private String password;

    public User() {
        System.out.println("NoArgsConstructor");
    }

    public User(Integer userid, String username, String password) {
        System.out.println("AllArgConstructor");
        this.userid = userid;
        this.username = username;
        this.password = password;
    }

    public void setUserid(Integer userid) {
        System.out.println("setUserid");
        this.userid = userid;
    }

    public void setPassword(String password) {
        System.out.println("setPassword");
        this.password = password;
    }

    public void setUsername(String username) {
        System.out.println("setUsername");
        this.username = username;
    }

    @Override
    public String toString() {
        return "User{" +
                "userid=" + userid +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```


<bean>：定义 Spring 所管理的一个对象，在没有给对象属性赋值时，反射调用类的无参构造器；
<bean> 标签属性 id：此对象的唯一标识，不能重复，在通过类型获取 Bean （getBean(User.class)）的时候可以不设置；
<bean> 标签属性 class：此对象所属类的全限定名

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="user1" class="com.arc.spring.entity.User"/>

</beans>
```

```java
package com.arc.spring.test;

import com.arc.spring.entity.User;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class IocByXmlTest {

    @Test
    public void getBeanTest1() {
        // 1.初始化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("ioc-by-xml.xml");

        // 2.获取对象
        User user = (User) applicationContext.getBean("user1");
        System.out.println(user);
        
    }
}
```

测试代码输出：

```
NoArgsConstructor
User{userid=null, username='null', password='null'}
```
由于定义 user1 这个 bean 的时候，没有给对象的属性赋值，所以反射调用了类的无参构造器。

# 2. 获取对象的 3 种方法

```java
package com.arc.spring.test;

import com.arc.spring.entity.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class IocByXmlTest {

    ApplicationContext applicationContext;

    @Before
    public void getApplicationContext() {
        // 1.初始化容器
        applicationContext = new ClassPathXmlApplicationContext("ioc-by-xml.xml");
    }

    @Test
    public void getBeanTest1() {
        // 2.获取对象
        // 方法一：类型强转
        User user = (User) applicationContext.getBean("user1");
        System.out.println(user);
    }

    @Test
    public void getBeanTest2() {
        // 2.获取对象
        // 方法二：设置对象类型
        User user = applicationContext.getBean("user1", User.class);
        System.out.println(user);
    }

    @Test
    public void getBeanTest3() {
        // // 2.获取对象
        // 方法三：getBean() 方法不传 id，只传对象类型
        // 使用此方法获取对象，要求 Spring 管理的此类型对象只能有一个
        // 即如果在配置文件中定义了大于 1 个的 User 类型的 Bean，则此行代码就会报错：
        // org.springframework.beans.factory.NoUniqueBeanDefinitionException:
        // No qualifying bean of type 'com.arc.spring.entity.User' available: expected single matching bean but found 2: ...
        User user = applicationContext.getBean(User.class);
        System.out.println(user);
    }

}
```


# 3. bean 标签常用属性 lazy-init

```XML
<bean id="user1" class="com.arc.spring.entity.User"/>
<!--
    lazy-init="true"：用到对象的时候再创建
    lazy-init="false"：容器初始化时就创建（默认值）
-->
<bean id="user2" class="com.arc.spring.entity.User" lazy-init="true"/>
```

```JAVA
ApplicationContext applicationContext;

@Before
public void getApplicationContext() {
    // 容器初始化
    applicationContext = new ClassPathXmlApplicationContext("ioc-by-xml.xml");
}

@Test
public void lazyInitTest1() {
    // 未使用对象，由于 <bean id="user1" class="com.arc.spring.entity.User"/> 默认 lazy-init="false"
    // user1 对象还是会创建
}
```

运行 lazyInitTest1()，输出：
```
NoArgsConstructor
```

```JAVA
@Test
public void lazyInitTest2() {
    // 使用 user2 时，才会创建
    User user = applicationContext.getBean("user2", User.class);
}
```

运行 lazyInitTest2()，输出：
```
NoArgsConstructor
NoArgsConstructor
```

# 4. bean 标签常用属性 scope

```XML
<bean id="user1" class="com.arc.spring.entity.User"/>
<!--
  scope="prototype"：原型（多例）模式，多次获取 user3，每次都创建新的对象
  scope="singleton"：单例模式，多次获取 user3，每次都返回同一个对象
  单例 bean 在容器初始化时就会创建
  多例 bean 在使用的时候才会创建
-->
<bean id="user3" class="com.arc.spring.entity.User" scope="prototype"/>
```

```JAVA
@Test
public void scopeTest() {
    User user1 = applicationContext.getBean("user1", User.class);
    User user2 = applicationContext.getBean("user1", User.class);
    System.out.println(user1 == user2);
    User user3 = applicationContext.getBean("user3", User.class);
    User user4 = applicationContext.getBean("user3", User.class);
    System.out.println(user3 == user4);
}
```

输出：
```
NoArgsConstructor
true

NoArgsConstructor
NoArgsConstructor
false
```

总结：
scope 控制对象单例多例和使用范围：
- singleton 作用域（scope 默认值），Spring IoC 容器中只会存在一个共享的 bean 实例；
- prototype 作用域部署的 bean，每一次请求都会产生一个新的 bean 实例，相当与一个 new 的操作；
- request 表示该针对每一次 HTTP 请求都会产生一个新的 bean，同时该 bean 仅在当前 HTTP request 内有效；
- session 作用域表示针对每一次 HTTP 请求都会产生一个新的 bean，同时该 bean 仅在当前 HTTP session 内有效；
- global session 作用域类似于标准的 HTTP Session 作用域，不过它仅仅在基于 portlet 的 web 应用中才有意义。

