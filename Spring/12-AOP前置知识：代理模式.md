# 1. 代理模式简介

代理模式是通过代理对象访问目标对象，这样可以在目标对象基础上增强额外的功能，如添加权限、访问控制和审计等功能。

![image](https://img2024.cnblogs.com/blog/3706506/202603/3706506-20260308143002872-2123587977.png)

1. 静态代理

静态代理中代理类与被代理类都需要实现同一个接口，这就说明一个静态代理类只能代理一个类，并且还要事先知道要代理哪个类。如果有其他类还想使用代理那就必须再写一个代理类。然而在实际开发中是可能有非常多的类是要被代理的，并且事先可能并不知道要代理哪个类。所以如果继续使用静态代理反而会增加许多的工作量，并且效率低下，代码复用率也不好。

2. 动态代理

动态代理可以针对于一些不特定的类或者一些不特定的方法进行代理，可以在程序运行时动态的变化代理的规则，代理类在程序运行时才创建的代理模式称为动态代理。这种情况下，代理类并不是在 Java 代码中定义好的，而是在程序运行时根据用户在 Java 代码中的"指示"动态生成的。

- Proxy：JDK 动态代理，面向接口
- cglib：第三方动态代理，面向父类

3. 代理模式的作用：在不修改原有代码或者没有办法修改原有代码的情况下增强对象功能，使用代理对象代替原来的对象去完成功能，进而达到拓展功能的目的



# 2. 静态代理

```java
package com.arc.spring.proxy;

public class StaticProxy {

    public static void main(String[] args) {
        Court court = new Lawyer(new Person("张三"));
        court.doCourt();
    }

}

// 法庭（接口）
interface Court {
    void doCourt();
}

// 被告（被代理类）
class Person implements Court {

    public String name;

    public Person(String name) {
        this.name = name;
    }

    @Override
    public void doCourt() {
        System.out.println("我是" + name + "，我没有违法");
    }
}

// 律师（代理类）
class Lawyer implements Court {

    private Person person;

    public Lawyer(Person person) {
        this.person = person;
    }

    @Override
    public void doCourt() {
        System.out.println(person.name + "有不在场证明");
        person.doCourt();
    }
}
```



# 3. 动态代理



## 3.1 JDK Proxy 动态代理



```java
package com.arc.spring.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class JdkDynamicProxy {
    public static void main(String[] args) {
        // Dinner dinner = new Customer("张三");
        Dinner dinner = new Customer2("李四");
        /*
         * 通过 Proxy 动态代理获得一个代理对象，在代理对象中，对某个方法进行增强
         * ClassLoader loader 被代理的对象的类加载器
         * Class<?>[] interfaces 被代理对象实现的所有接口
         * InvocationHandler h 执行处理器对象，专门用于定义增强的规则
         */
        ClassLoader classLoader = dinner.getClass().getClassLoader();
        Class[] interfaces = dinner.getClass().getInterfaces();
        InvocationHandler handler = new InvocationHandler() {
            // 代理对象调用任何方法时，都会触发 invoke() 方法执行
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                // Object proxy 被代理对象（dinner）
                // Method method 被代理的方法（要增强的方法）
                // Object[] args 被代理的方法运行时的实参（"包子"）
                System.out.println("invoke()方法执行了");
                // 定义返回值
                Object res = null;
                // 只增强 eat() 方法
                if (method.getName().equals("eat")) {
                    // 在被代理对象执行之前执行
                    System.out.println("饭前洗手");
                    // 原本被代理的对象执行
                    res = method.invoke(dinner, args);
                    // 在被代理对象执行之后执行
                    System.out.println("饭后洗碗");
                } else { // 其他方法正常执行
                    res = method.invoke(dinner, args);
                }
                return res;
            }
        };
        Dinner dinnerProxy = (Dinner) Proxy.newProxyInstance(classLoader, interfaces, handler);
        dinnerProxy.eat("包子");
        dinnerProxy.drink("可乐");
    }
}

// 吃晚饭
interface Dinner {
    void eat(String food);
    void drink(String food);
}

class Customer implements Dinner {
    private String name;
    public Customer(String name) {
        this.name = name;
    }
    @Override
    public void eat(String food) {
        System.out.println(name + "正在吃" + food);
    }
    @Override
    public void drink(String food) {
        System.out.println(name + "正在喝" + food);
    }
}

class Customer2 implements Dinner {
    private String name;
    public Customer2(String name) {
        this.name = name;
    }
    @Override
    public void eat(String food) {
        System.out.println(name + "正在食堂吃" + food);
    }
    @Override
    public void drink(String food) {
        System.out.println(name + "正在食堂喝" + food);
    }
}
```



代码输出：

```
invoke()方法执行了
饭前洗手
李四正在食堂吃包子
饭后洗碗
invoke()方法执行了
李四正在食堂喝可乐
```



说明：

- JDK Proxy 动态代理是面向接口的动态代理，一定要有接口和实现类的存在，代理对象增强的是在实现类中实现的接口的方法
- 生成的代理对象只能转换成接口的实现类不能转换成被代理对象
  - 正确：`Dinner dinnerProxy = (Dinner) Proxy.newProxyInstance(classLoader, interfaces, handler);`
  - 错误：`Dinner dinnerProxy = (Customer) Proxy.newProxyInstance(classLoader, interfaces, handler);`
- 代理对象只能增强接口中定义的方法，实现类中其他和接口无关的方法是无法增强的
- 代理对象只能读取到接口中方法上的注解，不能读取到实现类方法上的注解



## 3.2 cglib 动态代理

引入 spring-core 包之后，就间接的引入了 cglib 这个包，否则请手动添加 maven 依赖：

```xml
<dependency>
  <groupId>cglib</groupId>
  <artifactId>cglib</artifactId>
  <version>3.3.0</version>
</dependency>
```



```java
package com.arc.spring.proxy;

import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;
// 没有引入 spring-core，手动引入 cglib 后，导入的是以下类 
// import net.sf.cglib.proxy.Enhancer;
// import net.sf.cglib.proxy.MethodInterceptor;
// import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class CglibDynamicProxy {
    public static void main(String[] args) {
        Father father = new Father();
        // 1. 获取一个 Enhancer 对象
        Enhancer enhancer = new Enhancer();
        // 2. 设置父类字节码
        enhancer.setSuperclass(father.getClass());
        // 3. 获取 MethodInterceptor 对象，用于定义增强规则
        MethodInterceptor interceptor = new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                /*
                 * Object o 生成之后的代理对象
                 * Method method 父类中原本要执行的方法（父类中的 eat()）
                 * Object[] objects 方法在调用时的传入的实参
                 * MethodProxy methodProxy 子类中重写父类的方法
                 */
                Object res = null;
                if (method.getName().equals("eat")) { // 增强 eat()
                    System.out.println("饭前洗手");
                    res = methodProxy.invokeSuper(o, objects);
                    System.out.println("饭后洗晚");
                } else { // 其他方法正常执行
                    res = methodProxy.invokeSuper(o, objects); // 子类（代理类）对象方法执行，默认调用父类被重写的方法
                }
                return res;
            }
        };
        // 4. 设置回调方法
        enhancer.setCallback(interceptor);
        // 5. 获取代理对象
        Father fatherProxy  = (Father) enhancer.create();
        // 6. 使用代理对象
        fatherProxy.eat("包子");
    }
}

// 吃早餐
class Father {
    public Father() {}
    public void eat(String food) {
        System.out.println("张三正在吃" + food);
    }
}
```



运行结果：

```
饭前洗手
张三正在吃包子
饭后洗晚
```





说明：

- cglib 动态代理模式是面向父类的，和接口没有直接关系
- 不仅可以增强接口中定义的方法，还可以增强一个类其他的方法

```java
interface A {
    void method1();
}

class B implements A {
    public void method1() {}
    public void method2() {}
}
```

在这个案例中，JDK Proxy 只能增强 method1()，而 cglib 可以增强 method1() 和 method2()，因为 cglib 生成的代理类是 Class B 的子类。

- 可以读取父类方法上的所有注解
