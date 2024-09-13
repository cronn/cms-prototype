---
title: Projektarbeitszeiterfassung – cronns Ergänzung zu Personio
slug: de/loesung-fuer-projektarbeitszeit-in-personio
articleDate: 2024-09-13
titleImage: /src/images/g4611.png
ogTitle: Projektarbeitszeitserfassung – cronns Ergänzung zu Personio
ogDescription: Exakte Erfassung von Projektarbeitszeit inklusive Dashboards ist
  in Personio nicht vorgesehen. cronn hat dafür eine Lösung!
---
Personio ist eine beliebte SaaS-Lösung für den HR-Bereich. Die generelle Arbeitszeiterfassung lässt sich wunderbar abbilden – die Anwendung versteht sich aber nicht als Tool für die Erfassung von Projektarbeitszeiten. cronn hat das für sich mit einer eigenen Webanwendung gelöst, die auf die Schnittstelle von Personio zugreift.

## Arbeitszeiterfassung? Natürlich digital!

2022 hat das Bundesarbeitsgericht festgestellt, dass nach dem Arbeitsschutzgesetz die gesamte Arbeitszeit der Arbeitnehmer aufzuzeichnen ist. Wer bis dahin keine Software für die Arbeitszeiterfassung eingesetzt hatte, hat das vermutlich seitdem nachgeholt. cronn hat für die eigene Arbeitszeiterfassung bereits deutlich früher eine Excel-basierte Lösung durch die Software-as-a-Service-Anwendung Personio abgelöst. Damit ist dieser Bereich unserer HR modern und effizient in einer Webanwendung digitalisiert. Dadurch entstanden viele Automatisierungen und Vereinfachungen von Prozessen für die Mitarbeiter, die HR und die Lohnbuchhaltung. Auch weitere Prozesse laufen jetzt bequem über das Tool, wie etwa die Beantragung von Abwesenheiten oder die Verwaltung von Personaldokumenten.

## Arbeitszeiterfassung vs. Erfassung von Projektarbeitszeit
Ein Problem blieb aber zunächst für uns ungelöst: Personio sieht das eigene Produkt nicht als Tool für die Erfassung von Projektarbeitszeit. Zeiten für Projekte können zwar eingegeben werden, einen Bereich für genaue Reports und Auswertungen bietet Personio aber nicht. Dadurch ergab sich für uns als Dienstleistungsunternehmen das Problem, dass die Mitglieder der Projektteams Zeiten doppelt hätten festhalten müssen – ihre gesamte Arbeitszeit in Personio und die genaue Arbeitszeit pro Projekt in einer zweiten Anwendung. Dies wäre eine unnötige Quelle für Fehler und Inkonsistenzen gewesen. Zudem konnten wir auf dem Markt keine Anwendung finden, die zu uns passt, so dass wir am Ende wieder gezwungen gewesen wären auf Excel auszuweichen.

Diese Lösung wäre umständlich gewesen, da neben den Mitarbeitern selbst auch Projektleiter, Controlling und die Buchhaltung in unterschiedlichem Umfang Zugriff auf Teile dieser Daten benötigen: Projektüberstunden müssen teilweise speziell abgerechnet werden, Projektkosten müssen im Blick behalten und nicht zuletzt müssen präzise Rechnungen für die Kunden erstellt werden.

Screenshot der Administrationsoberflächen in personio
Per Schnittstelle zur (eigenen) Lösung für die Erfassung der Projektarbeitszeit
Als Softwareunternehmen nahmen wir uns der Situation proaktiv an und entwickelten eine Lösung, die auf eine Programmierschnittstelle von Personio zugreift. Die Mitarbeiter geben in Personio neben ihrer allgemeinen Arbeitszeit jetzt auch die Projektarbeitszeiten in der gleichen Benutzeroberfläche ein. Dafür wurden Projekte im Adminbereich in Personio vordefiniert. Die Mitarbeiter tragen bequem in der gewohnten Benutzeroberfläche in Personio Zeiten ein und wählen ein Projekt aus. Die Daten zu Projektarbeitszeiten werden dann über die in Personio integrierte REST-API vom Backend unserer Webanwendung abgerufen und für die jeweiligen Nutzer in einem Dashboard dargestellt. Dort kann man die Daten nach Projekten und anderen Attributen filtern und sortieren und das Ergebnis als Spreadsheet exportieren.

Screenshot der Mitarbeiteroberflächen in personio
Umfangreiches Identitäts-, Zugangs- und Rollenmanagement
Die unterschiedlichen Rollen der User können von den Administratoren einfach angelegt werden. Je nachdem können sie dann in unterschiedlichem Umfang auf die Daten zugreifen. Mitarbeiter auf die eigenen Projektarbeitszeiten, Projektleiter auf ihr gesamtes Projekt und Controller und Buchhalter auf alle Projekte. Der Login läuft dabei bequem über das gewohnte Single-Sign-on-Verfahren, das unsere Mitarbeiter für viele Tools und Webanwendungen nutzen (OAuth) – auch für Personio.

Die Vorteile einer Projektarbeitszeiterfassung, die mit Personio vernetzt ist
Die Mitarbeiter pflegen ihre Arbeits- und Projektarbeitszeiten in einer Benutzeroberfläche ein
Ansicht und Auswertung der Daten in einem intuitiven, übersichtlichen Dashboard
Kein Management paralleler Tools
Datensicherheit bleibt gewahrt
Genaues Rollen- und Zugangsmanagement
Unsere Lösung für Ihr Unternehmen!
Ihr Unternehmen nutzt auch Personio und Ihre Mitarbeiter müssen genaue Projektarbeitszeiten erfassen? Melden Sie sich gerne bei uns. Wir analysieren gemeinsam Ihre Anforderungen und finden heraus, ob unsere Lösung zu Ihrem Unternehmen passt, und besprechen weitere Schritte
