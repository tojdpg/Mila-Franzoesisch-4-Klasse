(() => {
  const entries = [
    ["les cinq sens", "die fünf Sinne"],
    ["la vue", "das Sehen / der Sehsinn"],
    ["le toucher", "der Tastsinn"],
    ["l'odorat", "der Geruchssinn"],
    ["le goût", "der Geschmackssinn"],
    ["l'ouïe", "das Hören / der Hörsinn"],
    ["l'œil", "das Auge"],
    ["les yeux", "die Augen"],
    ["l'oreille", "das Ohr"],
    ["les oreilles", "die Ohren"],
    ["le nez", "die Nase"],
    ["la langue", "die Zunge"],
    ["la peau", "die Haut"],
    ["le cerveau", "das Gehirn"],
    ["cerveau", "Gehirn"],
    ["voir", "sehen"],
    ["entendre", "hören"],
    ["sentir", "riechen oder fühlen, je nach Zusammenhang"],
    ["goûter", "schmecken oder probieren"],
    ["toucher", "berühren / tasten"],
    ["la paupière", "das Augenlid"],
    ["la pupille", "die Pupille"],
    ["l'iris", "die Iris / Regenbogenhaut"],
    ["la cornée", "die Hornhaut"],
    ["la sclère", "die Lederhaut / das Weiße des Auges"],
    ["le cristallin", "die Augenlinse"],
    ["la rétine", "die Netzhaut"],
    ["le nerf optique", "der Sehnerv"],
    ["le son", "der Schall / Ton"],
    ["le canal auditif", "der Gehörgang"],
    ["la cochlée", "die Hörschnecke"],
    ["le tympan", "das Trommelfell"],
    ["les osselets", "die Gehörknöchelchen"],
    ["les cellules ciliées", "die Haarzellen"],
    ["le nerf auditif", "der Hörnerv"],
    ["les vibrations", "die Schwingungen"],
    ["les ondes sonores", "die Schallwellen"],
    ["des particules odorantes", "Duftteilchen"],
    ["les narines", "die Nasenlöcher"],
    ["la muqueuse olfactive", "die Riechschleimhaut"],
    ["le nerf olfactif", "der Riechnerv"],
    ["la cavité nasale", "die Nasenhöhle"],
    ["la cavité buccale", "die Mundhöhle"],
    ["les papilles gustatives", "die Geschmacksknospen"],
    ["la saveur", "der Geschmack"],
    ["la texture", "die Beschaffenheit / Konsistenz"],
    ["la douleur", "der Schmerz"],
    ["la chaleur", "die Wärme"],
    ["le froid", "die Kälte"],
    ["la pression", "der Druck"],
    ["l'épiderme", "die Oberhaut"],
    ["le derme", "die Lederhaut (Hautschicht)"],
    ["l'hypoderme", "die Unterhaut"],
    ["les glandes sudoripares", "die Schweißdrüsen"],
    ["la transpiration", "der Schweiß / das Schwitzen"],
    ["amer", "bitter"],
    ["vrai", "richtig / wahr"],
    ["faux", "falsch"],
    ["quel organe", "welches Organ"],
    ["quelle partie", "welcher Teil"],
    ["choisis", "wähle"],
    ["complète", "ergänze"],
    ["observe", "betrachte"],
    ["nomme", "benenne"],
    ["corrige", "verbessere"],
    ["numérote", "nummeriere"],
    ["choisis l'organe et le verbe qui correspondent à chaque sens", "Wähle das Organ und das Verb, die zu jedem Sinn passen."],
    ["la vue : quel organe", "Sehen: Welches Organ?"],
    ["la vue : que permet-elle de faire", "Sehen: Was ermöglicht es?"],
    ["le toucher : quel organe", "Tasten: Welches Organ?"],
    ["le toucher : quel verbe", "Tasten: Welches Verb?"],
    ["l'odorat : quel organe", "Riechen: Welches Organ?"],
    ["l'odorat : quel verbe", "Riechen: Welches Verb?"],
    ["le goût : quel organe", "Schmecken: Welches Organ?"],
    ["le goût : quel verbe", "Schmecken: Welches Verb?"],
    ["l'ouïe : quel organe", "Hören: Welches Organ?"],
    ["l'ouïe : quel verbe", "Hören: Welches Verb?"],
    ["écris le nom de la partie ou choisis la bonne réponse", "Schreibe den Namen des Teils oder wähle die richtige Antwort."],
    ["quelle partie donne sa couleur à l'œil", "Welcher Teil gibt dem Auge seine Farbe?"],
    ["quelle partie permet de voir net à différentes distances", "Welcher Teil ermöglicht scharfes Sehen in verschiedenen Entfernungen?"],
    ["sur quelle partie se forment les images", "Auf welchem Teil entstehen die Bilder?"],
    ["quelle partie grandit ou rétrécit selon la lumière", "Welcher Teil wird je nach Licht größer oder kleiner?"],
    ["qu'est-ce qui transmet les informations au cerveau", "Was leitet die Informationen an das Gehirn weiter?"],
    ["quelle partie transparente se trouve à l'avant de l'œil", "Welcher durchsichtige Teil befindet sich vorne am Auge?"],
    ["comment s'appelle la partie blanche de l'œil", "Wie heißt der weiße Teil des Auges?"],
    ["quelle partie se ferme pour protéger l'œil", "Welcher Teil schließt sich, um das Auge zu schützen?"],
    ["quelle partie est indiquée", "Welcher Teil ist markiert?"],
    ["observe le schéma et nomme les parties a à h", "Betrachte die Zeichnung und benenne die Teile A bis H."],
    ["numérote les étapes de 1 à 5 dans le bon ordre", "Nummeriere die Schritte von 1 bis 5 in der richtigen Reihenfolge."],
    ["les vibrations mettent en mouvement le fluide de la cochlée et les cellules ciliées", "Die Schwingungen setzen die Flüssigkeit in der Hörschnecke und die Haarzellen in Bewegung."],
    ["le son arrive dans le canal auditif", "Der Schall gelangt in den Gehörgang."],
    ["le nerf auditif envoie les informations au cerveau", "Der Hörnerv sendet die Informationen an das Gehirn."],
    ["les cellules ciliées transforment le mouvement en impulsions électriques", "Die Haarzellen wandeln die Bewegung in elektrische Impulse um."],
    ["les ondes sonores font vibrer le tympan et les osselets", "Die Schallwellen lassen das Trommelfell und die Gehörknöchelchen schwingen."],
    ["complète les phrases. certains mots ne servent pas", "Ergänze die Sätze. Einige Wörter brauchst du nicht."],
    ["dans l'air, il y a", "In der Luft gibt es …"],
    ["ces particules entrent par", "Diese Teilchen gelangen durch … hinein."],
    ["dans la cavité nasale se trouve", "In der Nasenhöhle befindet sich …"],
    ["quel nerf envoie les informations au cerveau", "Welcher Nerv sendet die Informationen an das Gehirn?"],
    ["les informations arrivent au", "Die Informationen gelangen zum …"],
    ["choisis vrai ou faux, puis corrige les trois phrases fausses", "Wähle richtig oder falsch und verbessere danach die drei falschen Sätze."],
    ["le goût permet de percevoir la texture des aliments", "Mit dem Geschmackssinn nimmt man die Konsistenz der Lebensmittel wahr."],
    ["la langue se trouve dans la cavité nasale", "Die Zunge befindet sich in der Nasenhöhle."],
    ["quand l'odorat est abîmé, on ressent moins le goût des aliments", "Wenn der Geruchssinn beeinträchtigt ist, schmeckt man Lebensmittel weniger stark."],
    ["sur la langue, il y a des papilles olfactives", "Auf der Zunge gibt es Riechknospen."],
    ["le café et les endives peuvent avoir un goût amer", "Kaffee und Chicorée können bitter schmecken."],
    ["le goût permet de percevoir", "Der Geschmackssinn ermöglicht, … wahrzunehmen."],
    ["la langue se trouve dans", "Die Zunge befindet sich in …"],
    ["sur la langue, il y a des papilles", "Auf der Zunge gibt es … Knospen."],
    ["choisis toutes les bonnes réponses quand c'est demandé", "Wähle alle richtigen Antworten, wenn danach gefragt wird."],
    ["quelles sensations perçoit-on grâce à la peau ? (4 réponses)", "Welche Empfindungen nimmt man durch die Haut wahr? (4 Antworten)"],
    ["combien de couches composent la peau", "Aus wie vielen Schichten besteht die Haut?"],
    ["comment s'appelle la couche extérieure de la peau", "Wie heißt die äußere Hautschicht?"],
    ["que permettent les glandes sudoripares ? (2 réponses)", "Was ermöglichen die Schweißdrüsen? (2 Antworten)"],
    ["que trouve-t-on dans le derme ? (2 réponses)", "Was findet man in der Lederhaut? (2 Antworten)"],
  ];

  const normalize = (value) => value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("fr")
    .replace(/[’‘`]/g, "'")
    .replace(/œ/g, "oe")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[\s.!?…]+$/g, "")
    .trim();

  const dictionary = new Map(entries.map(([french, german]) => [normalize(french), german]));
  for (const [french, german] of entries) {
    const withoutArticle = normalize(french).replace(/^(?:le |la |les |l')/, "");
    if (!dictionary.has(withoutArticle)) dictionary.set(withoutArticle, german);
  }
  const launcher = document.querySelector("#dictionaryLauncher");
  const panel = document.querySelector("#dictionaryPanel");
  const close = document.querySelector("#dictionaryClose");
  const form = document.querySelector("#dictionaryForm");
  const input = document.querySelector("#dictionaryInput");
  const answer = document.querySelector("#dictionaryAnswer");

  function showAnswer(message) {
    answer.textContent = message;
    answer.hidden = false;
  }

  function openPanel() {
    const selected = window.getSelection()?.toString().trim();
    if (selected && selected.length <= 300) input.value = selected;
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  launcher.addEventListener("click", () => panel.hidden ? openPanel() : closePanel());
  close.addEventListener("click", closePanel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      showAnswer("Schreib zuerst ein französisches Wort oder einen Satz hinein.");
      input.focus();
      return;
    }

    const known = dictionary.get(normalize(text).replace(/^[a-h]\s*:\s*(?=quelle partie est indiquee)/, ""));
    if (known) {
      showAnswer(known);
      return;
    }

    showAnswer("Das kenne ich noch nicht. Versuch ein Wort oder einen Satz aus diesem Quiz.");
  });
})();
