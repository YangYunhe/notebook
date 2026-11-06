通过 property 标签可以手动指定给属性进行注入；
也可以通过自动装配完成属性的自动注入，就是自动装配，可以简化 DI 的配置；
自动装配：根据配置的策略自动为非字面量属性进行赋值；

# 1. byName

通过属性名和 Spring 容器中 bean 的 id 进行比较，如果一致，可以直接赋值

```JAVA
package com.arc.spring.bean;

public class Emp {

    private Dept dept;

    public void setDept(Dept dept) {
        this.dept = dept;
    }

    @Override
    public String toString() {
        return "Emp{" +
        "dept=" + dept +
        '}';
    }
}
```

```JAVA
package com.arc.spring.bean;

public class Dept {}

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
  http://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean id="e1" class="com.arc.spring.bean.Emp" autowire="byName"/>

  <!-- ByName -->
  <bean id="dept" class="com.arc.spring.bean.Dept"/>

</beans>
```

```JAVA
package com.arc.spring.test;

import com.arc.spring.bean.Emp;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class AutoAssignmentTest {

    @Test
    public void autoAssignmentTest() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("auto-assignment.xml");
        Emp e1 = applicationContext.getBean("e1", Emp.class);
        System.out.println(e1);
    }

}
```

输出：
```
Emp{dept=com.arc.spring.bean.Dept@73700b80}
```

# 2. byType

通过 Spring 容器中 bean 的类型，为兼容性的属性赋值，要求 Spring 容器中只能有一个能为属性赋值的 bean

```XML
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
  http://www.springframework.org/schema/beans/spring-beans.xsd">

  <bean id="e1" class="com.arc.spring.bean.Emp" autowire="byType"/ >

  <!-- ByType -->
  <bean id="d1" class="com.arc.spring.bean.Dept"/>

  <!-- ByName -->
  <!-- 这个 bean 必须注释掉
  <bean id="dept" class="com.arc.spring.bean.Dept"/>
  -->

</beans>
```

输出：
```
Emp{dept=com.arc.spring.bean.Dept@7a419da4}
```

关于自动装配：设置 autowire 属性后，会作用于该 bean 中的所有非字面量属性，只要找到满足条件的 bean，就一定会赋值，因此，不建议使用通过属性设置 autowire 的方式。

