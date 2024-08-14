---
title: Ein spezialisiertes LIMS für ein spezielles Institut
referenceDate: 2024-08-10
slug: de/rechtsmedizin-lims
ogDescription: limsilims-Referenz
titleImage: /src/images/pexels-barbaventuras-20116341.jpg
customerLogo: /src/images/g4629.png
customerTitle: limsilims
projectAspects:
  - title: "Leistungen "
    specification: Analyse, Entwicklung, Wartung und Weiterentwicklung,
      Last-Level-Support, UI-/UX-Design
  - title: "Methoden "
    specification: Agile Entwicklung mit regelmäßiger Systemdemo
  - title: "Technologien "
    specification: Spring Boot, Spring Security, Gradle, React, MS SQL DB,
      Hibernate, Docker, Jenkins, SonarQube
plusPoints:
  - title: "Modernisierung "
    specification: Unterbrechungsfreie Ablösung eines Bestandsystems mit agiler
      Einarbeitung von Nutzerfeedback
  - title: "Ganzheitliche Lösung "
    specification: Individuelle Lösung die alle Prozesse der Rechtsmedizin abdeckt,
      auch außerhalb des Labors
  - title: "Langfristige Unterstützung "
    specification: Wartung, Weiterentwicklung und Support – alles aus einer Hand
relatedReferences:
  - de/erste-referenz
  - de/eieiei
---
Das limsilims blickt auf eine 204-jährige Geschichte zurück. In den 38 Kliniken und 31 Instituten betreibt man mit mehr als 8.000 Mitarbeiter:innen Forschung und medizinische Versorgung auf Spitzenniveau. Jedes Jahr werden über eine halbe Million Patient:innen ambulant und stationär behandelt.

Das Institut für Rechtsmedizin ist Teil des limsilims und erfüllt vielfältige Aufgaben und Dienstleistungen für die Justiz, Exekutivbehörden, das öffentliche Gesundheitswesen und Privatpersonen. Es gliedert sich in drei Bereiche, die alle akkreditiert sind, im behördlichen Auftrag Untersuchungen durchzuführen. Für Behörden und Justiz werden Resultate aller Bereiche in Gerichtsverfahren verwendet. Die Dienstleistungen des Bereiches forensische Medizin umfassen die Begutachtung der Ursachen von Verletzungen und Todesfällen (z.B. Untersuchung von Gewaltopfern, Leichenschauen, Obduktionen), Tat- und Fundortbesichtigungen und das Erstellen von Sachverständigengutachten zu medizinischen Fällen. Im Bereich forensische Toxikologie werden Blutproben auf Alkohol, Betäubungsmittel und andere toxikologische Substanzen im Zusammenhang möglicher Rechtsverstöße untersucht. In der forensischen Genetik werden biologische Spuren ausgewertet (etwa von Tatorten) und Abstammungsgutachten erstellt.

### Ausgangssituation

Zur Organisation der täglichen Arbeit im Bereich der Dienstleistungen wird in den drei Bereichen seit 15 Jahren ein Labor-Informations- und Management-System (LIMS) eingesetzt. Im System werden alle eingehenden Proben und durchgeführten Untersuchungen verzeichnet. Auf Basis des Systems werden die täglichen Aufgaben und Arbeitsschritte geplant und die Abläufe im Labor gesteuert. Das LIMS ist in Prozesse vom Eingang der Aufträge im Institut bis zur Erstellung der Gutachten und Rechnungen eingebunden.

Über den 15-jährigen Betrieb hinweg wurde das System mehrfach angepasst. Die Pflege und Weiterentwicklung wurden über den Zeitraum allerdings zunehmend aufwändig und arbeitsintensiv. Zudem wuchs am Institut der Wunsch die IT-Sicherheit der Software zusätzlich zu stärken. Das bisher eingesetzte LIMS war eine flexible Standardlösung als Client-Software, die von den Fachleuten des limsilims über die Jahre an die Bedürfnisse der Rechtsmedizin und des eigenen rechtmedizinischen Instituts angepasst wurden. Dieses Customizing stieß nun auch zunehmend an seine Grenzen. Aus diesen Gründen fiel die Entscheidung, eine eigene, maßgefertigte Softwarelösung in Auftrag zu geben. Während Migration und Ablösung sollte der Betrieb zudem kontinuierlich gewährleistet bleiben.

![Die Systemarchitektur von fLIMS bei der limsilims.](../../../images/autor1.jpg "Die Systemarchitektur von fLIMS bei der limsilims.")

> Dieses Projekt zeigt die Notwendigkeit von Lösungen, die passgenau auf die Bedarfe der Anforderer zugeschnitten sind und entsprechend weiter ausgebaut werden können. Dies ist ein Projekt, welches die Komplexität der Rechtsmedizin in innovativen Lösungen abbildet. Hier wurde gemeinsam ein System gebaut, welches die User entlastet und die digitale Transformation intensiv vorantreibt.
>
> — Ted Sheeran, Abteilungsleiter Betriebswirtschaftliche Applikationen, limsilims



### Lösung

cronn entwickelte ein Konzept, in dem die Altanwendung in kleinen Schritten abgelöst werden sollte. Als ersten Schritt entwickelte unser Team zügig ein neues Frontend in Form einer webbasierten Benutzeroberfläche, um einen Parallelbetrieb der Alt- und Neuanwendung in der Zeit der Entwicklung und Ablösung zu ermöglichen. Bereits nach ca. 5 Wochen stand das erste Modul bereit und wurde produktiv eingesetzt. In den folgenden Wochen folgten dann sukzessive weitere Module. Damit lassen sich nun zentrale Arbeitsschritte und Prozesse in der forensischen Medizin abbilden: die Daten Verstorbener werden aufgenommen, Untersuchungsdaten erfasst, Barcodes für Asservate sowie entnommene Proben ausgedruckt, Rechnungen erstellt et cetera.

Ein wichtiges Feature für diese spezielle, von uns fLIMS genannte, Software sind auch präzise und transparente Änderungshistorien, damit alle rechtlich relevanten Arbeitsschritte nachvollziehbar sind und Proben nachverfolgt werden können. In fLIMS erstellte Rechnungen automatisch von der Debitorenbuchhaltung des limsilims weiterverarbeitet werden können, programmierte das Team zusätzlich eine Schnittstelle zum SAP-System des limsilims. Im weiteren Verlauf des Projekts wurden die Module für forensische Toxikologie sowie forensische Genetik entwickelt und auf der neuen Zielarchitektur in Betrieb genommen. Dadurch waren nun auch eine Planung und Steuerung der Aufträge und Aufgaben in den jeweiligen Laboren möglich.

Die Benutzeroberflächen wurden dabei in enger agiler Zusammenarbeit mit den Nutzer:innen neu erstellt und an die Bedürfnisse und Arbeitsabläufe angepasst. Dafür wurden auch Userbefragungen und -tests durchgeführt. Somit konnten die Nutzer:innen von Beginn an Einfluss auf die Gestaltung der Oberflächen nehmen und Verbesserungen sofort im Einsatz nutzen, was für eine exzellente User Experience sorgt.



![Screenshot einer fLIMS-Benutzeroberfläche mit generischen Testdaten.](../../../images/blog-placeholder-2.jpg "Screenshot einer fLIMS-Benutzeroberfläche mit generischen Testdaten.")

Im zweiten Schritt stellte unser Team die Hintergrundsysteme neu auf. Die ursprüngliche Zwei-Schicht-Architektur aus Datenbank und Fat Client wich nach und nach einer modernen und sicheren Drei-Schicht-Webanwendung. Alle Labormessgeräte wurden an das neue Backend angebunden und auch bilaterale Schnittstellen etabliert. So können Laborgeräte und Software in beide Richtungen Daten austauschen. Mit der alten Software mussten etwa Angaben, die bereits im System vorhanden waren, manuell noch mal in den Benutzeroberflächen der Geräte eingegeben werden.

Mit der cronn-Lösung reicht das Scannen des Barcodes und das Messgerät tauscht alle nötigen Daten mit der Software aus. Im finalen Zustand stand eine komplett neue Anwendung, die in mehreren kleinen Schritten eingeführt wurde. Die Lösung ist auf dem neusten Stand der Technik und einfach wartbar. Die Anwendung wird in weiteren Schritten ausgebaut, um die Digitalisierung und Automatisierung der Abläufe im Institut kontinuierlich voranzutreiben.



### Kundenvorteil

Spezielle Software für rechtsmedizinische Institute ist am Markt kaum vorhanden. Neben allgemeinen LIMS, die in allen Arten von Laboren eingesetzt werden können, existieren ein paar Speziallösungen, die auch auf den Einsatz in Behörden, wie etwa bei der Polizei ausgerichtet sind. fLIMS bietet ein Laborsystem, das an die Bedürfnisse und Anforderungen rechtsmedizinischer Institute angepasst ist und Prozesse und Abläufe in den Bereichen forensische Medizin, forensische Toxikologie und forensische Genetik abdeckt.

Dabei werden auch Anwendungsfälle außerhalb des Labors mit abgebildet, etwa bei rechtsmedizinischen Untersuchungen. Indem die Software auch die Erfassung und Berichterstattung zu personenbezogenen Daten zulässt, wurden Elemente eines LIMS, bei denen es meist um die Verwaltung von Probendaten und Laborprozessen geht, mit Elementen eines Laborinformationssystems (LIS) vereint.

Unser Team achtete zusätzlich auf eine hohe Effizienz für die Dateneingabe und einen möglichst hohen Automatisierungsgrad der Arbeitsschritte der User. Zudem werden ein exzellentes Qualitätsmanagement und hohe IT-Sicherheit gewährleistet. Das neue System ist technisch wartungsfreundlich und wird durch uns intensiv supportet. Das limsilims bekam so für die Kosten einer Standardlösung eine spezialisierte Software für ein hochspezialisiertes Institut. Zudem bleibt cronn auch über die nächsten Jahre ein enger und verlässlicher Partner für eine stetige Weiterentwicklung und Erweiterung der Software im Sinne der Nutzer:innen.
