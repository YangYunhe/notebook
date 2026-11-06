# 1. 概念
Spring 中的 Bean 的管理：Bean（汉译咖啡豆），又称 JavaBean，其实就是 Java 程序中的一个个对象，所以 Bean 的管理其实就是 Spring 对于 Java 程序中的对象的管理。


管理的内容是什么？
1. 对象的创建 IoC

IoC 叫做控制反转，就是 Spring 给我们创建对象，然后我们直接用，不用自己 new，IoC 处理的是对象如何创建的问题；

2. 属性的赋值 DI

DI（Dependency Injection），即“依赖注入”，就是创建属性时给对象属性赋值，对象功能的实现往往要依赖属性的值，那么给对象属性赋值就可以说成是依赖注入，由于对象属性不仅仅是基本数据类型，还可能是其他类，或者引用类型，那么依赖注入将会把更多的对象之间的关系整理到一起，可以形成一个庞大的依赖关系，DI 处理的是对象的属性赋值和互相依赖的关系。

Spring 给我们提供了两种管理 Bean 对象的方式：

1. 基于 XML 方式的 Bean 管理
2. 基于注解方式的 Bean 管理

# 2. XML 方式实现 DI
## 2.1 通过 set() 方法给对象属性赋值

前提条件：
- 实体类中存在无参构造器
- 实体类中存在 set() 方法
- 属性值必须符合其数据类型

```java
package com.arc.spring.bean;

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

```xml
<bean id="u1" class="com.arc.spring.bean.User">
    <!--
        <property>: 为对象的某个属性赋值，就是在使用 set() 方法实现依赖注入
        name: 属性名
        value: 属性值
        1001 会自动转换成 Integer 类型
    -->
    <property name="userid" value="1001"/>
    <property name="username" value="小明"/>
    <property name="password" value="123"/>
</bean>
```

```java
ApplicationContext applicationContext;

@Before
public void getApplicationContext() {
    applicationContext = new ClassPathXmlApplicationContext("di-by-xml.xml");
}
@Test
public void diBySetTest() {
    User user = (User) applicationContext.getBean("u1");
    System.out.println(user);
}
```

输出：
```
NoArgsConstructor
setUserid
setUsername
setPassword
User{userid=1001, username='小明', password='123'}
```

## 2.2 通过有参构造器给对象属性赋值

注意：
- 有参构造器中由多少个参数，就要写多少个 <constructor-arg> 标签
- 通过构造器赋值，可以使用 name 属性或者 index 属性来赋值，index 是有参构造器的参数列表的索引，从 0 开始
- index 和 name 可以同时使用
- 可以显式说明每个属性的类型

```xml
<bean id="u2" class="com.arc.spring.bean.User">
  <constructor-arg name="userid" value="2"/>
  <constructor-arg name="username" value="小明"/>
  <constructor-arg name="password" value="abc"/>
</bean>
<bean id="u3" class="com.arc.spring.bean.User">
  <constructor-arg index="0" value="3"/>
  <constructor-arg index="1" value="小黑"/>
  <constructor-arg index="2" value="aax"/>
</bean>
<bean id="u4" class="com.arc.spring.bean.User">
  <constructor-arg index="0" value="4"/>
  <constructor-arg index="1" value="小a"/>
  <constructor-arg name="password" value="aac"/>
</bean>
<bean id="uu" class="com.arc.spring.bean.User">
  <constructor-arg index="0" name="userid" value="1001" type="java.lang.Integer"/>
  <constructor-arg index="1" value="小红"/>
  <constructor-arg name="password" value="icc"/>
</bean>
```

```java
public class DiByXmlTest {

    ApplicationContext applicationContext;

    @Before
    public void getApplicationContext() {
        applicationContext = new ClassPathXmlApplicationContext("di-by-xml.xml");
    }

    @Test
    public void diByConstructorTest() {
        User u2 = applicationContext.getBean("u2", User.class);
        User u3 = applicationContext.getBean("u3", User.class);
        User u4 = applicationContext.getBean("u4", User.class);
        User uu = applicationContext.getBean("uu", User.class);
        System.out.println(u2);
        System.out.println(u3);
        System.out.println(u4);
        System.out.println(uu);
    }

}
```

输出：
```
AllArgConstructor
AllArgConstructor
AllArgConstructor
AllArgConstructor
User{userid=2, username='小明', password='abc'}
User{userid=3, username='小黑', password='aax'}
User{userid=4, username='小a', password='aac'}
User{userid=1001, username='小红', password='icc'}
```

## 2.3 通过 p 名称空间和 c 名称空间给对象属性赋值

说明：
- p 名称空间是对使用 <property> 标签进行赋值的简化
- c 名称空间是对使用 <constructor-arg> 标签进行赋值的简化
- p 名称空间和 c 名称空间需要启用才可以使用，`xmlns:p="http://www.springframework.org/schema/p"`、`xmlns:c="http://www.springframework.org/schema/c"`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="u5" class="com.arc.spring.bean.User" p:userid="5" p:username="xiaoxiao" p:password="123"/>
    <bean id="u6" class="com.arc.spring.bean.User" c:userid="6" c:username="huhu" c:password="456"/>

</beans>
```

```java
package com.arc.spring.test;

import com.arc.spring.bean.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class DiByXmlTest {

    ApplicationContext applicationContext;

    @Before
    public void getApplicationContext() {
        applicationContext = new ClassPathXmlApplicationContext("di-by-xml.xml");
    }

    @Test
    public void diByPNameSpaceAndCNameSpaceTest() {
        User u5 = applicationContext.getBean("u5", User.class);
        User u6 = applicationContext.getBean("u6", User.class);
        System.out.println(u5);
        System.out.println(u6);
    }

}
```

输出：
```
NoArgsConstructor
setPassword
setUserid
setUsername
AllArgConstructor
User{userid=5, username='xiaoxiao', password='123'}
User{userid=6, username='huhu', password='456'}
```

## 2.4 注入空值和特殊符号

说明：
- 使用 <null> 标签赋 null 值
- 没有使用 <property> 标签赋值的包装类型和引用类型的默认值就是 null
- 注入特殊符号有两种方法，方法一是使用 HTML 编码表示特殊符号，对照表格如下：

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260307202244193-1840746225.png)

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260307202758882-1482978620.png)


- 注入特殊符号的方法二是使用 CDATA 标签，`<![CDATA[内容]]>`

```xml
<bean id="u7" class="com.arc.spring.bean.User">
    <property name="userid">
        <null/>
    </property>
    <property name="username" value="hh"/>
</bean>

<bean id="u8" class="com.arc.spring.bean.User">
    <property name="userid" value="8"/>
    <!-- 方法一：特殊符号转为 HTML 编码
        <    &lt;
        >    &gt;
        &    &amp;
        "    &quot;
    -->
    <property name="username" value="&lt;&quot;&amp;TOM&amp;&quot;&gt;"/>
    <!-- 方法二：CDATA -->
    <property name="password">
        <value><![CDATA[<&pass&>]]></value>
    </property>
</bean>
```

```java
@Test
public void nullValueTest() {
    User u7 = applicationContext.getBean("u7", User.class);
    System.out.println(u7);
}

@Test
public void specificSymbolTest() {
    User u8 = applicationContext.getBean("u8", User.class);
    System.out.println(u8);
}
```

输出：
```
NoArgsConstructor
setUserid
setUsername
User{userid=null, username='hh', password='null'}

NoArgsConstructor
setUserid
setUsername
setPassword
User{userid=8, username='<"&TOM&">', password='<&pass&>'}
```

## 2.5 注入引用类型

```java
package com.arc.spring.bean;

import java.util.Date;

public class Mouse {

    private String name;
    private Date birthDay;

    public Mouse() {

    }

    public Mouse(String name, Date birthDay) {
        this.name = name;
        this.birthDay = birthDay;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(Date birthDay) {
        this.birthDay = birthDay;
    }

    @Override
    public String toString() {
        return "Mouse{" +
        "name='" + name + '\'' +
        ", birthDay=" + birthDay +
        '}';
    }
}
```

```java
package com.arc.spring.bean;

public class Cat {

    private String name;
    private Mouse mouse;

    public Cat() {}

    public Cat(String name, Mouse mouse) {
        this.name = name;
        this.mouse = mouse;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Mouse getMouse() {
        return mouse;
    }

    public void setMouse(Mouse mouse) {
        this.mouse = mouse;
    }

    @Override
    public String toString() {
        return "Cat{" +
                "name='" + name + '\'' +
                ", mouse=" + mouse +
                '}';
    }
}
```

```xml
<!-- Date 类型赋值 -->
<bean id="birthDay" class="java.util.Date"/>
<bean id="m1" class="com.arc.spring.bean.Mouse">
    <property name="name" value="Jerry1"/>
    <property name="birthDay" ref="birthDay"/>
</bean>

<!--
    引用外部 bean
    外部 bean 的属性在外部赋值
-->
<bean id="c1" class="com.arc.spring.bean.Cat">
    <property name="name" value="Tom1"/>
    <property name="mouse" ref="m1"/>
</bean>
<!-- 引用内部 bean -->
<bean id="c2" class="com.arc.spring.bean.Cat">
    <property name="name" value="Tom2"/>
    <property name="mouse">
        <!-- 内部 bean 只能在其外部 bean 中使用 -->
        <bean class="com.arc.spring.bean.Mouse">
            <property name="name" value="Jerry2"/>
            <property name="birthDay">
                <bean class="java.util.Date"/>
            </property>
        </bean>
    </property>
</bean>
<!--
    引用外部 bean
    外部 bean 的属性在内部赋值
-->
<bean id="m3" class="com.arc.spring.bean.Mouse"/>
<bean id="c3" class="com.arc.spring.bean.Cat">
    <property name="name" value="Tom3"/>
    <property name="mouse" ref="m3"/>
    <!--
        这种赋值方式要求 Cat 类中必须存在 getMouse() 方法
        因为赋值流程是用反射调用 getMouse() 得到 Mouse 对象之后
        再调用 Mouse 对象的 setter() 方法进行赋值
    -->
    <property name="mouse.name" value="Jerry2"/>
    <property name="mouse.birthDay">
        <bean class="java.util.Date"/>
    </property>
</bean>
```

```java
@Test
public void refTest() {
    Mouse m1 = applicationContext.getBean("m1", Mouse.class);
    Cat c1 = applicationContext.getBean("c1", Cat.class);
    Cat c2 = applicationContext.getBean("c2", Cat.class);
    Cat c3 = applicationContext.getBean("c3", Cat.class);
    System.out.println(m1);
    System.out.println(c1);
    System.out.println(c2);
    System.out.println(c3);
}
```

输出：
```
Mouse{name='Jerry1', birthDay=Sat Oct 25 10:27:52 CST 2025}
Cat{name='Tom1', mouse=Mouse{name='Jerry1', birthDay=Sat Oct 25 10:27:52 CST 2025}}
Cat{name='Tom2', mouse=Mouse{name='Jerry2', birthDay=Sat Oct 25 10:27:52 CST 2025}}
Cat{name='Tom3', mouse=Mouse{name='Jerry2', birthDay=Sat Oct 25 10:27:52 CST 2025}}
```

## 2.6 注入集合类型

```java
package com.arc.spring.bean;

public class Book {

    private String title;
    private String author;

    public Book() {}

    public Book(String title, String author) {
        this.title = title;
        this.author = author;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @Override
    public String toString() {
        return "Book{" +
                "title='" + title + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}
```

```java
package com.arc.spring.bean;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Student {

    private String[] bookArray;
    private Set<String> bookSet;
    private List<String> bookList;
    private Map<String, String> bookMap;
    private List<Book> bookList2;

    public Student() {}

    public String[] getBookArray() {
        return bookArray;
    }

    public void setBookArray(String[] bookArray) {
        this.bookArray = bookArray;
    }

    public Map<String, String> getBookMap() {
        return bookMap;
    }

    public void setBookMap(Map<String, String> bookMap) {
        this.bookMap = bookMap;
    }

    public List<String> getBookList() {
        return bookList;
    }

    public void setBookList(List<String> bookList) {
        this.bookList = bookList;
    }

    public Set<String> getBookSet() {
        return bookSet;
    }

    public void setBookSet(Set<String> bookSet) {
        this.bookSet = bookSet;
    }

    public List<Book> getBookList2() {
        return bookList2;
    }

    public void setBookList2(List<Book> bookList2) {
        this.bookList2 = bookList2;
    }

    @Override
    public String toString() {
        return "Student{" +
                "bookArray=" + Arrays.toString(bookArray) +
                ", bookSet=" + bookSet +
                ", bookList=" + bookList +
                ", bookMap=" + bookMap +
                ", bookList2=" + bookList2 +
                '}';
    }
}
```

注意：XML 中引入了新的标签：
- `xmlns:util="http://www.springframework.org/schema/util"`
- `http://www.springframework.org/schema/util`
- `http://www.springframework.org/schema/util/spring-util.xsd`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:util="http://www.springframework.org/schema/util"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd">

    <!-- 集合类型的注入：数组 -->
    <bean id="s1" class="com.arc.spring.bean.Student">
        <property name="bookArray">
            <array>
                <value>A</value>
                <value>B</value>
                <value>C</value>
            </array>
        </property>
    </bean>

    <!-- 集合类型的注入：List -->
    <bean id="s2" class="com.arc.spring.bean.Student">
        <property name="bookList">
            <list>
                <value>A</value>
                <value>B</value>
                <value>C</value>
            </list>
        </property>
    </bean>

    <!-- 集合类型的注入：Set -->
    <bean id="s3" class="com.arc.spring.bean.Student">
        <property name="bookSet">
            <set>
                <value>A</value>
                <value>B</value>
                <value>C</value>
            </set>
        </property>
    </bean>

    <!-- 集合类型的注入：Map -->
    <bean id="s4" class="com.arc.spring.bean.Student">
        <property name="bookMap">
            <map>
                <entry key="Key1" value="Value1" />
                <entry key="Key2" value="Value2"/>
            </map>
        </property>
    </bean>

    <bean id="b1" class="com.arc.spring.bean.Book" p:title="T1" p:author="A1"/>

    <!-- 集合类型的注入：List<Book> -->
    <bean id="s5" class="com.arc.spring.bean.Student">
        <property name="bookList2">
            <list>
                <!-- list 的第一个元素：引入外部 bean -->
                <ref bean="b1" />
                <!-- list 的第二个元素：内部定义 bean -->
                <bean class="com.arc.spring.bean.Book" p:title="T2" p:author="A2"/>
            </list>
        </property>
    </bean>

    <bean id="b3" class="com.arc.spring.bean.Book" p:title="T3" p:author="A3"/>
    <!-- 集合类型的注入：引入外部集合 -->
    <!-- 定义外部 List -->
    <util:list id="books">
        <!-- list 的第一个元素：引入外部 bean -->
        <ref bean="b3"/>
        <!-- list 的第二个元素：定义内部 bean -->
        <bean class="com.arc.spring.bean.Book" p:title="T4" p:author="A4"/>
    </util:list>
    <!-- 定义外部 Map -->
    <util:map id="map">
        <entry key="Key3" value="Value3" />
    </util:map>
    <bean id="s6" class="com.arc.spring.bean.Student">
        <property name="bookList2" ref="books" />
        <property name="bookMap" ref="map" />
    </bean>

</beans>
```

```java
@Test
public void collectionInjectionTest() {
    Student s1 = applicationContext.getBean("s1", Student.class);
    Student s2 = applicationContext.getBean("s2", Student.class);
    Student s3 = applicationContext.getBean("s3", Student.class);
    Student s4 = applicationContext.getBean("s4", Student.class);
    Student s5 = applicationContext.getBean("s5", Student.class);
    Student s6 = applicationContext.getBean("s6", Student.class);
    System.out.println(s1);
    System.out.println(s2);
    System.out.println(s3);
    System.out.println(s4);
    System.out.println(s5);
    System.out.println(s6);
}
```

输出：
```
Student{bookArray=[A, B, C], bookSet=null, bookList=null, bookMap=null, bookList2=null}
Student{bookArray=null, bookSet=null, bookList=[A, B, C], bookMap=null, bookList2=null}
Student{bookArray=null, bookSet=[A, B, C], bookList=null, bookMap=null, bookList2=null}
Student{bookArray=null, bookSet=null, bookList=null, bookMap={Key1=Value1, Key2=Value2}, bookList2=null}
Student{bookArray=null, bookSet=null, bookList=null, bookMap=null, bookList2=[Book{title='T1', author='A1'}, Book{title='T2', author='A2'}]}
Student{bookArray=null, bookSet=null, bookList=null, bookMap={Key3=Value3}, bookList2=[Book{title='T3', author='A3'}, Book{title='T4', author='A4'}]}
```
