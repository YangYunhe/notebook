特点：bean 标签中定义的 class 类不是返回的对象的类，而是生产该对象的工厂
Spring 中定义好了一个工厂接口，可以生产对象的接口，可以通过工厂来获取 bean

```JAVA
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

定义工厂对象，实现 FactoryBean 接口

```JAVA
package com.arc.spring.ioc.factory;

import com.arc.spring.bean.Book;
import org.springframework.beans.factory.FactoryBean;

public class MyFactory implements FactoryBean<Book> {

    @Override
    public Book getObject() throws Exception {
        Book book = new Book();
        book.setTitle("TT");
        book.setAuthor("AA");
        return book;
    }

    @Override
    public Class<?> getObjectType() {
        return Book.class;
    }

    @Override
    public boolean isSingleton() {
        return false;
    }

}
```

```XML
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="factory" class="com.arc.spring.ioc.factory.MyFactory"/>

</beans>
```

```JAVA
package com.arc.spring.test;

import com.arc.spring.bean.Book;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class FactoryBeanTest {

    @Test
    public void factoryBeanTest() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("factory-bean.xml");
        Book book = applicationContext.getBean("factory", Book.class);
        // Object book = applicationContext.getBean("factory");
        System.out.println(book);
    }

}
```

输出：
```
Book{title='TT', author='AA'}
```
