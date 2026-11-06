# 1. 工程准备

pom 依赖：

```XML
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context</artifactId>
  <version>${spring.version}</version>
</dependency>
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-aspects</artifactId>
  <version>${spring.version}</version>
</dependency>
<dependency>
  <groupId>aopalliance</groupId>
  <artifactId>aopalliance</artifactId>
  <version>1.0</version>
</dependency>
```



准备接口和实现类：

```java
package com.arc.spring.dao;

public interface OrderDao {
    int addOrder(String orderNo, Long userId, Double amount, Integer status, String createTime);
}
```



```java
package com.arc.spring.dao.impl;

import com.arc.spring.dao.OrderDao;
import org.springframework.stereotype.Repository;

@Repository
public class OrderDaoImpl implements OrderDao {
    @Override
    public int addOrder(String orderNo, Long userId, Double amount, Integer status, String createTime) {
        System.out.println("OrderDaoImpl.addOrder() orderNo=" + orderNo + ", userId=" + userId + ", amount=" + amount + ", status=" + status + ", createTime=" + createTime);
        return 1;
    }
}
```



```java
package com.arc.spring.dao;

public interface ProductDao {
    int addProduct(Long id, String name, Double price, Integer stock);
}
```



```java
package com.arc.spring.dao.impl;

import com.arc.spring.dao.ProductDao;
import org.springframework.stereotype.Repository;

@Repository
public class ProductDaoImpl implements ProductDao {
    @Override
    public int addProduct(Long id, String name, Double price, Integer stock) {
        System.out.println("ProductDaoImpl.addProduct() id=" + id + ", name=" + name + ", price=" + price + ", stock=" + stock);
        return 1;
    }
}
```

# 2. 切入点表达式

切入点表达式：通过一个表达式来确定 AOP 要增强的是哪个或者那些方法

语法结构：`execution([权限修饰符][返回值类型][类的全路径名][方法名](参数列表))`

例子：

- `execution(* com.arc.spring.dao.UserDaoImpl.add(..))` 指定切点为 com.arc.spring.dao.UserDaoImpl 的 add() 方法

- `execution(* com.arc.spring.dao.UserDaoImpl.*(..))` 指定切点为 com.arc.spring.dao.UserDaoImpl 的所有方法

- `execution(* com.arc.spring.dao.*.*(..))` 指定切点为 com.arc.spring.dao 包下的所有类的所有方法
- `execution(* com.arc.spring.dao.*.add(..))` 指定切点为 com.arc.spring.dao 包下的所有类的 add() 方法
- `execution(* com.arc.spring.dao.*.add*(..))` 指定切点为 com.arc.spring.dao 包下的所有类的方法名以 add 开头的所有方法

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260309215410167-1359566811.png)

# 3. 注解方法实现 AOP



## 3.1 前置通知

实现目标：在 ProductServiceImpl 对象调用 addProduct() 方法之前，调用方法 before()

Spring 配置文件 aop.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd">

    <context:component-scan base-package="com.arc.spring"/>

    <!-- AOP 自动生成代理对象 -->
    <aop:aspectj-autoproxy/>

</beans>
```



定义切面类，其中的方法用于增强其他方法：

```java
package com.arc.spring.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class DaoAspect {

    /**
     * 前置通知：切点方法执行之前先执行的功能
     * 参数列表中的 JoinPoint 代表切点（即实际要被增强的方法本身）
     * 可以获取切点运行时的实参
     */
    @Before("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void before(JoinPoint joinPoint) {
        // JoinPoint 就是要增强的方法，比如 addProduct()
        System.out.println("method before() invoked...");
        System.out.println(Arrays.toString(joinPoint.getArgs()));
    }

}
```



测试类：

```java
package com.arc.spring.test;

import com.arc.spring.dao.ProductDao;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class AopTest {

    ApplicationContext applicationContext;

    @Before
    public void getApplicationContext() {
        applicationContext = new ClassPathXmlApplicationContext("aop.xml");
    }

    @Test
    public void aopTest() {
        ProductDao productDao = applicationContext.getBean(ProductDao.class);
        System.out.println(productDao.getClass().getName());
        int rows = productDao.addProduct(1L, "手机", 3000.0, 500);
        System.out.println(rows);
    }

}
```



测试输出：

```
com.sun.proxy.$Proxy21
method before() invoked...
[1, 手机, 3000.0, 500]
ProductDaoImpl.addProduct() id=1, name=手机, price=3000.0, stock=500
1
```



注意到 productDao 对象输出的类名为 com.sun.proxy.$Proxy21，可见，执行 addProduct() 方法是一个代理对象，该对象代理的是 productDao 这个对象。

## 3.2 后置通知

```java
package com.arc.spring.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class DaoAspect {

    /**
     * 前置通知：切点方法执行之前先执行的功能
     * 参数列表中的 JoinPoint 代表切点（即实际要被增强的方法本身）
     * 可以获取切点运行时的实参
     */
    @Before("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void before(JoinPoint joinPoint) {
        // JoinPoint 就是要增强的方法，比如 addProduct()
        System.out.println("method before() invoked...");
        System.out.println(Arrays.toString(joinPoint.getArgs()));
    }

    /**
     * 后置（最终）通知：切点方法执行之后执行的功能（无论切点方法是否报错，都会执行此方法）
     */
    @After("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void after() {
        System.out.println("method after() invoked...");
    }

}
```



测试输出：

```
com.sun.proxy.$Proxy22
method before() invoked...
[1, 手机, 3000.0, 500]
ProductDaoImpl.addProduct() id=1, name=手机, price=3000.0, stock=500
method after() invoked...
1
```



## 3.3 返回后通知

```java
package com.arc.spring.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class DaoAspect {

    /**
     * 前置通知：切点方法执行之前先执行的功能
     * 参数列表中的 JoinPoint 代表切点（即实际要被增强的方法本身）
     * 可以获取切点运行时的实参
     */
    @Before("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void before(JoinPoint joinPoint) {
        // JoinPoint 就是要增强的方法，比如 addProduct()
        System.out.println("method before() invoked...");
        System.out.println(Arrays.toString(joinPoint.getArgs()));
    }

    /**
     * 后置（最终）通知：切点方法执行之后执行的功能（无论切点方法是否报错，都会执行此方法）
     */
    @After("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void after() {
        System.out.println("method after() invoked...");
    }

    /**
     * 当切点方法返回值之后执行的功能
     * 如果切点方法出现异常，则此方法不执行
     */
    @AfterReturning(value = "execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))", returning = "returnValue")
    public void afterReturning(Object returnValue) {
        System.out.println("method afterReturning() invoked, returnValue=" + returnValue);
    }

}
```

测试输出：

```
com.sun.proxy.$Proxy23
method before() invoked...
[1, 手机, 3000.0, 500]
ProductDaoImpl.addProduct() id=1, name=手机, price=3000.0, stock=500
method afterReturning() invoked, returnValue=1
method after() invoked...
1
```



## 3.4 异常通知

```java
package com.arc.spring.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class DaoAspect {

    /**
     * 前置通知：切点方法执行之前先执行的功能
     * 参数列表中的 JoinPoint 代表切点（即实际要被增强的方法本身）
     * 可以获取切点运行时的实参
     */
    @Before("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void before(JoinPoint joinPoint) {
        // JoinPoint 就是要增强的方法，比如 addProduct()
        System.out.println("method before() invoked...");
        System.out.println(Arrays.toString(joinPoint.getArgs()));
    }

    /**
     * 后置（最终）通知：切点方法执行之后执行的功能（无论切点方法是否报错，都会执行此方法）
     */
    @After("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void after() {
        System.out.println("method after() invoked...");
    }

    /**
     * 当切点方法返回值之后执行的功能
     * 如果切点方法出现异常，则此方法不执行
     */
    @AfterReturning(value = "execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))", returning = "returnValue")
    public void afterReturning(Object returnValue) {
        System.out.println("method afterReturning() invoked, returnValue=" + returnValue);
    }

    /**
     * 异常通知：切入方法出现异常就执行，不出现异常就不执行
     * 可以接收切点方法抛出的异常对象
     */
    @AfterThrowing(value = "execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))", throwing = "ex")
    public void afterThrowing(Exception ex) {
        System.out.println("method afterThrowing() invoked, ex=" + ex.getMessage());
    }

}
```



```java
package com.arc.spring.dao.impl;

import com.arc.spring.dao.ProductDao;
import org.springframework.stereotype.Repository;

@Repository
public class ProductDaoImpl implements ProductDao {
    @Override
    public int addProduct(Long id, String name, Double price, Integer stock) {
        System.out.println("ProductDaoImpl.addProduct() id=" + id + ", name=" + name + ", price=" + price + ", stock=" + stock);
        return 1/0;
    }
}
```



测试结果：

```
com.sun.proxy.$Proxy24
method before() invoked...
[1, 手机, 3000.0, 500]
ProductDaoImpl.addProduct() id=1, name=手机, price=3000.0, stock=500
method afterThrowing() invoked, ex=/ by zero
method after() invoked...
```

测试完成后记得把 return 1/0 修改成 return 1

## 3.5 环绕通知

```java
package com.arc.spring.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class DaoAspect {

    /**
     * 前置通知：切点方法执行之前先执行的功能
     * 参数列表中的 JoinPoint 代表切点（即实际要被增强的方法本身）
     * 可以获取切点运行时的实参
     */
    @Before("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void before(JoinPoint joinPoint) {
        // JoinPoint 就是要增强的方法，比如 addProduct()
        System.out.println("method before() invoked...");
        System.out.println(Arrays.toString(joinPoint.getArgs()));
    }

    /**
     * 后置（最终）通知：切点方法执行之后执行的功能（无论切点方法是否报错，都会执行此方法）
     */
    @After("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public void after() {
        System.out.println("method after() invoked...");
    }

    /**
     * 当切点方法返回值之后执行的功能
     * 如果切点方法出现异常，则此方法不执行
     */
    @AfterReturning(value = "execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))", returning = "returnValue")
    public void afterReturning(Object returnValue) {
        System.out.println("method afterReturning() invoked, returnValue=" + returnValue);
    }

    /**
     * 异常通知：切入方法出现异常就执行，不出现异常就不执行
     * 可以接收切点方法抛出的异常对象
     */
    @AfterThrowing(value = "execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))", throwing = "ex")
    public void afterThrowing(Exception ex) {
        System.out.println("method afterThrowing() invoked, ex=" + ex.getMessage());
    }

    /**
     * 环绕通知：在切点方法执行之前和执行之后都执行
     * 环绕通知的返回值必须是 Object，在环绕通知中必须将切点方法继续向上返回
     * @param joinPoint 切点方法，通过它手动控制切点方法执行的位置
     */
    @Around("execution(* com.arc.spring.dao.impl.ProductDaoImpl.addProduct(..))")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("method around1() invoked...");
        Object res = joinPoint.proceed();
        System.out.println("method around2() invoked...");
        return res;
    }

}
```

测试输出：

```
com.sun.proxy.$Proxy25
method around1() invoked...
method before() invoked...
[1, 手机, 3000.0, 500]
ProductDaoImpl.addProduct() id=1, name=手机, price=3000.0, stock=500
method afterReturning() invoked, returnValue=1
method after() invoked...
method around2() invoked...
1
```



## 3.6 切面类优化

在切面类中，有两个问题：

- 每个通知的切点表达式都一样，可以提取成公共切点；
- 切点表达式中类名写的实现类，写成接口能屏蔽实现类的变更，降低代码耦合性，可以修改为`execution(* com.arc.spring.dao.ProductDao.addProduct(..))`
- 如果需要对所有的 dao 包下的所有 add 操作都进行增强，切点表达式可以修改为`execution(* com.arc.spring.dao.*.add*(..))`

```java
@Aspect
@Component
public class DaoAspect {

    // 定义一个公共切点
    @Pointcut("execution(* com.arc.spring.dao.ProductDao.addProduct(..))")
    public void addPoint() {}

    @Before("addPoint()")
    public void before(JoinPoint joinPoint) {...}
   
    @After("addPoint()")
    public void after() {...}

    @AfterReturning(value = "addPoint()", returning = "returnValue")
    public void afterReturning(Object returnValue) {...}

    @AfterThrowing(value = "addPoint()", throwing = "ex")
    public void afterThrowing(Exception ex) {...}

    @Around("addPoint()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {...}

}
```



测试类新增测试方法：

```java
@Test
public void aopTest2() {
    OrderDao orderDao = applicationContext.getBean(OrderDao.class);
    int rows = orderDao.addOrder("001", 100L, 3000.0, 2, "2025-12-31 00:00:00");
    System.out.println(rows);
}
```



输出：

```
method around1() invoked...
method before() invoked...
[001, 100, 3000.0, 2, 2025-12-31 00:00:00]
OrderDaoImpl.addOrder() orderNo=001, userId=100, amount=3000.0, status=2, createTime=2025-12-31 00:00:00
method afterReturning() invoked, returnValue=1
method after() invoked...
method around2() invoked...
1
```

# 4. JoinPoint 对象

JoinPoint 对象封装了 Spring AOP 中切面方法的信息，在切面方法中添加 JoinPoint 参数，就可以获取到调用了该方法信息的 JoinPoint 对象。常用 API：

| 方法名                    | 功能                                                         |
| ------------------------- | ------------------------------------------------------------ |
| Signature getSignature(); | 获取封装了签名信息的对象，在该对象中可以获取到目标方法名、所属类的 Class 等信息 |
| Object[] getArgs();       | 获取传入目标方法的参数对象                                   |
| Object getTarget();       | 获取被代理的对象                                             |
| Object getThis();         | 获取代理对象                                                 |



ProceedingJoinPoint 对象是 JoinPoint 的子接口。该对象只用在 @Around 的切面方法中，添加了两个方法：

- Object proceed() throws Throwable // 执行目标方法

- Object proceed(Object[] var) throws Throwable // 传入的新的参数去执行目标方法



# 5. @Order 注解设置优先级

有多个增强类对同一个方法进行增强，通过 @Order 注解设置增强类优先级，数字越小，优先级越高，其代理位置越**靠近注入位置**。

两个切面类：

```java
package com.arc.spring.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Order(2)
public class DaoAspect {

    @Pointcut("execution(* com.arc.spring.dao.*.add*(..))")
    public void addPoint() {}

    @Before("addPoint()")
    public void before(JoinPoint joinPoint) {
        System.out.println("DaoAspect method before() invoked...");
    }

    @After("addPoint()")
    public void after() {
        System.out.println("DaoAspect method after() invoked...");
    }

    @AfterReturning(value = "addPoint()", returning = "returnValue")
    public void afterReturning(Object returnValue) {
        System.out.println("DaoAspect method afterReturning() invoked, returnValue=" + returnValue);
    }

    @AfterThrowing(value = "addPoint()", throwing = "ex")
    public void afterThrowing(Exception ex) {
        System.out.println("DaoAspect method afterThrowing() invoked, ex=" + ex.getMessage());
    }

    @Around("addPoint()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("DaoAspect method around1() invoked...");
        Object res = joinPoint.proceed();
        System.out.println("DaoAspect method around2() invoked...");
        return res;
    }

}
```



```java
package com.arc.spring.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Order(1)
public class DaoAspect2 {

    @Pointcut("execution(* com.arc.spring.dao.*.add*(..))")
    public void addPoint() {}

    @Before("addPoint()")
    public void before(JoinPoint joinPoint) {
        System.out.println("DaoAspect2 method before() invoked...");
    }

    @After("addPoint()")
    public void after() {
        System.out.println("DaoAspect2 method after() invoked...");
    }

    @AfterReturning(value = "addPoint()", returning = "returnValue")
    public void afterReturning(Object returnValue) {
        System.out.println("DaoAspect2 method afterReturning() invoked, returnValue=" + returnValue);
    }

    @AfterThrowing(value = "addPoint()", throwing = "ex")
    public void afterThrowing(Exception ex) {
        System.out.println("DaoAspect2 method afterThrowing() invoked, ex=" + ex.getMessage());
    }

    @Around("addPoint()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("DaoAspect2 method around1() invoked...");
        Object res = joinPoint.proceed();
        System.out.println("DaoAspect2 method around2() invoked...");
        return res;
    }

}

```



测试方法：

```java
@Test
public void aopTest3() {
    ProductDao productDao = applicationContext.getBean(ProductDao.class);
    productDao.addProduct(1L, "手机", 3000.0, 500);
}
```



输出：

```
DaoAspect2 method around1() invoked...
DaoAspect2 method before() invoked...
DaoAspect method around1() invoked...
DaoAspect method before() invoked...
ProductDaoImpl.addProduct() id=1, name=手机, price=3000.0, stock=500
DaoAspect method afterReturning() invoked, returnValue=1
DaoAspect method after() invoked...
DaoAspect method around2() invoked...
DaoAspect2 method afterReturning() invoked, returnValue=1
DaoAspect2 method after() invoked...
DaoAspect2 method around2() invoked...
```



而且切面类上的注解 @Order 中的数字替换后，则输出：

```
DaoAspect method around1() invoked...
DaoAspect method before() invoked...
DaoAspect2 method around1() invoked...
DaoAspect2 method before() invoked...
ProductDaoImpl.addProduct() id=1, name=手机, price=3000.0, stock=500
DaoAspect2 method afterReturning() invoked, returnValue=1
DaoAspect2 method after() invoked...
DaoAspect2 method around2() invoked...
DaoAspect method afterReturning() invoked, returnValue=1
DaoAspect method after() invoked...
DaoAspect method around2() invoked...
```



可以这么理解，被代理对象为 productDao，Order 为 1 切面类先生成了代理对象 proxy1，Order 为 2 的切面类生成了代理对象 proxy2，但 proxy2 不是代理 productDao，而是代理 proxy1，等于在 proxy1 外面又包了一层。



# 6. 配置类

使用配置类代理配置文件：

```java
package com.arc.spring.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.PropertySource;

@Configuration // 代表这是一个配置类，不加也可以，加上更规范
@ComponentScan(basePackages = "com.arc.spring") // 设置扫描的包
@EnableAspectJAutoProxy(proxyTargetClass = true) // AOP 自动生成代理对象
public class SpringConfig {}
```



测试代码：

```java
@Test
public void aopTest4() {
    ApplicationContext applicationContext = new AnnotationConfigApplicationContext(SpringConfig.class);
    ProductDao productDao = applicationContext.getBean(ProductDao.class);
    productDao.addProduct(1L, "手机", 3000.0, 500);
}
```

输出略。

# 7. XML 方式实现 AOP

新增被代理类：

```java
package com.arc.spring.dao;

public interface CarDao {
    int addCar(Long id, String brand, String color, Integer produceYear, Double price);
}
```



```java
package com.arc.spring.dao.impl;

import com.arc.spring.dao.CarDao;

public class CarDaoImpl implements CarDao {
    @Override
    public int addCar(Long id, String brand, String color, Integer produceYear, Double price) {
        System.out.println("CarDaoImpl.addCar() id=" + id + ", brand=" + brand + ", color=" + color + ", produceYear=" + produceYear + ", price=" + price);
        return 1;
    }
}
```



新增 Spring 配置文件 aop-by-xml.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd">

    <bean id="carDao" class="com.arc.spring.dao.impl.CarDaoImpl"/>
    <bean id="dapAspect" class="com.arc.spring.aspect.DaoAspect"/>

    <!-- 配置 AOP 增强 -->
    <aop:config>
        <!-- 切入点 -->
        <aop:pointcut id="pointCutAdd" expression="execution(* com.arc.spring.dao.CarDao.add*(..))"/>
        <!-- 配置切面 -->
        <aop:aspect ref="dapAspect">
            <!-- 增强作用在具体的方法上 -->
            <aop:before method="before" pointcut-ref="pointCutAdd"/>
            <aop:after method="after" pointcut-ref="pointCutAdd"/>
            <aop:around method="around" pointcut-ref="pointCutAdd"/>
            <aop:after-returning method="afterReturning" pointcut-ref="pointCutAdd" returning="returnValue"/>
            <aop:after-throwing method="afterThrowing" pointcut-ref="pointCutAdd" throwing="ex"/>
        </aop:aspect>
    </aop:config>

</beans>
```



测试类：

```java
package com.arc.spring.test;

import com.arc.spring.dao.CarDao;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class AopByXmlTest {

    ApplicationContext applicationContext;

    @Before
    public void getApplicationContext() {
        applicationContext = new ClassPathXmlApplicationContext("aop-by-xml.xml");
    }

    @Test
    public void aopTest() {
        CarDao carDao = applicationContext.getBean(CarDao.class);
        int rows = carDao.addCar(1L, "BMW", "BLACK", 2025, 500000.00);
        System.out.println(rows);
    }

}
```



测试输出：

```
DaoAspect method before() invoked...
DaoAspect method around1() invoked...
CarDaoImpl.addCar() id=1, brand=BMW, color=BLACK, produceYear=2025, price=500000.0
DaoAspect method afterReturning() invoked, returnValue=1
DaoAspect method around2() invoked...
DaoAspect method after() invoked...
1
```
