# 1. 概述和项目准备

JdbcTemplate 是 Spring 框架中提供的一个对象，是对原始繁琐的 Jdbc API 对象的简单封装。Spring 框架提供了很多的操作模板类。例如：操作关系型数据的 JdbcTemplate 和操作 nosql 数据库的 RedisTemplate，操作消息队列的 JmsTemplate等等。



pom.xml

```xml
<dependencies>
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
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-tx</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-orm</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>aopalliance</groupId>
        <artifactId>aopalliance</artifactId>
        <version>1.0</version>
    </dependency>
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
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.44</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```



jdbc.properties

```properties
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/mydb?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
jdbc_username=root
password=123456
initialSize=1
```



Spring 配置文件 jdbc-template.xml

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
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <!-- 配置连接池 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${driverClassName}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${jdbc_username}"/>
        <property name="password" value="${password}"/>
        <property name="initialSize" value="${initialSize}"/>
    </bean>

    <!-- 配置 JDBCTemplate 对象，并注入 DataSource 属性 -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"/>
    </bean>

</beans>
```



实体类：

```java
package com.arc.spring.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Movie implements Serializable {

    /**
     * 电影唯一编号（主键，自增）
     */
    private Integer id;
    /**
     * 电影名称
     */
    private String movieName;
    /**
     * 导演
     */
    private String director;
    /**
     * 上映日期
     */
    private Date releaseDate;
    /**
     * 片长（单位：分钟）
     */
    private Integer duration;
    /**
     * 电影类型（如：科幻、喜剧、动画、悬疑等）
     */
    private String type;

}
```



Dao 层接口和实现类：

```java
package com.arc.spring.dao;

import com.arc.spring.bean.Movie;

import java.util.List;

public interface MovieDao {

    /**
     * 查询电影个数
     */
    int getMovieCount();

    /**
     * 根据电影 ID 查询电影
     */
    Movie getMovieById(Integer id);

    /**
     * 根据导演姓名查询电影
     */
    List<Movie> getMovieByDirector(String director);

    /**
     * 新增电影
     */
    int addMovie(Movie movie);

    /**
     * 修改电影
     */
    int updateMovie(Movie movie);

    /**
     * 删除电影
     */
    int deleteMovie(Integer id);
    
    /**
     * 批量添加电影
     */
    int[] batchAddMovie(List<Movie> movies);

    /**
     * 批量修改电影
     */
    int[] batchUpdateMovie(List<Movie> movies);

    /**
     * 批量删除电影
     */
    int[] batchDeleteMovie(List<Integer> moviesId);

}
```



实现类逐步修改，初始版本为：

```java
package com.arc.spring.dao.impl;

import com.arc.spring.bean.Movie;
import com.arc.spring.dao.MovieDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
public class MovieDaoImpl implements MovieDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
}
```



初始化 sql：

```sql
CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movie_name VARCHAR(100) NOT NULL COMMENT '电影名称',
    director VARCHAR(50) COMMENT '导演',
    release_date DATE COMMENT '上映日期',
    duration INT COMMENT '片长(分钟)',
    type VARCHAR(50) COMMENT '电影类型'
) COMMENT='电影信息表';

-- 插入电影数据
INSERT INTO movies (id, movie_name, director, release_date, duration, type)
VALUES
(1, '流浪地球', '郭帆', '2019-02-05', 125, '科幻/灾难'),
(2, '哪吒之魔童降世', '饺子', '2019-07-26', 110, '动画/奇幻'),
(3, '满江红', '张艺谋', '2023-01-22', 159, '悬疑/古装'),
(4, '独行月球', '张吃鱼', '2022-07-29', 122, '喜剧/科幻'),
(5, '复仇者联盟4', '罗素兄弟', '2019-04-24', 181, '科幻/动作'),
(6, '千与千寻', '宫崎骏', '2019-06-21', 125, '动画/治愈'),
(7, '我不是药神', '文牧野', '2018-07-05', 117, '剧情/现实'),
(8, '盗梦空间', '克里斯托弗·诺兰', '2010-09-01', 148, '悬疑/科幻'),
(9, '疯狂动物城', '拜伦·霍华德', '2016-03-04', 109, '动画/喜剧'),
(10, '长津湖', '陈凯歌/徐克', '2021-09-30', 176, '战争/历史'),
(11, '英雄', '张艺谋', '2002-12-19', 96, '武侠/动作'),
(12, '十面埋伏', '张艺谋', '2004-07-16', 119, '武侠/爱情'),
(13, '金陵十三钗', '张艺谋', '2011-12-15', 146, '历史/战争'),
(14, '悬崖之上', '张艺谋', '2021-04-30', 120, '谍战/悬疑'),
(15, '影', '张艺谋', '2018-09-30', 115, '古装/武侠');
```



# 2. JdbcTemplate 用法



## 2.1 getMovieCount()

```java
package com.arc.spring.dao.impl;

import com.arc.spring.bean.Movie;
import com.arc.spring.dao.MovieDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MovieDaoImpl implements MovieDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int getMovieCount() {
        String sql = "select count(*) from movies";
        /**
         * sql: 查询的 sql 语句
         * Integer.class：返回值的类型
         */
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    @Override
    public Movie getMovieById(Integer id) {
        return null;
    }

    @Override
    public List<Movie> getMovieByDirector(String director) {
        return Collections.emptyList();
    }

    @Override
    public int addMovie(Movie movie) {
        return 0;
    }

    @Override
    public int updateMovie(Movie movie) {
        return 0;
    }

    @Override
    public int deleteMovie(Integer id) {
        return 0;
    }
}
```

测试类：

```java
package com.arc.spring.test;

import com.arc.spring.bean.Movie;
import com.arc.spring.dao.MovieDao;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.Arrays;
import java.util.List;

public class JdbcTemplateTest {

    ApplicationContext applicationContext;
    MovieDao movieDao;

    @Before
    public void getApplicationContext() {
        applicationContext = new ClassPathXmlApplicationContext("jdbc-template.xml");
        movieDao = applicationContext.getBean("movieDaoImpl", MovieDao.class);
    }

    @Test
    public void getMovieCountTest() {
        int movieCount = movieDao.getMovieCount();
        System.out.println(movieCount);
    }

}
```



测试输出：

```
15
```



## 2.2 getMovieById()

```java
@Override
public Movie getMovieById(Integer id) {
    String sql = "select * from movies where id = ?";
    /**
     * rowMapper：RowMapper 接口的一个实现类对象，用于指定结果集用什么实体类进行封装
     * Object... args：可变参数，SQL 语句中需要传入的一个或多个参数
     */
    RowMapper<Movie> rowMapper = new BeanPropertyRowMapper<>(Movie.class);
    return jdbcTemplate.queryForObject(sql, rowMapper, id);
}
```

```java
public void getMovieByIdTest() {
    Movie movie = movieDao.getMovieById(1);
    System.out.println(movie);
}
```

输出：

```
Movie(id=1, movieName=流浪地球, director=郭帆, releaseDate=2019-02-05 00:00:00.0, duration=125, type=科幻/灾难)
```



## 2.3 getMovieByDirector()

```java
@Override
public List<Movie> getMovieByDirector(String director) {
    String sql = "select * from movies where director = ?";
    /**
     * query(String sql, RowMapper<T> rowMapper, @Nullable Object... args)
     */
    return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Movie.class), director);
}
```

```java
@Test
public void getMovieByDirectorTest() {
    List<Movie> movies = movieDao.getMovieByDirector("张艺谋");
    movies.forEach(System.out::println);
}
```

输出：

```
Movie(id=3, movieName=满江红, director=张艺谋, releaseDate=2023-01-22 00:00:00.0, duration=159, type=悬疑/古装)
Movie(id=11, movieName=英雄, director=张艺谋, releaseDate=2002-12-19 00:00:00.0, duration=96, type=武侠/动作)
Movie(id=12, movieName=十面埋伏, director=张艺谋, releaseDate=2004-07-16 00:00:00.0, duration=119, type=武侠/爱情)
Movie(id=13, movieName=金陵十三钗, director=张艺谋, releaseDate=2011-12-15 00:00:00.0, duration=146, type=历史/战争)
Movie(id=14, movieName=悬崖之上, director=张艺谋, releaseDate=2021-04-30 00:00:00.0, duration=120, type=谍战/悬疑)
Movie(id=15, movieName=影, director=张艺谋, releaseDate=2018-09-30 00:00:00.0, duration=115, type=古装/武侠)
```



## 2.4 addMovie()

```java
@Override
public int addMovie(Movie movie) {
    String sql = "insert into movies values(DEFAULT, ?, ?, ?, ?, ?)";
    /**
     * update(String sql, @Nullable Object... args)
     */
    Object[] args = {movie.getMovieName(), movie.getDirector(), movie.getReleaseDate(), movie.getDuration(), movie.getType()};
    return jdbcTemplate.update(sql, args);
}
```

```java
@Test
public void addMovieTest() {
    Movie movie = new Movie(null, "宇宙探索编辑部", "孔大山", java.sql.Date.valueOf("2023-04-01"), 118, "科幻/喜剧");
    System.out.println(movieDao.addMovie(movie));
    System.out.println(movieDao.getMovieById(16));
}
```

输出：

```
1
Movie(id=16, movieName=宇宙探索编辑部, director=孔大山, releaseDate=2023-04-01 00:00:00.0, duration=118, type=科幻/喜剧)
```



## 2.5 updateMovie()

```java
@Override
public int updateMovie(Movie movie) {
    String sql = "update movies set movie_name = ?, director = ?, release_date = ?, duration = ?, type = ? where id = ?";
    Object[] args = {movie.getMovieName(), movie.getDirector(), movie.getReleaseDate(), movie.getDuration(), movie.getType(), movie.getId()};
    return jdbcTemplate.update(sql, args);
}
```

```java
@Test
public void updateMovieTest() {
    Movie movie = new Movie(16, "宇宙探索编辑部2", "孔大山", java.sql.Date.valueOf("2023-04-02"), 119, "喜剧");
    System.out.println(movieDao.updateMovie(movie));
    System.out.println(movieDao.getMovieById(16));
}
```

输出：

```
1
Movie(id=16, movieName=宇宙探索编辑部2, director=孔大山, releaseDate=2023-04-02 00:00:00.0, duration=119, type=喜剧)
```



## 2.6 deleteMovie()

```java
@Override
public int deleteMovie(Integer id) {
    String sql = "delete from movies where id = ?";
    /**
     * update(String sql, @Nullable Object... args)
     */
    return jdbcTemplate.update(sql, id);
}
```

```java
@Test
public void deleteMovieTest() {
    System.out.println(movieDao.deleteMovie(16));
}
```

输出：

```
1
```



## 2.7 batchAddMovie()

```java
@Override
public int[] batchAddMovie(List<Movie> movies) {
    String sql = "insert into movies values(DEFAULT, ?, ?, ?, ?, ?)";
    List<Object[]> args = new LinkedList<>();
    for (Movie movie : movies) {
        Object[] arg = {movie.getMovieName(), movie.getDirector(), movie.getReleaseDate(), movie.getDuration(), movie.getType()};
        args.add(arg);
    }
    /**
     * batchUpdate(String sql, List<Object[]> batchArgs)
     */
    return jdbcTemplate.batchUpdate(sql, args);
}
```

```java
@Test
public void batchAddMovieTest() {
    Movie[] movies = {
        new Movie(null, "消失的她", "崔睿", java.sql.Date.valueOf("2023-06-22"), 129, "悬疑/犯罪"),
        new Movie(null, "八角笼中", "王宝强", java.sql.Date.valueOf("2023-07-06"), 117, "剧情/现实"),
        new Movie(null, "热辣滚烫", "贾玲", java.sql.Date.valueOf("2024-02-10"), 128, "喜剧/励志")
    };
    int[] rows = movieDao.batchAddMovie(Arrays.asList(movies));
    System.out.println(Arrays.toString(rows));
}
```

输出：

```
[1, 1, 1]
```





## 2.8 batchUpdateMovie()

```java
@Override
public int[] batchUpdateMovie(List<Movie> movies) {
    String sql = "update movies set movie_name = ?, director = ?, release_date = ?, duration = ?, type = ? where id = ?";
    List<Object[]> args = new LinkedList<>();
    for (Movie movie : movies) {
        Object[] arg = {movie.getMovieName(), movie.getDirector(), movie.getReleaseDate(), movie.getDuration(), movie.getType(), movie.getId()};
        args.add(arg);
    }
    return jdbcTemplate.batchUpdate(sql, args);
}
```

```java
@Test
public void batchUpdateMovieTest() {
    Movie[] movies = {
            new Movie(17, "消失的她17", "崔睿", java.sql.Date.valueOf("2023-06-22"), 17, "悬疑/犯罪"),
            new Movie(18, "八角笼中18", "王宝强", java.sql.Date.valueOf("2023-07-06"), 18, "剧情/现实"),
            new Movie(19, "热辣滚烫19", "贾玲", java.sql.Date.valueOf("2024-02-10"), 19, "喜剧/励志")
    };
    int[] rows = movieDao.batchUpdateMovie(Arrays.asList(movies));
    System.out.println(Arrays.toString(rows));
    System.out.println(movieDao.getMovieById(17));
    System.out.println(movieDao.getMovieById(18));
    System.out.println(movieDao.getMovieById(19));
}
```

输出：

```
[1, 1, 1]
Movie(id=17, movieName=消失的她17, director=崔睿, releaseDate=2023-06-22 00:00:00.0, duration=17, type=悬疑/犯罪)
Movie(id=18, movieName=八角笼中18, director=王宝强, releaseDate=2023-07-06 00:00:00.0, duration=18, type=剧情/现实)
Movie(id=19, movieName=热辣滚烫19, director=贾玲, releaseDate=2024-02-10 00:00:00.0, duration=19, type=喜剧/励志)
```

## 2.9 batchDeleteMovie()

```java
@Override
public int[] batchDeleteMovie(List<Integer> moviesId) {
    String sql = "delete from movies where id = ?";
    List<Object[]> args = new LinkedList<>();
    for (Integer movieId : moviesId) {
        Object[] arg = {movieId};
        args.add(arg);
    }
    return jdbcTemplate.batchUpdate(sql, args);
}
```

```java
@Test
public void batchDeleteMovieTest() {
    int[] rows = movieDao.batchDeleteMovie(Arrays.asList(17, 18, 19));
    System.out.println(Arrays.toString(rows));
}
```

输出：

```
[1, 1, 1]
```
