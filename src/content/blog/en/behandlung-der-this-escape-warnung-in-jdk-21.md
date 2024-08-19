---
ogTitle: Handling of the 'this-escape' warning in JDK 21
excerpt: The article explains the new linter rule `this-escape` in JDK 21. We
  show why it was introduced and how to stop receiving this warning.
ogDescription: The article explains the new linter rule `this-escape` in JDK 21.
  We show why it was introduced and how to stop receiving this warning.
titleImage: /src/images/pexels-winson-ng-20057853.jpg
feature-image: /img/posts/this-escape/feature-img.jpg
pubDate: 2024-08-19
authors:
  - rudi-rempel
layout: post
sub-title: This article discusses the reason for and handling of the
  'this-escape' linter rule, introduced in JDK 21. The article uses examples to
  explain why the rule was introduced and what needs to be considered when
  applying it.
lang: en
date: 2024-08-13
title: Behandlung der this-escape-Warnung in JDK 21
teaser: This article discusses the reason for and handling of the 'this-escape'
  linter rule, introduced in JDK 21. The article uses examples to explain why
  the rule was introduced and what needs to be considered when applying it.
lang-ref: this-escape
preview-image: /img/posts/this-escape/preview-img.jpg
categories:
  - java
---

JDK version 21 introduced a new rule to the Java linter. According to this rule it is not permitted to call an overridable method within the constructor of a class [^jdk-bug]. If this rule is disregarded and the Java code compiled using the <span style="white-space: pre;">`-Xlint:all`</span> or <span style="white-space: pre;">`-Xlint:this-escape`</span> flag, this leads to the following `this-escape` warning:

```
warning: [this-escape] possible `this` escape before subclass is fully initialized
```

**You can jump to the three approaches here:**

* [Using the keywords `final`, `private` or `static`](#Using the keywords `final`, `private` or `static`)

* [Usage of the annotation `@PostConstruct`](#Usage of the annotation `@PostConstruct`)

* [Revise the class design](#Revise the class design)

### Background
The addition of the new rule to the Java linter in JDK 21 is a good improvement as it helps prevent code smell. It has long been recommended to avoid calling overridable methods from the constructor [^effective-java] [^java-doc]. However, as an analysis [^analysis] of some well-known open source projects shows, there are still places in the code where the recommendation is forgotten or ignored. Even in our own projects the upgraded Java linter was also able to find a few places that did not follow the recommendation.

In this article, we will briefly look at why no overridable methods should be called in the constructor. The following three sections show approaches  that were used to resolve the warning in our projects.

**In the following, it is assumed that the code shown is always compiled with the flag <span style="white-space: pre;">`-Xlint:all`</span>, even if this was not explicitly specified. The complete code is available in this [GitHub repository](https://github.com/cronn/this-escape-blog-post-example/).**

### Origin Story
The rationale for the `this-escape` warning is explained below. Using an example, let's take a look at the class `Person`. The class has an instance variable `name` and a public non-final method `greet()`. The `greet()` method is called in the constructor of the class. The code compiles fine with JDK 17, but when compiling with JDK 21, the Java linter issues a `this-escape` warning.

```java
public class Person {

    private final String name;

    public Person(String name) {
        this.name = Objects.requireNonNullElse(name, "stranger");
        greet(); // Calls overrideable method, causes this-escape warning
    }

    public void greet() {
        System.out.println("Hello " + name + "!");
    }
}
```

The `Person` class itself is unproblematic, but as soon as the class is extended, it can lead to errors that are difficult to find. The Java linter warns of this with the `this-escape` warning. To be able to provoke an error, we also create the class `Musician` as an extension of the class `Person`. The class `Musician` adds another instance variable, `instrument`, and overrides the method `greet()`.

```java
public class Musician extends Person {

    private final String instrument;

    public Musician(String name, String instrument) {
        super(name);
        this.instrument = Objects.requireNonNullElse(instrument, "triangle");
    }

    @Override
    public void greet() {
        super.greet();
        System.out.println("I heard you play " + instrument + ". Awesome!");
    }
}
```

What is now being output when a new `Musician` object is created with the `new Musician("Jimi", "guitar")` statement? When an instance of `Musician` is created, the constructor of `Person` is called in the constructor of `Musician`. In the constructor of `Person`, the instance variable `name` is initialized and then the method `greet()` is called. The variable `instrument` is then initialized within the constructor of the class `Musician`. The statement results in the following output:

```
Hello Jimi!
I heard you play null. Awesome!
```

The overridden method `greet()` is called from `Person` even before `Musician` has been fully instantiated. This results in the value `null` being output for `instrument`, although `instrument` can never have the value `null` after instantiation of the object `Musician`. The reason for the incorrect output is quickly apparent in the example. Nevertheless, it shows that a class should not call any overridable methods of its own class in the constructor, as the class cannot ensure that it is in a consistent state when the method is called. It follows that the `greet()` method should not be both overridable and called by the constructor at the same time.

It should be noted that the error in this example seems obvious as we have looked at a simple example to explain the situation. In practice, the error in an extensive class within a complex class hierarchy with further inheritance and nesting in connection with concurrency can be considerably more difficult to locate.

### Three approaches
The following three sections present ways of preventing or circumventing the calling of an overridable method from the constructor.

<a id="Using the keywords `final`, `private` or `static`"></a>

#### Using the keywords `final`, `private` or `static`
The most direct way to prevent the `this-escape` warning is to prohibit the overwriting of all methods called by the constructor. This can be achieved in Java with the keywords `final`, `private`, and `static`. If a class is declared as `final`, it is no longer possible to extend it. Accordingly, none of its methods can be overwritten. The declaration of a method as `final`, `private` or `static` ensures that it is the method alone which cannot be overwritten.

We can use these keywords  to fix the incorrect output of the `Person` and `Musician` classes from the last section in various ways. In the following, we first declare the `greet()` method of `Person` as `final` to satisfy the Java linter.

```java
public class Person {

    private final String name;

    public Person(String name) {
        this.name = Objects.requireNonNullElse(name, "stranger");
        greet();
    }

    public final void greet() { // Method is now final
        System.out.println("Hello " + name + "!");
    }
}
```

This makes it so that the `Musician` class can no longer overwrite the `greet()` method. Instead, a separate method `printInstrument()` is defined in the `Musician` class, which is now responsible for the output of the instrument. For this approach to work, we must define that the class `Musician` should not be extended by any other class, so we add the keyword `final` to the declaration of the class – otherwise, the Java linter would give us a `this-escape` warning here too.

```java
public final class Musician extends Person { // Class is now final

    private final String instrument;

    public Musician(String name, String instrument) {
        super(name);
        this.instrument = Objects.requireNonNullElse(instrument, "triangle");
        printInstrument();
    }

    public void printInstrument() {
        System.out.println("I heard you play " + instrument + ". Awesome!");
    }
}
```

After the changes, the statement `new Musician("Jimi", "guitar")` leads to the following output:

```
Hello Jimi!
I heard you play guitar! Awesome!
```

However, it is not always possible to declare a class as `final` or method as `final`, `private`, or `static`. If the class is managed by a dependency injection framework, such as Spring or Quarkus, the call of overridable methods from the constructor can usually be bypassed in another way. We will look at these in the next section.


<a id="Usage of the annotation `@PostConstruct`"></a>

#### Usage of the annotation `@PostConstruct`
Although we will be using Spring in the following examples, the approach can also be used for other dependency injection frameworks that implement the _Jakarta Contexts and Dependency Injection_ specification or the _Jakarta Annotations_ specification. Part of the _Jakarta Annotations_ specification is the annotation `@PostContruct`, which is essential for the approach presented here. Using the annotation, we can link into the life cycle of a bean managed by Spring. In the case of `@PostConstruct` this happens, as the name suggests, after the constructor has been executed and the bean has been fully initialized. This makes it possible to move the call of an overridable method from the constructor to a safe place. Spring offers other ways to insert custom code into the lifecycle of a bean, but the use of `@PostConstruct` is the recommended [^spring-lifecycle], so only this will be discussed here.

In order to illustrate the use of `@PostConstruct`, let us extend our earlier example. In the previous example, the instrument _triangle_ was assigned to each musician if no instrument was specified. We want to optimize this a little by making it possible to connect an external resource. This should provide a mapping between known musicians, represented by their name, and their instrument. The mapping should be saved in a cache for faster access. The use of the cache is shown schematically in the following listing:

```java
String name = getName(); // Get name of a musician from somewhere
String instrument = getInstrument(); // Get instrument from somewhere
if (instrument == null) {
    /*
         musicianInstrumentCache contains a mapping of the form:
         Jimi -> guitar
         Miles -> trumpet
         Ludwig -> piano
         ...
    */
    instrument = musicianInstrumentCache.getInstrumentFor(name);
}
Musician musician = new Musician(name, instrument);
```


We create two classes for the implementation. The abstract class `MusicianInstrumentCache` contains a simple cache, which was realized as a `Map` with the mapping musician name ⟼ instrument, and calls the method `updateCache()` in the constructor. The `updateCache()` method is to be used by the specializations of `MusicianInstrumentCache` (see below) to read in an external resource and update the cache. The following applies to the `updateCache()` method:

* Calling the method should enable other classes to update the cache at runtime . The method should therefore be public.

* For different types of resources, such as external files, databases, etc., it should be possible to create different specializations of `MusicianInstrumentCache`, which override the `updateCache()` method in line with the resource used. Therefore, the method should be abstract and cannot be declared as `private`, `final`, or `static`.

The implementation of the abstract class `MusicianInstrumentCache` is given below. The linter issues a `this-escape` warning when the class is compiled, as the abstract method `updateCache()` is called in the constructor.

```java
public abstract class MusicianInstrumentCache {

    protected static final Map<String, String> cache =
            new ConcurrentHashMap<>();

    public MusicianInstrumentCache() {
        System.out.println("MusicianInstrumentCache.init()");
        updateCache(); // Calls overrideable method, causes this-escape warning
    }

    public abstract void updateCache(); // Should be public and abstract

    public String getInstrumentFor(String name) {
        return cache.get(name);
    }
}
```

Before we address the problem, let's look at a specialization of the class `MusicianInstrumentCache`. The class `FileBasedMusicianInstrumentCache` shows a possible specialization of `MusicianInstrumentCache`. The class should read the mapping from a file via the Spring-injected `ResourceLoader`, then proceed to write it to the cache. To keep the example short, the reading of the file and the writing to the cache is only implied in the code.


```java
@Component
public class FileBasedMusicianInstrumentCache extends MusicianInstrumentCache {

    private final ResourceLoader resourceLoader;
    private String mappingResource = "classpath:mapping.csv";

    public FileBasedMusicianInstrumentCache(ResourceLoader resourceLoader) {
        System.out.println("FileBasedMusicianInstrumentCache.init()");
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void updateCache() {
        System.out.println("FileBasedMusicianInstrumentCache.updateCache()");
        // Logic for importing mapping and adding it to the cache. Briefly,
        // represented by the following lines without exception handling:
        Resource resource = resourceLoader.getResource(mappingResource);
        String content = resource.getContentAsString(StandardCharsets.UTF_8);
        Arrays.stream(content.split("\n"))
                .map(line -> line.split(","))
                .forEach(mapping -> cache.put(mapping[0], mapping[1]));
    }

    // getter and setter
}
```

It should be noted that if the `updateCache()` method of the `FileBasedMusicianInstrumentCache` class is called in the constructor of the `MusicianInstrumentCache` class, then the `resourceLoader` has not yet been set. This is because, as described in the section _Origin Story_, the constructor of the extending class `FileBasedMusicianInstrumentCache` calls the constructor of the class `MusicianInstrumentCache` as the first statement, even if the call via `super()` was not explicitly specified in the Java code. This can also be seen in the output, where _FileBasedMusicianInstrumentCache.updateCache()_ is written to the console before _FileBasedMusicianInstrumentCache.init()_:

```
MusicianInstrumentCache.init()
FileBasedMusicianInstrumentCache.updateCache()
FileBasedMusicianInstrumentCache.init()
```

Fortunately, the error and the `this-escape` warning can be fixed with the annotation `@PostConstruct` without major adjustments, so that the overridable method `updateCache()` is no longer called before the object has been completely initialized. It is sufficient to annotate the `updateCache()` method in the `MusicianInstrumentCache` class with `@PostConstruct`. The call of the method `updateCache()` can be removed from the constructor, as Spring is now responsible for the call. The class `FileBasedMusicianInstrumentCache` can remain unchanged, as Spring checks whether a method with `@PostConstruct` is annotated in a superclass and adopts the behaviour for the subclasses.

```java
public abstract class MusicianInstrumentCache {

    protected static final Map<String, String> cache =
            new ConcurrentHashMap<>();

    public MusicianInstrumentCache() {
        System.out.println("MusicianInstrumentCache.init()");
        // Remove importMapping() method call here
    }

    @PostConstruct // Add annotation
    public abstract void updateCache();

    public String getInstrumentFor(String name) {
        return cache.get(name);
    }
}
```

When the application is started, the constructor `MusicianInstrumentCache` is still called when the class `FileBasedMusicianInstrumentCache` is initialized, but the method `updateCache()` is no longer called in the constructor; instead, the constructor of `FileBasedMusicianInstrumentCache` is completed first. Only after `FileBasedMusicianInstrumentCache` has been completely constructed does Spring call the `updateCache()` method annotated with `@PostConstruct`. This results in the following output:

```
MusicianInstrumentCache.init()
FileBasedMusicianInstrumentCache.init()
FileBasedMusicianInstrumentCache.updateCache()
```

The procedure with `@PostConstruct` makes it possible to link the use of overridable methods to the creation of the object without the problems that may result when calling from the constructor. However, this requires the use of a dependency injection framework that supports the annotation `@PostConstruct`.

The previous two sections described two small tweaks to  satisfy the linter. In the next section we will look at another way of dealing with the warning.

<a id="Revise the class design"></a>

#### Revise the class design
Sometimes the `this-escape` warning can also serve as a suggestion to re-evaluate the class design. Depending on the result of the evaluation, the necessary changes may have a greater impact on the structure of the code than was the case with the other two methods. We once again take up the example from the previous section to show what an adaptation of the class design could look like.

In the last section, the two classes `MusicianInstrumentCache` and `FileBasedMusicianInstrumentCache` were created, with the latter extending the former. Due to inheritance, the method `updateCache()` had to be public and overridable, which ultimately led to the `this-escape` warning. In the following, the class design should use composition instead of inheritance.

The functionality of the class `MusicianInstrumentCache` is split for this purpose. The management of the cache will remain the task of the class `MusicianInstrumentCache`. The import of an external resource is outsourced to the class `FileBasedMusicianInstrumentImporter`. The class `FileBasedMusicianInstrumentImporter` also receives a reference to an instance of the class `MusicianInstrumentCache`. Below, the old, inheritance-based class design is compared to the new class design in a UML class diagram.

```
Inheritance                           Composition
=========                             ===========
┌────────────────────────────────┐   ┌────────────────────────────────────────┐
│           <abstract>           │   │                                        │
│    MusicianInstrumentCache     │   │        MusicianInstrumentCache         │
├────────────────────────────────┤   ├────────────────────────────────────────┤
│#cache:Map<String,String>       │   │-cache:Map<String,String>               │
├────────────────────────────────┤   ├────────────────────────────────────────┤
│+importMapping():void <abstract>│   │~put(name:String,instrument:String):void│
│+getInstrumentFor(String):String│   │+getInstrumentFor(String):String        │
└────────────────────────────────┘   └────────────────────────────────────────┘
                 ▲                                       ^
                 │                                       │
                 │                                       │ -cache
                 │                                       │
┌────────────────┴───────────────┐   ┌───────────────────┴────────────────────┐
│FileBasedMusicianInstrumentCache│   │  FileBasedMusicianInstrumentImporter   │
├────────────────────────────────┤   ├────────────────────────────────────────┤
│-resourceLoader:ResourceLoader  │   │-resourceLoader:ResourceLoader          │
├────────────────────────────────┤   ├────────────────────────────────────────┤
│+importMapping():void           │   │+importMapping():void                   │
└────────────────────────────────┘   └────────────────────────────────────────┘
```

The following listing shows the code of the new class `MusicianInstrumentCache`. The class has two methods, one for reading and one for writing the cache. `MusicianInstrumentCache` was annotated with `@Component`, as it is managed by the Dependency Injection Framework, and is to be injected into `FileBasedMusicianInstrumentImporter`.

```java
@Component
public class MusicianInstrumentCache {

    private final Map<String, String> cache = new ConcurrentHashMap<>();

    void put(String name, String instrument) {
        cache.put(name, instrument);
    }

    public String getInstrumentFor(String name) {
        return cache.get(name);
    }
}
```

The code of the class `FileBasedMusicianInstrumentImporter` is shown in the following listing. The annotation `@PostConstruct` is no longer required as it is now sufficient to declare the class  as `final`.

```java
@Component
public final class FileBasedMusicianInstrumentImporter {

    private final MusicianInstrumentCache cache;
    private final ResourceLoader resourceLoader;
    private String mappingResource = "classpath:mapping.csv";

    public FileBasedMusicianInstrumentImporter(MusicianInstrumentCache cache,
                                               ResourceLoader resourceLoader) {
        this.cache = cache;
        this.resourceLoader = resourceLoader;
        importMapping();
    }

    public void importMapping() {
        // Logic for importing mapping and adding it to the cache. Briefly,
        // represented by the following lines without exception handling:
        Resource resource = resourceLoader.getResource(mappingResource);
        String content = resource.getContentAsString(StandardCharsets.UTF_8);
        Arrays.stream(content.split("\n"))
                .map(line -> line.split(","))
                .forEach(mapping -> cache.put(mapping[0], mapping[1]));
    }

    // getter and setter
}
```

The example is intended to provide an impression of what a revision of the class design could look like. However, this does not always have to involve a switch from inheritance to composition. It could also involve extracting/moving methods, or using a creational pattern  to resolve the call of an overridable method from the constructor.

At this point, we have looked at all the approaches  that were used to upgrade our project. The next section summarizes the main points of this article.

### Summary
In this post, we described the motivation behind the Java linter's `this-escape` warning and showed three ways to prevent said warnings. The possibilities are listed below:

1. Use of the keywords `final`, `private`, or `static`;
2. Use of the annotation `@PostConstruct`;
3. Revision of the class design

It is not always the case that all three approaches are applicable. Sometimes a combination of multiple approaches is necessary to resolve the warning. The best way to deal with the warning must be decided on a case-by-case basis. In most cases the first or second approach should be sufficient; however, the use of the second approach requires that the affected class is managed by a dependency injection framework such as Spring or Quarkus. Reworking the class design should always lead to success, but is also the most time-consuming.

### References
[^jdk-bug]: [Add lint check for calling overridable methods from a constructor](https://bugs.openjdk.org/browse/JDK-8015831)

[^effective-java]: Joshua Bloch. 2001. Effective Java programming language guide. Sun Microsystems, Inc., USA.

[^java-doc]: [Writing Final Classes and Methods](https://docs.oracle.com/javase/tutorial/java/IandI/final.html)

[^analysis]: [Calling Methods from a Constructor](https://www.javaspecialists.eu/archive/Issue210-Calling-Methods-from-a-Constructor.html)

[^spring-lifecycle]: [Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/6.0/core/beans/factory-nature.html#beans-factory-lifecycle)
