bean 从创建到销毁经历的各个阶段以及每个阶段所调用的方法为：

1. 通过构造器创建 bean 实例（执行构造器方法）
2. 为 bean 属性赋值（执行 set 方法）
3. 初始化bean（调用 bean 的初始化方法，需要配置指定调用的方法）
4. bean 的获取（容器对象 getBean 方法）
5. 容器关闭销毁 bean（调用销毁方法，需要配置指定调用的方法）

测试代码如下：

```java
package com.arc.spring.bean;

public class User {

    private Integer userid;
    private String username;
    private String password;

    public void initUser() {
        System.out.println("第 3 步：User 初始化");
    }

    public void destroyUser() {
        System.out.println("第 5 步：User 销毁");
    }

    public User() {
        System.out.println("第 1 步：User 无参构造器");
    }

    public User(Integer userid, String username, String password) {
        System.out.println("第 1 步：User 全参构造器");
        this.userid = userid;
        this.username = username;
        this.password = password;
    }

    public void setUserid(Integer userid) {
        System.out.println("第 2 步：调用 setUserid()");
        this.userid = userid;
    }

    public void setPassword(String password) {
        System.out.println("第 2 步：调用 setPassword()");
        this.password = password;
    }

    public void setUsername(String username) {
        System.out.println("第 2 步：调用 setUsername()");
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

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="u1" class="com.arc.spring.bean.User" init-method="initUser" destroy-method="destroyUser">
        <property name="userid" value="1"/>
        <property name="username" value="Tom"/>
        <property name="password" value="Tom123"/>
    </bean>

</beans>
```

```java
package com.arc.spring.test;

import com.arc.spring.bean.User;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class LifecycleTest {

    @Test
    public void lifecycleTest() {

        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("lifecycle.xml");
        System.out.println("第 4 步：容器对象调用 getBean 方法获取对象");
        User u = applicationContext.getBean("u1", User.class);
        System.out.println(u);
        // applicationContext.close() 之前调用 bean 的销毁方法
        applicationContext.close();

        /*
         * ApplicationContext 接口中没有定义 close() 方法
         * 所以这里不能写为：
         * ApplicationContext applicationContext = new ClassPathXmlApplicationContext("lifecycle.xml");
         */
    }

}
```

输出：
```
第 2 步：调用 setUsername()
第 2 步：调用 setPassword()
第 3 步：User 初始化
第 4 步：容器对象调用 getBean 方法获取对象
User{userid=1, username='Tom', password='Tom123'}
第 5 步：User 销毁
```


可以配置一个后置处理器，在该类中实现两个方法，分别在 bean 初始化之前和初始化之后调用，加入后置处理器后，bean 的生命周期为：

1. 通过构造器创建 bean 实例（执行构造器方法）
2. 为 bean 属性赋值（执行 set 方法） 
3. 把 bean 实例传递给 bean 的后置处理器方法，在 bean 初始化之前调用 postProcessBeforeInitialization() 方法
4. 初始化bean（调用 bean 的初始化方法，需要配置指定调用的方法）
5. 把 bean 实例传递给 bean 的后置处理器方法，在 bean 初始化之前调用 postProcessAfterInitialization() 方法
6. bean 的获取（容器对象 getBean 方法）
7. 容器关闭销毁 bean（调用销毁方法，需要配置指定调用的方法）

BeanPostProcessor 接口作用：如果我们想在 Spring 容器中完成 bean 实例化、配置以及其他初始化方法前后要添加一些自定义的逻辑处理。就需要定义一个或多个 BeanPostProcessor 接口的实现类，然后注册到 Spring IoC 容器中。

- 接口中的两个方法 postProcessBeforeInitialization() 和 postProcessAfterInitialization() 都要将传入的 bean 返回，而不能返回null，如果返回的是 null 那么我们通过 getBean 方法将得不到目标；
- postProcessBeforeInitialization() 方法和 postProcessAfterInitialization() 方法默认实现是直接 return bean;
- ApplicationContext 会自动检测在配置文件中实现了 BeanPostProcessor 接口的所有 bean，并把它们注册为后置处理器，然后在容器创建 bean 的适当时候调用它，因此部署一个后置处理器同部署其他的 bean 并没有什么区别。而使用 BeanFactory 实现的时候，bean 后置处理器必须通过代码显式地去注册，在 loC 容器继承体系中的 ConfigurableBeanFactory 接口中定义了注册方法；

```java
package com.arc.spring.ioc.lifecycle;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

/**
 * 后置通知
 */
public class UserBeanPostProcessor implements BeanPostProcessor {

    /**
     * bean 初始化之前
     * 参数 Object bean 是要被后置通知处理的 bean
     * 参数 String beanName 是该 bean 的 id
     */
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("第 2.5 步：bean 初始化之前");
        return bean;
    }

    /**
     * bean 初始化之后
     */
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("第 3.5 步：bean 初始化之后");
        return bean;
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="u1" class="com.arc.spring.bean.User" init-method="initUser" destroy-method="destroyUser">
        <property name="userid" value="1"/>
        <property name="username" value="Tom"/>
        <property name="password" value="Tom123"/>
    </bean>

    <!-- 配置后置通知处理器 -->
    <bean class="com.arc.spring.ioc.lifecycle.UserBeanPostProcessor"/>

</beans>
```

运行测试代码后输出：
```
第 1 步：User 无参构造器
第 2 步：调用 setUserid()
第 2 步：调用 setUsername()
第 2 步：调用 setPassword()
第 2.5 步：bean 初始化之前
第 3 步：User 初始化
第 3.5 步：bean 初始化之后
第 4 步：容器对象调用 getBean 方法获取对象
User{userid=1, username='Tom', password='Tom123'}
第 5 步：User 销毁
```
