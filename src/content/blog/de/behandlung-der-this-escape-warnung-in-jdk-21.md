---
title: Behandlung der this-escape-Warnung in JDK 21
ogTitle: Behandlung der this-escape-Warnung in JDK 21
ogDescription: Der Artikel erklärt die neue Linter-Regel 'this-escape' in JDK
  21. Wir zeigen, warum sie eingeführt wurde und wie man die Warnung umgeht.
titleImage: /src/images/pexels-winson-ng-20057853.jpg
pubDate: 2024-08-19
authors:
  - rudi-rempel
teaser: In dem Beitrag wird der Grund und der Umgang mit der in JDK 21
  eingeführten Linter-Regel 'this-escape' besprochen. Der Beitrag soll anhand
  von Beispielen vermitteln, wieso die Regel eingeführt wurde und was bei der
  Einhaltung zu beachten ist.
---
In der JDK Version 21 wurde der Java Linter um eine neue Regel erweitert. Nach der ist es nicht erlaubt, im Konstruktor einer Klasse eine überschreibbare Methode aufzurufen. [^jdk-bug] Wird die Regel missachtet und der Java Code mit dem Flag `-Xlint:all` oder `-Xlint:this-escape` kompiliert, führt dies zur folgenden this-escape Warnung:

```java
warning: [this-escape] possible 'this' escape before subclass is fully initialized
```

In diesem Beitrag wollen wir kurz betrachten, wieso im Konstruktor keine überschreibbaren Methoden aufgerufen werden sollten. Die darauffolgenden drei Abschnitte zeigen Verfahren, die für das Auflösen der Warnung in unseren Projekten angewandt wurden.

**Hier kommt ihr gleich zu den drei Lösungswegen:**

* [Verwendung der Schlüsselwörter `final`, `private` oder `static`](#Verwendung der Schlüsselwörter `final`, `private` oder `static`)
* [Verwendung der Annotation `@PostConstruct`](#Verwendung der Annotation `@PostConstruct`)
* \[Überarbeiten des Klassendesigns](#Überarbeiten des Klassendesigns)

### Hintergrund

Die Erweiterung des Java Linters in JDK 21 um die neue Regel ist eine gute Verbesserung, da sie hilft, Code-Smell zu verhindern. Keine überschreibbaren Methoden aus dem Konstruktor aufzurufen, wird seit Langem empfohlen[^effective-java] [^java-doc]. Wie aber eine Analyse[^analyse] einiger bekannter Open-Source-Projekte zeigt, gibt es im Code dennoch immer wieder Stellen, an denen die Empfehlung missachtet oder vergessen wurde. Auch bei unseren Projekten konnte der Java Linter nach dem Upgrade auf JDK 21 vereinzelt Stellen finden, die nicht der Empfehlung folgten.

**Es wird im Folgenden vorausgesetzt, dass der abgebildete Code immer mit dem Flag `-Xlint:all` kompiliert wird, auch wenn dies nicht extra angegeben wurde. Abrufbar ist der vollständige Code im dafür bereitgestellten [GitHub-Repository](https://github.com/cronn/this-escape-blog-post-example/).**

### Origin Story

Nachfolgend soll die Rationale für die `this-escape`-Warnung anhand eines Beispiels erläutert werden. Dazu schauen wir uns als Beispiel die Klasse `Person` an, siehe unten. Die Klasse hat eine Instanzvariable `name` und eine öffentliche nicht finale Methode `greet()`. Im Konstruktor der Klasse wird die Methode `greet()` aufgerufen. Der Code lässt sich mit JDK 17 problemlos kompilieren, aber beim Kompilieren mit JDK 21 gibt der Java Linter eine `this-escape`-Warnung aus.

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

Die Klasse `Person` für sich ist unproblematisch, aber sobald die Klasse erweitert wird, kann es zu schwer auffindbaren Fehlern führen. Davor warnt der Java Linter mit der `this-escape`-Warnung. Um einen Fehler provozieren zu können, erstellen wir zusätzlich die Klasse `Musician`, die die Klasse `Person` erweitert. Die Klasse `Musician` fügt eine weitere Instanzvariable `instrument` hinzu und überschreibt die Methode `greet()`.

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

Was wird nun ausgegeben, wenn ein neues Objekt `Musician` mit der Anweisung `new Musician("Jimi", "guitar")` erstellt wird? Beim Erstellen einer Instanz von `Musician` wird im Konstruktor von `Musician` der Konstruktor von `Person` aufgerufen. Im Konstruktor von `Person` erfolgt die Initialisierung der Instanzvariable `name` und dann der Aufruf der Methode `greet()`. Anschließend wird im Konstruktor der Klasse `Musician` die Variable `instrument` initialisiert. Die Anweisung führt entsprechend zu der folgenden Ausgabe:

```
Hello Jimi!
I heard you play null. Awesome!
```

Die überschriebene Methode `greet()` wird aus `Person` aufgerufen, noch bevor `Musician` vollständig instanziiert wurde. Dies führt dazu, dass für `instrument` der Wert `null` ausgegeben wird, obwohl `instrument` nach Instanziierung des Objekts `Musician` nie den Wert `null` haben kann. Die Ursache für die fehlerhafte Ausgabe ist in dem Beispiel schnell ersichtlich. Dennoch zeigt es, dass eine Klasse keine überschreibbaren Methoden der eigenen Klasse im Konstruktor aufrufen sollte, da die Klasse nicht sicherstellen kann, dass sie sich beim Aufrufen der Methode in einem konsistenten Zustand befindet. Demnach sollte die Methode `greet()` also nicht gleichzeitig überschreibbar sein und vom Konstruktor aufgerufen werden.

Zu beachten ist, dass der Fehler in diesem Beispiel offensichtlich sein mag. Wir haben hier ein einfaches Beispiel betrachtet, um den Sachverhalt zu erläutern. In der Praxis kann der Fehler in einer umfangreichen Klasse innerhalb einer komplexen Klassenhierarchie mit weiteren Vererbungen und Verschachtelungen in Zusammenhang mit Nebenläufigkeit erheblich schwieriger zu lokalisieren sein.

### Drei Lösungswege

In den folgenden drei Abschnitten werden Möglichkeiten vorgestellt, wie das Aufrufen einer überschreibbaren Methode aus dem Konstruktor verhindert oder umgangen werden kann.

<a id="Verwendung der Schlüsselwörter `final`, `private` oder `static`"></a>

#### Verwendung der Schlüsselwörter `final`, `private` oder `static`

Die direkteste Möglichkeit, die `this-escape`-Warnung zu verhindern, ist das Überschreiben aller vom Konstruktor aufgerufenen Methoden zu verbieten. Dies ist in Java mit den Schlüsselwörtern `final`, `private` und `static` erreichbar. Wird eine Klasse als `final` deklariert, ist es nicht mehr möglich, diese zu erweitern. Dementsprechend ist auch keiner ihrer Methoden überschreibbar. Die Deklaration einer Methode als `final`, `private` oder `static` sorgt dafür, dass nur die Methode nicht überschrieben werden kann.

Die fehlerhafte Ausgabe der Klasse `Person` und `Musician` aus dem letzten Abschnitt können wir mithilfe der Schlüsselwörter auf unterschiedliche Weise beheben. Im Folgenden wird zunächst die Methode `greet()` von `Person` als `final` deklariert, um den Java Linter zufriedenzustellen.

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

Die Klasse `Musician` kann nun nicht mehr die Methode `greet()` überschreiben. Stattdessen wird in der Klasse `Musician` eine eigene Methode `printInstrument()` definiert, die für die Ausgabe des Instruments verantwortlich ist. In dem Beispiel wird davon ausgegangen, dass Klasse `Musician` von keiner anderen Klasse erweitert werden soll, daher fügen wir das Schlüsselwort `final` zu der Deklaration der Klasse hinzu. Andernfalls würde uns der Java Linter auch hier eine `this-escape`- Warnung ausgeben.

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

Nach den Änderungen führt die Anweisung `new Musician("Jimi", "guitar")` zu der folgenden Ausgabe:

```
Hello Jimi!
I heard you play guitar! Awesome!
```

Nicht immer ist es möglich, eine Klasse als `final` oder eine Methode als `final`, `private` oder `static` zu deklarieren. Falls die Klasse von einem Dependency Injection Framework, wie Spring oder Quarkus, verwaltet wird, kann der Aufruf von überschreibbaren Methoden aus dem Konstruktor meist auch auf eine andere Weise umgangen werden. Diese schauen wir uns im nächsten Abschnitt an.

<a id="Verwendung der Annotation `@PostConstruct`"></a>

#### Verwendung der Annotation `@PostConstruct`

In den nachfolgenden Beispielen verwenden wir Spring. Das Verfahren ist aber genauso für andere Dependency Injection Frameworks anwendbar, welche die *Jakarta Contexts and Dependency Injection* Spezifikation bzw. die *Jakarta Annotations* Spezifikation implementieren. Teil der *Jakarta Annotations* Spezifikation ist die Annotation `@PostContruct`, welche wesentlich für das hier vorgestellte Verfahren ist. Mithilfe der Annotation können wir uns in den Lebenszyklus einer von Spring verwalteten Bean einklinken. Wie es der Name bereits vermuten lässt, ist es in dem Fall von `@PostConstruct` der Zeitpunkt, nachdem der Konstruktor ausgeführt und die Bean vollständig initialisiert wurde. Dies ermöglicht es, den Aufruf einer überschreibbaren Methode aus dem Konstruktor heraus an eine sichere Stelle zu verschieben. Spring bietet noch andere Möglichkeiten, eigenen Code in den Lebenszyklus einer Bean einzufügen, aber die Verwendung von `@PostConstruct` ist die empfohlene[^spring-lifecycle], weshalb hier nur auf diese eingegangen wird.

Wir erweitern das Beispiel aus dem vorherigen Abschnitt, um die Verwendung von `@PostConstruct` veranschaulichen zu können. In dem vorherigen Beispiel wurde jedem Musiker das Instrument *triangle* zugeordnet, wenn kein Instrument angegeben wurde. Das wollen wir nachfolgend ein wenig optimieren, indem wir ermöglichen, eine externe Ressource anzubinden. Diese soll ein Mapping zwischen bekannten Musikern, repräsentiert durch ihren Namen, und ihrem Instrument bereitstellen. Für einen schnelleren Zugriff ist das Mapping in einem Cache zu speichern. Die Verwendung des Caches ist im folgenden Listing schematisch dargestellt:

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

Für die Umsetzung erstellen wir zwei Klassen. Die abstrakte Klasse `MusicianInstrumentCache` beinhaltet einen einfachen Cache, der als eine `Map` mit der Abbildung Musikername ⟼ Instrument realisiert wurde, und ruft im Konstruktor die Methode `updateCache()` auf. Die Methode `updateCache()` soll von den Spezialisierungen von `MusicianInstrumentCache` (s.u.) dazu verwendet werden, eine externe Ressource einzulesen und den Cache zu aktualisieren. Für die Methode `updateCache()` gilt:

* Der Aufruf der Methode soll es anderen Klassen ermöglichen, den Cache zur Laufzeit zu aktualisieren. Daher soll die Methode öffentlich sein.
* Für unterschiedliche Typen von Ressourcen, wie externe Dateien, Datenbanken usw., sollen verschiedene Spezialisierungen von `MusicianInstrumentCache` erstellt werden können, welche die Methode `updateCache()` entsprechend der eingesetzten Ressource überschreiben. Daher soll die Methode abstrakt sein und kann nicht als `private`, `final` oder `static` deklariert werden.

Die Implementierung der abstrakten Klasse `MusicianInstrumentCache` ist nachfolgend angegeben. Der Linter gibt eine `this-escape`-Warnung beim Kompilieren der Klasse aus, da im Konstruktor die abstrakte Methode `updateCache()` aufgerufen wird.

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

Bevor wir uns dem Problem widmen, betrachten wir eine Spezialisierung der Klasse `MusicianInstrumentCache`. Die Klasse `FileBasedMusicianInstrumentCache` zeigt eine mögliche Spezialisierung von `MusicianInstrumentCache`. Die Klasse soll das Mapping über den von Spring injizierten `ResourceLoader` aus einer Datei einlesen und anschließend in den Cache schreiben. Um das Beispiel kurzzuhalten, wurde das Einlesen der Datei und das Schreiben in den Cache in dem Code nur angedeutet.

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

Zu beachten ist, dass der `resourceLoader` noch nicht gesetzt wurde, wenn im Konstruktor der Klasse `MusicianInstrumentCache` die Methode `updateCache()` der Klasse `FileBasedMusicianInstrumentCache` aufgerufen wird. Das liegt daran, dass wie im Abschnitt *Origin Story* beschrieben im Konstruktor der erweiternden Klasse `FileBasedMusicianInstrumentCache` als erste Anweisung der Konstruktor der Klasse `MusicianInstrumentCache` aufgerufen wird, selbst wenn der Aufruf über `super()` nicht explizit im Java Code angegeben wurde. Dies ist auch in der Ausgabe ersichtlich, bei der *FileBasedMusicianInstrumentCache.updateCache()* vor *FileBasedMusicianInstrumentCache.init()* in die Konsole geschrieben wird:

```
MusicianInstrumentCache.init()
FileBasedMusicianInstrumentCache.updateCache()
FileBasedMusicianInstrumentCache.init()
```

Glücklicherweise lässt sich der Fehler und die `this-escape`-Warnung mit der Annotation `@PostConstruct` ohne größere Anpassungen beheben, sodass nicht mehr die überschreibbare Methode `updateCache()` aufgerufen wird, bevor das Objekt vollständig initialisiert wurde. Es genügt, die Methode `updateCache()` in der Klasse `MusicianInstrumentCache` mit `@PostConstruct` zu annotieren. Der Aufruf der Methode `updateCache()` kann aus dem Konstruktor entfernt werden, da Spring jetzt für den Aufruf verantwortlich ist. Die Klasse `FileBasedMusicianInstrumentCache` kann unverändert bleiben, da Spring prüft, ob in einer Superklasse eine Methode mit `@PostConstruct` annotiert ist und das Verhalten für die Unterklassen übernimmt.

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

Beim Starten der Anwendung wird nun zunächst beim Initialisieren der Klasse `FileBasedMusicianInstrumentCache` wie bisher der Konstruktor `MusicianInstrumentCache` aufgerufen, aber in dem Konstruktor wird nicht mehr die Methode `updateCache()` aufgerufen, sondern stattdessen zunächst der Konstruktor von `FileBasedMusicianInstrumentCache` abgeschlossen. Erst nachdem `FileBasedMusicianInstrumentCache` vollständig konstruiert wurde, ruft Spring die mit `@PostConstruct` annotierte Methode `updateCache()` auf. Dies führt zu der folgenden Ausgabe:

```
MusicianInstrumentCache.init()
FileBasedMusicianInstrumentCache.init()
FileBasedMusicianInstrumentCache.updateCache()
```

Das Vorgehen mit `@PostConstruct` ermöglicht die Verwendung von überschreibbarer Methode an die Erstellung des Objekts zu koppeln, ohne die Probleme, die beim Aufruf aus dem Konstruktor heraus resultieren können. Dies setzt allerdings voraus, dass ein Dependency Injection Framework verwendet wird, welches die Annotation `@PostConstruct` oder vergleichbares unterstützt.

In den vorherigen beiden Abschnitten wurden Vorgehen beschrieben, um den Linter durch kleine Kniffe wieder zufriedenzustellen. In dem nächsten Abschnitt betrachten wir noch eine andere Möglichkeit, mit der Warnung umzugehen.

<a id="Überarbeiten des Klassendesigns"></a>

#### Überarbeiten des Klassendesigns

Manchmal kann die `this-escape`-Warnung auch als Anregung dienen, das Klassendesign erneut zu evaluieren. Je nach Ergebnis der Evaluation können die durchzuführenden Änderungen einen größeren Einfluss auf die Struktur des Codes haben, als es bei den beiden anderen Verfahren der Fall war. Wir greifen das Beispiel aus dem vorherigen Abschnitt auf, um aufzuzeigen, wie eine Anpassung des Klassendesigns aussehen könnte.

In dem letzten Abschnitt wurden die beiden Klassen `MusicianInstrumentCache` und `FileBasedMusicianInstrumentCache` erstellt, wobei letztere die erstere erweiterte. Durch die Vererbung musste die Methode `updateCache()` öffentlich und überschreibbar sein, was schließlich zu der `this-escape`-Warnung geführt hat. Das Klassendesign soll im Folgenden eine Komposition statt einer Vererbung verwenden.

Die Funktionalität der Klasse `MusicianInstrumentCache` wird dazu aufgeteilt. Das Verwalten des Cache wird weiterhin Aufgabe der Klasse `MusicianInstrumentCache` bleiben. Das Einlesen einer externen Ressource wird in die Klasse `FileBasedMusicianInstrumentImporter` ausgelagert. Die Klasse `FileBasedMusicianInstrumentImporter` erhält außerdem eine Referenz auf eine Instanz der Klasse `MusicianInstrumentCache`. Unten ist das alte, auf Vererbung basierende Klassendesign, dem neuen Klassendesign in einem UML-Klassendiagramm gegenübergestellt.

```
Vererbung                             Komposition
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

Das nachfolgende Listing zeigt den Code der neuen Klasse `MusicianInstrumentCache`. Die Klasse besitzt zwei Methoden, jeweils eine für das Auslesen und Schreiben des Cache. `MusicianInstrumentCache` wurde mit `@Component` annotiert, da es vom Dependency Injection Framework verwaltet und in `FileBasedMusicianInstrumentImporter` injiziert werden soll.

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

Der Code der Klasse `FileBasedMusicianInstrumentImporter` ist im folgenden Listing dargestellt. Die Annotation `@PostConstruct` wird nicht mehr benötigt. Es reicht nun aus, die Klassen als `final` zu deklarieren.

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

Das Beispiel soll einen Eindruck liefern, wie eine Überarbeitung des Klassendesigns aussehen könnte. Dies muss jedoch nicht immer eine Umstellung von Vererbung nach Komposition beinhalten. Möglich wäre etwa auch das Extrahieren/Verschieben von Methoden oder die Anwendung eines Erzeugermusters, um den Aufruf einer überschreibbaren Methode aus dem Konstruktor aufzulösen.

An dieser Stelle haben wir alle Verfahren betrachtet, die beim Upgrade unseres Projekts angewendet wurden. Der nächste Abschnitt fasst noch mal die wesentlichen Punkte dieses Beitrags zusammen.

### Zusammenfassung

In diesem Beitrag wurde die Motivation hinter der `this-escape`-Warnung des Java Linters beschrieben und drei Möglichkeiten gezeigt, die Warnungen zu verhindern. Die Möglichkeiten sind nachfolgend aufgelistet:

1. Verwendung der Schlüsselwörter `final`, `private` oder `static`
2. Verwendung der Annotation `@PostConstruct`
3. Überarbeitung des Klassendesigns

Nicht immer ist jedes Verfahren anwendbar. Manchmal ist auch eine Kombination verschiedener Verfahren nötig, um die Warnung zu beheben. Welcher Umgang mit der Warnung am besten geeignet ist, muss von Fall zu Fall entschieden werden. Meistens sollte das erste oder zweite Verfahren jedoch ausreichen. Die Anwendung des zweiten Verfahrens setzt allerdings voraus, dass die betroffene Klasse durch ein Dependency Injection Framework wie Spring oder Quarkus verwaltet wird. Das Überarbeiten des Klassendesigns sollte immer zum Erfolg führen, kann allerdings auch am meisten Zeit in Anspruch nehmen.

### Referenzen

[^jdk-bug]: [Add lint check for calling overridable methods from a constructor](https://bugs.openjdk.org/browse/JDK-8015831)

[^effective-java]: Joshua Bloch. 2001. Effective Java programming language guide. Sun Microsystems, Inc., USA.

[^java-doc]: [Writing Final Classes and Methods](https://docs.oracle.com/javase/tutorial/java/IandI/final.html)

[^analyse]: [Calling Methods from a Constructor](https://www.javaspecialists.eu/archive/Issue210-Calling-Methods-from-a-Constructor.html)

[^spring-lifecycle]: [Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/6.0/core/beans/factory-nature.html#beans-factory-lifecycle)
