# 1. 概念引入

控制反转（Inversion of Control，缩写为 IoC），是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做依赖注入（Dependency Injection，简称 DI），还有一种方式叫“依赖査找”（Dependency Lookup）。通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体将其所依赖的对象的引用传递给它。也可以说，依赖被注入到对象中。

简单的说就是，创建对象的权利，或者是控制的位置，由 Java 代码转移到 Spring 容器，由 Spring 的容器控制对象的创建，就是控制反转，Spring 创建对象时,会读取配置文件中的信息，然后使用反射创建好对象之后在容器中存储起来，当我们需要某个对象时，通过 id 获取对象即可，不需要使用代码去 new。

一句话：创建对象交给容器。

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260307195840892-600745276.png)

传统的 JavaWeb 项目架构，高耦合：如果 EmpDao 的实现类变成了 EmpDaoImpl2，则 EmpServiceImpl 类的代码需要做修改。引入 Spring 之后，其解耦原理如下：

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260307195901573-902064501.png)


获取对象从容器中去拿，假设 EmpDao 的实现类由 EmpDaoImpl 变成 EmpDaoImpl2，则只需要修改配置文件，将 id 为 empDao 的对象的全限定类名修改为 EmpDaoImpl2 的全限定类名，那么容器实例化的就是 EmpDaoImpl2 的对象，Service 层无需修改。

# 2. IoC 快速入门

## 2.1 Maven 项目创建

Spring 核心容器模块包含 4 个子模块组成：Beans、Core、Context、SpEL，对应的 maven 依赖分别是：spring-beans、spring-core、spring-context、spring-expression，但是引入 spring-context 就会依赖引入其他 3 个依赖，所以只需引入 spring-context

```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context</artifactId>
  <version>5.3.39</version>
</dependency>
```

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260307200015938-566245004.png)

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260307200024024-532248498.png)


为了方便测试，导入 Junit 测试依赖：

```XML
<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId>
  <version>4.13.2</version>
  <scope>test</scope>
</dependency>
```

## 2.2 定义接口和实现类

```JAVA
package com.arc.spring.dao;

public interface EmpDao {

    int addEmp();

}
```

```JAVA
package com.arc.spring.dao.impl;

import com.arc.spring.dao.EmpDao;

public class EmpDaoImpl implements EmpDao {

    @Override
    public int addEmp() {
        System.out.println("EmpDaoImpl addEmp invoked");
        return 0;
    }

}
```

## 2.3 创建 Spring 配置文件

```XML
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="empDao" class="com.arc.spring.dao.impl.EmpDaoImpl"/>

</beans>
```

## 2.4 测试

```JAVA
package com.arc.spring.test;

import com.arc.spring.dao.EmpDao;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class IoCQuickStartTest {

    @Test
    public void testIocQuickStart() {
        // 获取容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("ioc-quick-start.xml");
        // EmpDao empDao = (EmpDao) applicationContext.getBean("empDao");
        EmpDao empDao = applicationContext.getBean("empDao", EmpDao.class);
        empDao.addEmp();
    }

}
```

输出：

```
EmpDaoImpl addEmp invoked
```


添加一个实现类：
```JAVA
package com.arc.spring.dao.impl;

import com.arc.spring.dao.EmpDao;

public class EmpDaoImpl2 implements EmpDao {

    @Override
    public int addEmp() {
        System.out.println("EmpDaoImpl2 addEmp invoked");
        return 0;
    }

}
```

将实现类替换成 EmpDaoImpl2，只需要修改配置文件 ioc-quick-start.xml：

```XML
<bean id="empDao" class="com.arc.spring.dao.impl.EmpDaoImpl2"/>
```

再次运行测试代码：
```
EmpDaoImpl2 addEmp invoked
```


# 3. IoC 实现原理

1. XML 解析技术读取配置文件

将配置信息 `<bean id="empDao" class="com.arc.spring.dao.impl.EmpDaoImpl2"/>`读取到程序中，包括对象的 ID 和类的全限定名。

2. 反射技术实例化对象，放到容器中

- 获得类的字节码：`Class clazz = Class.forName("com.arc.spring.dao.impl.EmpDaoImpl2")`
- 通过字节码实例化对象：Object obj = clazz.newInstance();
- 将对象放到一个 map 集合中（实际是很复杂的集合对象）：map.put("empDao", obj)

3. 工厂模式返回 Bean 对象：getBean()

简单理解下：
```JAVA
public Object getBean(String name) {
  Object obj = map.get(name);
  return obj;
}
```

IoC 的常用的接口包括：

- BeanFactory 接口：IoC 容器基本功能接口，是 Spring 内部使用的接口，我们在处理业务时一般不直接使用该接口；
- ApplicationContext 接口：BeanFactory 的子接口，提供更多更强大的功能，研发人员一般使用的接口。

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260307200420713-143356910.png)

