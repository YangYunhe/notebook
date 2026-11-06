```java
package com.arc.spring.dao;

public interface UserDao {
    void addUser();
}
```



```java
package com.arc.spring.dao.impl;

import com.arc.spring.dao.UserDao;
import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl1 implements UserDao {
    @Override
    public void addUser() {
        System.out.println("UserDaoImpl1 addUser...");
    }
}
```



```java
package com.arc.spring.dao.impl;

import com.arc.spring.dao.UserDao;
import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl2 implements UserDao {
    @Override
    public void addUser() {
        System.out.println("UserDaoImpl2 addUser...");
    }
}

```



```java
package com.arc.spring.service;

import org.springframework.stereotype.Service;

@Service
public class Service1 {
}
```



```java
package com.arc.spring.service;

public interface UserService {
    void addUser();
}
```


```java
package com.arc.spring.service.impl;

import com.arc.spring.dao.UserDao;
import com.arc.spring.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;

@Service
public class UserServiceImpl implements UserService {

    @Resource(name = "userDaoImpl2")
    UserDao userDao;

    @Value("张三")
    private String name;
    @Value("20")
    private Integer age;
    @Value("${driverClassName}")
    private String driver;
    @Value("${url}")
    private String url;
    @Value("${jdbc_username}")
    private String username;
    @Value("${password}")
    private String password;
    @Value("${initialSize}")
    private Integer initialSize;

    @Override
    public void addUser() {
        System.out.println(name);
        System.out.println(age);
        System.out.println(driver);
        System.out.println(url);
        System.out.println(username);
        System.out.println(password);
        System.out.println(initialSize);
        userDao.addUser();
    }
}
```

配置类：

```JAVA
package com.arc.spring.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

@ComponentScan(basePackages = "com.arc.spring") // 设置扫描的包
@PropertySource("classpath:jdbc.properties") // 设置读取的配置文件
public class SpringConfig {
}
```



测试类：

```java
package com.arc.spring.test;

import com.arc.spring.config.SpringConfig;
import com.arc.spring.service.UserService;
import com.arc.spring.service.impl.UserServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class IocAndDiByConfigClassTest {

    ApplicationContext applicationContext;

    @Before
    public void getApplicationContext() {
        applicationContext = new AnnotationConfigApplicationContext(SpringConfig.class);
    }

    @Test
    public void iocAndDiByConfigClassTest() {
        UserService userService = applicationContext.getBean("userServiceImpl", UserServiceImpl.class);
        userService.addUser();
    }

}
```






测试代码输出：

```
张三
20
com.mysql.cj.jdbc.Driver
jdbc:mysql://localhost:3306/mydb?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
root
123456
1
UserDaoImpl2 addUser...
```

