(() => {
  "use strict";

  const app = document.getElementById("app");
  const soundButton = document.getElementById("geluid-knop");
  const brandButton = document.getElementById("merk-knop");
  const STORAGE_KEY = "vape-escape-voortgang-v1";
  const TOTAL_QUESTIONS = 17;
  const levelNames = ["Vape-feiten", "Feit of fabel", "Groepsdruk", "De laatste ontsnapping"];
  const levelDescriptions = [
    "Ontdek wat er in een vape zit en wat nicotine met je lichaam doet.",
    "Prik door misleidende beweringen heen en leer hoe regels per land verschillen.",
    "Oefen met lastige situaties en kies hoe jij bij jouw eigen grens blijft.",
    "Gebruik alles wat je hebt geleerd om het digitale slot te openen."
  ];

  const factsQuestions = [
    {
      id: "f1",
      prompt: "Wat zit er meestal in een vape?",
      context: "Een vape verbrandt geen tabak zoals een sigaret. Wat gebeurt er dan wel?",
      options: [
        "Alleen water met een beetje suiker",
        "Een vloeistof die wordt verhit; die bevat vaak nicotine en andere stoffen",
        "Alleen schone zuurstof",
        "Kruiden die vanzelf in rook veranderen"
      ],
      correctIndex: 1,
      explanation: "Een vape verhit een vloeistof. Die bevat vaak nicotine, propyleenglycol, glycerol en andere stoffen. De ingeademde aerosol is dus geen gewone waterdamp. Bij verhitting kunnen ook schadelijke stoffen ontstaan."
    },
    {
      id: "f2",
      prompt: "Wat is nicotine?",
      context: "Nicotine is een van de belangrijkste redenen waarom vapen moeilijk kan zijn om mee te stoppen.",
      options: [
        "Een vitamine die je energie geeft",
        "Een onschuldige smaakstof",
        "Een sterk verslavende stof die invloed heeft op je hersenen",
        "Een stof die alleen in fruit zit"
      ],
      correctIndex: 2,
      explanation: "Nicotine is een sterk verslavende stof. Het beïnvloedt het beloningssysteem in je hersenen. Daardoor kun je steeds opnieuw zin krijgen in nicotine en ontwenningsklachten ervaren als je stopt."
    },
    {
      id: "f3",
      prompt: "Waarom kan nicotine verslavend zijn?",
      context: "Denk aan wat er in je hersenen gebeurt na het inhaleren van nicotine.",
      options: [
        "Nicotine beïnvloedt het beloningssysteem, waardoor je hersenen er opnieuw om kunnen vragen",
        "Nicotine maakt je immuunsysteem sterker",
        "Nicotine verdwijnt altijd meteen zonder effect",
        "Nicotine zorgt ervoor dat je nooit meer stress voelt"
      ],
      correctIndex: 0,
      explanation: "Nicotine activeert het beloningssysteem. Je hersenen kunnen dat gevoel opnieuw willen. Zo kan afhankelijkheid ontstaan. Zonder nicotine kun je bijvoorbeeld onrustig, prikkelbaar of minder geconcentreerd zijn."
    },
    {
      id: "f4",
      prompt: "Waarom zijn jongeren extra kwetsbaar voor nicotine?",
      context: "Je hersenen zijn tijdens je tienerjaren nog volop in ontwikkeling.",
      options: [
        "Omdat jongeren geen hersenen hebben die nicotine kunnen afbreken",
        "Omdat het jonge brein nog in ontwikkeling is en gevoeliger kan zijn voor nicotine",
        "Omdat nicotine bij jongeren alleen in de longen blijft",
        "Omdat jongeren nooit verslaafd kunnen raken"
      ],
      correctIndex: 1,
      explanation: "De hersenen ontwikkelen zich nog tot in de jongvolwassenheid. Nicotine kan die ontwikkeling verstoren en invloed hebben op aandacht, geheugen en stemming. Jongeren kunnen bovendien sneller afhankelijk worden."
    },
    {
      id: "f5",
      prompt: "Wat kan de aerosol van een vape met je luchtwegen doen?",
      context: "Aerosol is het mengsel dat je inademt wanneer de vloeistof wordt verhit.",
      options: [
        "De luchtwegen altijd schoonmaken",
        "Geen enkel effect hebben op je lichaam",
        "De luchtwegen irriteren of beschadigen en hoestklachten veroorzaken",
        "Je longen extra zuurstof geven"
      ],
      correctIndex: 2,
      explanation: "De aerosol kan stoffen bevatten die de luchtwegen irriteren of beschadigen. Gebruikers melden bijvoorbeeld hoestklachten. Over sommige gevolgen van langdurig en regelmatig vapen is nog niet alles bekend."
    },
    {
      id: "f6",
      prompt: "Een vape zonder nicotine is automatisch onschadelijk. Klopt dat?",
      context: "Let op: nicotine is niet de enige stof waar je rekening mee moet houden.",
      options: [
        "Ja, zonder nicotine is het alleen maar waterdamp",
        "Nee, ook zonder nicotine kunnen schadelijke stoffen in de aerosol zitten",
        "Ja, zolang de vape een smaakje heeft",
        "Nee, maar alleen als je ouder bent dan 18"
      ],
      correctIndex: 1,
      explanation: "Een vape zonder nicotine is niet automatisch veilig. Ook de vloeistof en de aerosol kunnen stoffen bevatten die je luchtwegen irriteren of op een andere manier schadelijk kunnen zijn. Niet beginnen is de veiligste keuze."
    }
  ];

  const truthQuestions = [
    {
      id: "t1",
      prompt: "Vape-damp is alleen maar waterdamp.",
      correctIndex: 1,
      explanation: "Niet waar. Wat je inademt is een aerosol: kleine druppeltjes en deeltjes uit een verhitte vloeistof. Daarin kunnen nicotine, metalen en andere schadelijke stoffen zitten."
    },
    {
      id: "t2",
      prompt: "De meeste vapes bevatten nicotine.",
      correctIndex: 0,
      explanation: "Waar. Veel vapes bevatten nicotine, soms in een hoge hoeveelheid. Er bestaan ook vapes zonder nicotine, maar ook die zijn niet automatisch onschadelijk."
    },
    {
      id: "t3",
      prompt: "Nicotine kan ervoor zorgen dat je steeds opnieuw wilt vapen.",
      correctIndex: 0,
      explanation: "Waar. Nicotine is sterk verslavend. Je lichaam en hersenen kunnen eraan wennen, waardoor je trek kunt krijgen en ontwenningsklachten kunt ervaren."
    },
    {
      id: "t4",
      prompt: "Het brein van een tiener is nog in ontwikkeling.",
      correctIndex: 0,
      explanation: "Waar. Vooral gebieden die helpen bij plannen, keuzes maken en impulsen beheersen ontwikkelen nog. Nicotine kan die ontwikkeling verstoren."
    },
    {
      id: "t5",
      prompt: "In Nederland mogen vapes met fruitsmaak gewoon worden verkocht.",
      correctIndex: 1,
      explanation: "Niet waar. Sinds 1 januari 2024 mogen vapes en e-liquids met andere smaken dan tabak niet meer worden verkocht in Nederland."
    },
    {
      id: "t6",
      prompt: "Overal ter wereld gelden precies dezelfde regels voor vapes.",
      correctIndex: 1,
      explanation: "Niet waar. Landen kiezen verschillende regels. In het Verenigd Koninkrijk is de verkoop van wegwerpvapes sinds 1 juni 2025 verboden. In Australië mogen vapes alleen via apotheken worden verstrekt onder strenge voorwaarden. In Nederland zijn onder andere verkoop aan jongeren onder 18 en smaakjes anders dan tabak verboden."
    }
  ];

  const scenarios = [
    {
      id: "p1",
      prompt: "Je bent op een feestje. Een paar vrienden bieden je een vape aan en zeggen: \"Kom op, één keer kan toch geen kwaad?\"",
      context: "Je wilt erbij horen, maar je wilt niet vapen. Wat doe je?",
      options: [
        {
          text: "Je zegt rustig: \"Nee, ik vape niet\" en loopt naar iemand bij wie je je prettig voelt.",
          best: true,
          outcome: "Sterke keuze. Je geeft duidelijk je grens aan en zoekt een plek waar je je prettig voelt. Je hoeft niemand iets uit te leggen."
        },
        {
          text: "Je neemt de vape aan zodat je vrienden niet teleurgesteld zijn.",
          best: false,
          outcome: "Je laat de druk van anderen bepalen wat je doet. Je mag nee zeggen, ook als anderen dat jammer vinden."
        },
        {
          text: "Je zegt dat je alleen meedoet als iedereen het doet.",
          best: false,
          outcome: "Je maakt je keuze afhankelijk van de groep. Je eigen grens is genoeg reden om niet mee te doen."
        }
      ],
      bestReason: "Een korte, duidelijke nee is genoeg. Verander van onderwerp of loop weg als de druk doorgaat."
    },
    {
      id: "p2",
      prompt: "Een klasgenoot zegt: \"Deze vape heeft geen nicotine, dus hij is helemaal veilig.\"",
      context: "Je weet inmiddels dat ook een vape zonder nicotine risico's kan hebben. Hoe reageer je?",
      options: [
        {
          text: "Je legt rustig uit dat ook de aerosol zonder nicotine schadelijke stoffen kan bevatten.",
          best: true,
          outcome: "Goed gezien. Je reageert met een feit in plaats van met ruzie. Zonder nicotine is een vape niet automatisch onschadelijk."
        },
        {
          text: "Je gelooft het meteen, want je klasgenoot klinkt zeker.",
          best: false,
          outcome: "Zelfverzekerd klinken maakt een bewering nog niet waar. Controleer informatie bij betrouwbare bronnen zoals het RIVM."
        },
        {
          text: "Je probeert de vape om zelf te onderzoeken of het klopt.",
          best: false,
          outcome: "Je hoeft een risico niet zelf uit te proberen om te weten dat het niet veilig is. Betrouwbare informatie helpt je om een keuze te maken."
        }
      ],
      bestReason: "Je hoeft geen discussie te winnen. Deel het feit en laat je niet overhalen om het zelf te proberen."
    },
    {
      id: "p3",
      prompt: "Een groepje vraagt je om een vape voor hen vast te houden. Ze zeggen dat je niet moeilijk moet doen.",
      context: "Je voelt je ongemakkelijk en wilt er niet bij betrokken raken.",
      options: [
        {
          text: "Je weigert, geeft het niet door en loopt zo nodig weg.",
          best: true,
          outcome: "Goede grens. Je hoeft niets vast te houden of te bewaren. Je kunt ook hulp vragen aan een volwassene als je je onder druk gezet voelt."
        },
        {
          text: "Je houdt hem even vast, want je gebruikt hem zelf toch niet.",
          best: false,
          outcome: "Je raakt alsnog betrokken bij iets waar je niet achter staat. Je mag ook nee zeggen tegen alleen vasthouden of doorgeven."
        },
        {
          text: "Je verstopt hem zodat niemand hem ziet.",
          best: false,
          outcome: "Je neemt verantwoordelijkheid voor iets dat niet van jou is. Het is beter om duidelijk te weigeren en afstand te nemen."
        }
      ],
      bestReason: "Je bent niet verplicht om mee te doen of iets voor iemand te bewaren."
    },
    {
      id: "p4",
      prompt: "Een vriend(in) vertelt dat stoppen met vapen moeilijk is geworden. Diegene schaamt zich en vraagt jou om hulp.",
      context: "Je wilt helpen, zonder te oordelen of alles zelf te moeten oplossen.",
      options: [
        {
          text: "Je luistert, neemt het serieus en stelt voor samen een vertrouwde volwassene of hulpverlener te zoeken.",
          best: true,
          outcome: "Dat is steunend. Luisteren zonder oordeel helpt. Een huisarts, jeugdarts of andere vertrouwde volwassene kan helpen met een plan om te stoppen."
        },
        {
          text: "Je maakt grapjes, zodat je vriend(in) zich er minder druk om maakt.",
          best: false,
          outcome: "Je vriend(in) deelt iets moeilijks. Grapjes kunnen ervoor zorgen dat diegene zich niet serieus genomen voelt. Luisteren is beter."
        },
        {
          text: "Je zegt dat diegene het gewoon zelf moet oplossen.",
          best: false,
          outcome: "Stoppen kan lastig zijn door nicotineverslaving. Steun vragen is juist verstandig. Je hoeft het probleem niet alleen op te lossen."
        }
      ],
      bestReason: "Je kunt helpen door te luisteren en samen betrouwbare hulp te zoeken. Je hoeft geen hulpverlener te zijn."
    }
  ];

  const allQuestionIds = factsQuestions.map(q => q.id)
    .concat(truthQuestions.map(q => q.id))
    .concat(scenarios.map(q => q.id))
    .concat(["escape-code"]);
  const validIdSet = new Set(allQuestionIds);

  function legeVoortgang() {
    return { completed: [false, false, false, false], answers: {} };
  }

  function laadVoortgang() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return legeVoortgang();
      const parsed = JSON.parse(raw);
      const clean = legeVoortgang();
      if (Array.isArray(parsed.completed)) {
        clean.completed = clean.completed.map((_, index) => parsed.completed[index] === true);
      }
      if (parsed.answers && typeof parsed.answers === "object") {
        Object.keys(parsed.answers).forEach(id => {
          if (validIdSet.has(id) && typeof parsed.answers[id] === "boolean") {
            clean.answers[id] = parsed.answers[id];
          }
        });
      }
      return clean;
    } catch (error) {
      return legeVoortgang();
    }
  }

  let voortgang = laadVoortgang();
  let pagina = "start";
  let huidigLevel = 0;
  let huidigeVraag = 0;
  let feedback = null;
  let codeMelding = "";
  let codePogingen = 0;
  let geluidAan = false;
  let audioContext = null;

  function bewaarVoortgang() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voortgang));
    } catch (error) {
      // Het spel blijft speelbaar wanneer lokale opslag niet beschikbaar is.
    }
  }

  function aantalGoed() {
    return allQuestionIds.filter(id => voortgang.answers[id] === true).length;
  }

  function score() {
    return aantalGoed() * 10;
  }

  function afgerondeLevels() {
    return voortgang.completed.filter(Boolean).length;
  }

  function isLevelVrij(index) {
    return index === 0 || voortgang.completed[index - 1] === true;
  }

  function levelPunten(index) {
    const ids = [
      factsQuestions.map(q => q.id),
      truthQuestions.map(q => q.id),
      scenarios.map(q => q.id),
      ["escape-code"]
    ][index];
    return ids.filter(id => voortgang.answers[id] === true).length * 10;
  }

  function speelGeluid(goed) {
    if (!geluidAan) return;
    try {
      const AudioConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioConstructor) return;
      if (!audioContext) audioContext = new AudioConstructor();
      if (audioContext.state === "suspended") audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const volume = audioContext.createGain();
      const nu = audioContext.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(goed ? 640 : 210, nu);
      oscillator.frequency.exponentialRampToValueAtTime(goed ? 880 : 155, nu + 0.12);
      volume.gain.setValueAtTime(0.0001, nu);
      volume.gain.exponentialRampToValueAtTime(0.11, nu + 0.018);
      volume.gain.exponentialRampToValueAtTime(0.0001, nu + 0.19);
      oscillator.connect(volume);
      volume.connect(audioContext.destination);
      oscillator.start(nu);
      oscillator.stop(nu + 0.2);
    } catch (error) {
      // Geluid is optioneel en blokkeert het spel nooit.
    }
  }

  function werkGeluidBij() {
    soundButton.classList.toggle("gedempt", !geluidAan);
    soundButton.setAttribute("aria-label", geluidAan ? "Geluid uitschakelen" : "Geluid inschakelen");
    soundButton.setAttribute("title", geluidAan ? "Geluid uitschakelen" : "Geluid inschakelen");
  }

  function gaNaar(nieuwePagina) {
    pagina = nieuwePagina;
    render();
    app.focus({ preventScroll: true });
  }

  function terugKnop(label, action) {
    return '<button class="tekstknop" type="button" data-action="' + (action || "naar-kaart") + '">← ' + (label || "Terug naar het overzicht") + '</button>';
  }

  function renderStart() {
    return [
      '<section class="startpagina pagina">',
      '<div class="starttekst">',
      '<p class="bovenlabel">DE OVERLEVINGSGAME</p>',
      '<h1 class="titel-groot">VAPE<br><span class="accent">ESCAPE</span></h1>',
      '<p class="subtitel">Kun jij ontsnappen aan de vapeval? Ontdek wat vapen met je lichaam doet, herken groepsdruk en kraak het slot. Vier levels. Eén missie: kies voor jezelf.</p>',
      '<div class="startknoppen">',
      '<button class="knop knop-primair" type="button" id="start-knop">START DE MISSIE <span class="knop-pijl">→</span></button>',
      '<button class="knop knop-secundair" type="button" id="hoe-knop">HOE SPEEL JE?</button>',
      '</div>',
      '<div class="missie-meta">',
      '<div class="meta-item"><strong>04</strong><span>Niveaus</span></div>',
      '<div class="meta-item"><strong>17</strong><span>Kennischecks</span></div>',
      '<div class="meta-item"><strong>170</strong><span>Te verdienen punten</span></div>',
      '</div>',
      '</div>',
      '<aside class="missie-kaart" aria-label="Missie: open het digitale slot">',
      '<div class="kaart-kop"><span>MISSIE 001 / GEZONDHEID</span><span class="kaart-code">TOEGANG GEBLOKKEERD</span></div>',
      '<div class="sluitsymbool" aria-hidden="true"><div class="ring"></div>',
      '<svg viewBox="0 0 100 100"><path d="M29 44V31a21 21 0 0 1 42 0v13"></path><rect x="20" y="43" width="60" height="43" rx="9"></rect><circle cx="50" cy="62" r="5"></circle><path d="M50 67v8"></path><path d="M35 20c3-5 8-8 15-8"></path></svg>',
      '</div>',
      '<div class="kaart-onder"><strong>JOUW KEUZES. JOUW TOEKOMST.</strong><span>Verzamel kennis. Blijf scherp. Vind de uitgang.</span><div class="kaart-stippen"><i></i><i></i><i></i><i></i></div></div>',
      '</aside>',
      '</section>'
    ].join("");
  }

  function renderHoe() {
    return '<section class="pagina">' +
      '<div class="terugrij">' + terugKnop("Naar het hoofdmenu", "naar-start") + '<span class="mini-label">SPELREGELS</span></div>' +
      '<p class="bovenlabel">VOORBEREIDING</p><h1 class="titel-middel">Hoe speel je Vape Escape?</h1>' +
      '<p class="subtitel">Lees de regels en begin daarna aan je missie. Je hoeft niets te installeren en je kunt op je eigen tempo spelen.</p>' +
      '<div class="uitleg-grid">' +
      '<article class="uitleg-kaart"><span class="uitleg-nummer">01</span><div><h3>Speel vier niveaus</h3><p>Begin bij Vape-feiten. Daarna speel je Feit of fabel, Groepsdruk en de laatste ontsnapping vrij.</p></div></article>' +
      '<article class="uitleg-kaart"><span class="uitleg-nummer">02</span><div><h3>Verdien punten</h3><p>Elk goed antwoord is 10 punten waard. Na ieder antwoord krijg je uitleg, ook als je het fout hebt.</p></div></article>' +
      '<article class="uitleg-kaart"><span class="uitleg-nummer">03</span><div><h3>Bewaar je voortgang</h3><p>Je score en vrijgespeelde levels worden automatisch op dit apparaat opgeslagen.</p></div></article>' +
      '</div>' +
      '<div class="paneel paneel-padding"><div class="level-tips"><span>◎</span><p><strong>Goed om te weten:</strong> je hoeft niet alles meteen goed te hebben. Gebruik de uitleg om te leren. Je kunt niveaus opnieuw spelen en je score verbeteren.</p></div>' +
      '<div class="rij-knoppen" style="margin-top:22px"><button class="knop knop-primair" type="button" id="start-knop">BEGREPEN — START! <span class="knop-pijl">→</span></button></div></div>' +
      '</section>';
  }

  function renderLevelKaart(index) {
    const beschikbaar = isLevelVrij(index);
    const klaar = voortgang.completed[index] === true;
    const status = klaar ? "AFGEROND" : (beschikbaar ? "VRIJGESPEELD" : "VERGRENDELD");
    const actie = klaar ? "OPNIEUW SPELEN ↗" : (beschikbaar ? "START NIVEAU ↗" : "SPEEL EERST NIVEAU " + index);
    const className = klaar ? "afgerond" : (beschikbaar ? "beschikbaar" : "vergrendeld");
    return '<article class="level-kaart ' + className + '">' +
      '<div class="level-kop"><span class="level-nummer">NIVEAU 0' + (index + 1) + '</span><span class="level-status">' + status + '</span></div>' +
      '<h3>' + levelNames[index] + '</h3><p>' + levelDescriptions[index] + '</p>' +
      '<div class="level-actie"><span>' + actie + '</span><span>' + (klaar ? "✓" : (beschikbaar ? "→" : "×")) + '</span></div>' +
      '<button type="button" data-action="start-level" data-level="' + index + '"' + (beschikbaar ? "" : " disabled") + ' aria-label="' + (beschikbaar ? "Speel " + levelNames[index] : levelNames[index] + " is vergrendeld") + '"></button>' +
      '</article>';
  }

  function renderKaart() {
    const klaar = afgerondeLevels();
    const voortgangPercentage = Math.round((klaar / 4) * 100);
    const eindKnop = voortgang.completed[3] ? '<div class="rij-knoppen" style="margin-top:22px"><button class="knop knop-primair" type="button" data-action="eindscherm">BEKIJK JE EINDRESULTAAT →</button></div>' : "";
    return '<section class="pagina">' +
      '<div class="terugrij">' + terugKnop("Hoofdmenu", "naar-start") + '<button class="tekstknop" type="button" data-action="reset">↻ Opnieuw beginnen</button></div>' +
      '<p class="bovenlabel">KIES JE VOLGENDE STAP</p><h1 class="titel-middel">De missiekaart</h1>' +
      '<p class="subtitel">Vier levels brengen je dichter bij de uitgang. Voltooi een niveau om het volgende vrij te spelen.</p>' +
      '<div class="voortgang-paneel"><div class="voortgang-tekst"><div class="voortgang-boven"><span>MISSIEVOORTGANG</span><strong>' + klaar + ' / 4 NIVEAUS</strong></div>' +
      '<div class="voortgang-balk"><div class="voortgang-vulling" style="width:' + voortgangPercentage + '%"></div></div></div>' +
      '<div class="score-chip"><strong>' + score() + '</strong><span>VAN 170 PUNTEN</span></div></div>' +
      '<div class="level-grid">' + [0, 1, 2, 3].map(renderLevelKaart).join("") + '</div>' +
      '<div class="land-regels">' +
      '<article class="land-kaart"><span class="land-naam">Nederland</span><strong>Leeftijdsgrens en smaakverbod</strong><p>Verkoop aan jongeren onder 18 is verboden. Sinds 2024 mogen vapes met andere smaken dan tabak niet worden verkocht. Sinds 2026 mogen vapes alleen nog in tabaksspeciaalzaken worden verkocht.</p></article>' +
      '<article class="land-kaart"><span class="land-naam">Verenigd Koninkrijk</span><strong>Wegwerpvapes verboden</strong><p>Sinds 1 juni 2025 is de verkoop en levering van wegwerpvapes verboden. Herbruikbare vapes vallen niet onder dit specifieke verbod.</p></article>' +
      '<article class="land-kaart"><span class="land-naam">Australië</span><strong>Alleen via apotheken</strong><p>Vapes mogen alleen via apotheken worden verstrekt als therapeutische producten. Daar gelden strenge voorwaarden voor.</p></article>' +
      '</div><p class="wet-notitie">Regels verschillen per land en kunnen veranderen. Dit zijn voorbeelden van landelijke regels, geen volledig juridisch overzicht. De bronnen onderaan deze pagina verwijzen naar officiële informatie.</p>' +
      eindKnop + '</section>';
  }

  function renderSpelBalk(index, stap, totaal) {
    const percentage = Math.round(((stap + 1) / totaal) * 100);
    return '<div class="spel-voortgang"><strong>NIVEAU 0' + (index + 1) + ' · ' + levelNames[index].toUpperCase() + '</strong><span>VRAAG ' + (stap + 1) + ' / ' + totaal + '</span></div>' +
      '<div class="voortgang-balk" style="margin-bottom:19px"><div class="voortgang-vulling" style="width:' + percentage + '%"></div></div>';
  }

  function renderZijbalk(index) {
    const tips = [
      "Let op het verschil tussen vloeistof, aerosol en nicotine. Een vape maakt geen gewone waterdamp.",
      "Lees elke zin goed. Eén woord kan een bewering helemaal veranderen.",
      "Kies wat veilig is en bij jouw grens past. Je hoeft niemand te overtuigen.",
      "Gebruik de feiten uit de vorige levels. De aanwijzingen zijn genoeg om de code te vinden."
    ];
    return '<aside class="spel-zijbalk">' +
      '<div class="paneel zij-kaart"><span class="mini-label">JOUW SCORE</span><div class="zij-score"><span>Totaal</span><strong>' + score() + ' / 170</strong></div><div class="zij-score"><span>Goed beantwoord</span><strong>' + aantalGoed() + ' / 17</strong></div></div>' +
      '<div class="paneel zij-kaart"><span class="mini-label">MISSIEHINT</span><h3 style="margin-top:12px">Blijf scherp</h3><p>' + tips[index] + '</p></div>' +
      '<div class="paneel zij-kaart"><div class="level-tips"><span>✓</span><p>Na je keuze verschijnt meteen een uitleg. Lees die goed: je hebt de informatie nodig voor de laatste code.</p></div></div>' +
      '</aside>';
  }

  function renderFeedback(q, goed, gekozenUitleg, extra) {
    const className = goed ? "goed-feedback" : "fout-feedback";
    const kop = goed ? "Goed gedaan! +10 punten" : "Niet helemaal — lees de uitleg";
    const icoon = goed ? "✓" : "!";
    const aantal = huidigLevel === 0 ? factsQuestions.length : (huidigLevel === 1 ? truthQuestions.length : scenarios.length);
    return '<div class="feedback ' + className + '">' +
      '<span class="feedback-icoon">' + icoon + '</span>' +
      '<div><strong>' + kop + '</strong><p>' + (gekozenUitleg || q.explanation || "") + '</p>' +
      (extra ? '<p class="feedback-extra">' + extra + '</p>' : '') +
      '</div></div>' +
      '<div class="feedback-acties"><button class="knop knop-primair knop-klein" type="button" data-action="volgende">' + (huidigeVraag + 1 >= aantal ? "NIVEAU AFRONDEN" : "VOLGENDE VRAAG") + ' →</button></div>';
  }

  function renderMeerkeuzeVraag(q, vraagIndex, totaal, isFeit) {
    const isBeantwoord = feedback && feedback.id === q.id;
    const opties = isFeit ? ["WAAR", "NIET WAAR"] : q.options;
    const letters = isFeit ? ["W", "N"] : ["A", "B", "C", "D"];
    const optiesHtml = opties.map((tekst, index) => {
      let klasse = "";
      if (isBeantwoord && index === q.correctIndex) klasse = " goed";
      else if (isBeantwoord && index === feedback.gekozen && !feedback.goed) klasse = " fout";
      return '<button class="antwoord-knop' + klasse + '" type="button" data-action="antwoord" data-index="' + index + '"' + (isBeantwoord ? " disabled" : "") + '><span class="antwoord-letter">' + letters[index] + '</span><span>' + tekst + '</span></button>';
    }).join("");
    const intro = isFeit ? '<p class="vraag-context">Beslis of de bewering waar of niet waar is.</p>' : '<p class="vraag-context">' + q.context + '</p>';
    const titel = isFeit ? "FEIT OF FABEL" : "KENNISVRAAG";
    let feedbackHtml = "";
    if (isBeantwoord) {
      const correctText = isFeit ? (q.correctIndex === 0 ? "Waar" : "Niet waar") : q.options[q.correctIndex];
      const extra = feedback.goed ? "" : (feedback.eerderGoed ? "Je had deze vraag eerder al goed beantwoord; dat punt blijft staan." : "Het juiste antwoord: " + correctText + ".");
      feedbackHtml = renderFeedback(q, feedback.goed, q.explanation, extra);
    }
    return '<div class="paneel vraag-paneel"><span class="vraag-label">' + titel + '</span><h2 class="vraag-titel">' + q.prompt + '</h2>' + intro +
      '<div class="antwoord-opties">' + optiesHtml + '</div>' + feedbackHtml + '</div>';
  }

  function renderScenarioVraag(q) {
    const isBeantwoord = feedback && feedback.id === q.id;
    const optiesHtml = q.options.map((optie, index) => {
      let klasse = "";
      if (isBeantwoord && optie.best) klasse = " goed";
      else if (isBeantwoord && index === feedback.gekozen && !feedback.goed) klasse = " fout";
      return '<button class="antwoord-knop' + klasse + '" type="button" data-action="antwoord" data-index="' + index + '"' + (isBeantwoord ? " disabled" : "") + '><span class="antwoord-letter">' + String.fromCharCode(65 + index) + '</span><span>' + optie.text + '</span></button>';
    }).join("");
    let feedbackHtml = "";
    if (isBeantwoord) {
      const gekozen = q.options[feedback.gekozen];
      const extra = feedback.goed ? q.bestReason : (feedback.eerderGoed ? "Je had deze situatie eerder al goed opgelost; dat punt blijft staan." : "Een handigere aanpak: " + q.bestReason);
      feedbackHtml = renderFeedback(q, feedback.goed, gekozen.outcome, extra);
    }
    return '<div class="paneel vraag-paneel"><span class="vraag-label">SITUATIE · JOUW KEUZE</span><h2 class="vraag-titel">' + q.prompt + '</h2><p class="vraag-context">' + q.context + '</p><div class="antwoord-opties scenario-opties">' + optiesHtml + '</div>' + feedbackHtml + '</div>';
  }

  function renderCodeVraag() {
    return '<div class="paneel vraag-paneel code-paneel">' +
      '<span class="vraag-label">LAATSTE NIVEAU · DIGITAAL SLOT</span>' +
      '<h2 class="vraag-titel">Kraak de viercijferige code</h2>' +
      '<p class="vraag-context">De uitgang is bijna open. Combineer de regels en feiten uit de vorige levels om de code te vinden.</p>' +
      '<div class="code-cijfers" aria-label="Vier cijfers nodig"><span>?</span><span>?</span><span>?</span><span>?</span></div>' +
      '<div class="code-aanwijzingen"><div class="code-aanwijzing"><b>1–2</b><span>In Nederland mag een vape pas vanaf welke leeftijd worden verkocht? Gebruik beide cijfers.</span></div><div class="code-aanwijzing"><b>3</b><span>Hoeveel milliliter mag het reservoir van een vape maximaal bevatten volgens de Nederlandse regels?</span></div><div class="code-aanwijzing"><b>4</b><span>In welk jaar ging het verbod op de verkoop van wegwerpvapes in het Verenigd Koninkrijk in? Gebruik alleen het laatste cijfer.</span></div></div>' +
      '<form class="code-formulier" id="code-formulier"><label class="mini-label" for="code-invoer" style="position:absolute;left:-9999px">Voer de viercijferige code in</label><input class="code-invoer" id="code-invoer" name="code" type="text" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="0000" aria-describedby="code-melding"><button class="knop knop-primair" type="submit">OPEN HET SLOT →</button></form>' +
      '<p class="code-melding" id="code-melding" role="status">' + (codeMelding || "Tip: bekijk de uitleg en de landenregels nog eens als je twijfelt.") + '</p>' +
      '</div>';
  }

  function renderLevel() {
    const total = huidigLevel === 0 ? factsQuestions.length : (huidigLevel === 1 ? truthQuestions.length : (huidigLevel === 2 ? scenarios.length : 1));
    const inhoud = '<div class="spel-hoofd">' + terugKnop("Naar de missiekaart") + renderSpelBalk(huidigLevel, huidigeVraag, total) +
      (huidigLevel === 0 ? renderMeerkeuzeVraag(factsQuestions[huidigeVraag], huidigeVraag, total, false) :
      (huidigLevel === 1 ? renderMeerkeuzeVraag(truthQuestions[huidigeVraag], huidigeVraag, total, true) :
      (huidigLevel === 2 ? renderScenarioVraag(scenarios[huidigeVraag]) : renderCodeVraag()))) +
      '</div>';
    return '<section class="pagina"><div class="spel-layout">' + inhoud + renderZijbalk(huidigLevel) + '</div></section>';
  }

  function renderLevelKlaar() {
    const next = huidigLevel + 1;
    return '<section class="pagina"><div class="paneel afrond-kaart">' +
      '<div class="afrond-embleem">✓</div><p class="bovenlabel" style="justify-content:center">NIVEAU VOLTOOID</p>' +
      '<h1 class="titel-middel">' + levelNames[huidigLevel] + '</h1>' +
      '<p>Je hebt dit level afgerond. Bekijk de uitleg die je hebt gekregen en ga daarna door naar de volgende uitdaging.</p>' +
      '<div class="afrond-statistieken"><div class="statistiek"><strong>' + levelPunten(huidigLevel) + '</strong><span>Punten in dit niveau</span></div><div class="statistiek"><strong>' + score() + '</strong><span>Totaal aantal punten</span></div><div class="statistiek"><strong>' + afgerondeLevels() + ' / 4</strong><span>Levels afgerond</span></div></div>' +
      '<div class="eindboodschap">Je voortgang is opgeslagen. Het volgende level is nu vrijgespeeld.</div>' +
      '<div class="rij-knoppen"><button class="knop knop-secundair" type="button" data-action="naar-kaart">MISSIEKAART</button>' +
      (next < 4 ? '<button class="knop knop-primair" type="button" data-action="volgend-level">VOLGEND NIVEAU →</button>' : '<button class="knop knop-primair" type="button" data-action="eindscherm">BEKIJK RESULTAAT →</button>') +
      '</div></div></section>';
  }

  function renderEindscherm() {
    const goed = aantalGoed();
    const percentage = Math.round((goed / TOTAL_QUESTIONS) * 100);
    return '<section class="pagina"><div class="paneel afrond-kaart">' +
      '<div class="afrond-embleem">✦</div><p class="bovenlabel" style="justify-content:center">MISSIE GESLAAGD</p>' +
      '<h1 class="titel-middel">JE BENT ONTSNAPT<br><span class="accent">AAN DE VAPEVAL!</span></h1>' +
      '<p>Je hebt alle vier de levels voltooid en de uitgang gevonden. Bekijk wat je hebt verzameld.</p>' +
      '<div class="afrond-statistieken"><div class="statistiek"><strong>' + score() + '</strong><span>Van 170 punten</span></div><div class="statistiek"><strong>' + percentage + '%</strong><span>Goed beantwoord</span></div><div class="statistiek"><strong>' + goed + ' / 17</strong><span>Goede antwoorden</span></div></div>' +
      '<div class="eindboodschap"><strong>JE BENT ONTSNAPT AAN DE VAPEVAL!</strong><br>Onthoud: jouw toekomst is meer waard dan een vape. Je hoeft niet mee te doen met groepsdruk. Hulp vragen of nee zeggen is juist sterk.</div>' +
      '<div class="rij-knoppen"><button class="knop knop-secundair" type="button" data-action="naar-kaart">BEKIJK NIVEAUS</button><button class="knop knop-primair" type="button" data-action="reset">SPEEL OPNIEUW ↻</button></div>' +
      '</div></section>';
  }

  function render() {
    let inhoud = "";
    if (pagina === "start") inhoud = renderStart();
    else if (pagina === "hoe") inhoud = renderHoe();
    else if (pagina === "kaart") inhoud = renderKaart();
    else if (pagina === "spel") inhoud = renderLevel();
    else if (pagina === "level-klaar") inhoud = renderLevelKlaar();
    else if (pagina === "eind") inhoud = renderEindscherm();
    app.innerHTML = inhoud;
    werkGeluidBij();
  }

  function startLevel(index) {
    if (!isLevelVrij(index)) return;
    huidigLevel = index;
    huidigeVraag = 0;
    feedback = null;
    codeMelding = "";
    codePogingen = 0;
    gaNaar("spel");
  }

  function registreerAntwoord(id, goed) {
    if (voortgang.answers[id] !== true) {
      voortgang.answers[id] = goed;
    }
    bewaarVoortgang();
  }

  function antwoordOpVraag(index) {
    if (feedback) return;
    let vraag;
    if (huidigLevel === 0) vraag = factsQuestions[huidigeVraag];
    else if (huidigLevel === 1) vraag = truthQuestions[huidigeVraag];
    else if (huidigLevel === 2) vraag = scenarios[huidigeVraag];
    if (!vraag) return;
    const goed = huidigLevel === 2 ? vraag.options[index].best : index === vraag.correctIndex;
    const eerderGoed = voortgang.answers[vraag.id] === true;
    registreerAntwoord(vraag.id, goed);
    feedback = { id: vraag.id, gekozen: index, goed: goed, eerderGoed: eerderGoed };
    speelGeluid(goed);
    render();
  }

  function volgendeVraag() {
    feedback = null;
    const totaal = huidigLevel === 0 ? factsQuestions.length : (huidigLevel === 1 ? truthQuestions.length : scenarios.length);
    if (huidigeVraag + 1 < totaal) {
      huidigeVraag += 1;
      render();
    } else {
      rondLevelAf();
    }
  }

  function rondLevelAf() {
    voortgang.completed[huidigLevel] = true;
    bewaarVoortgang();
    if (huidigLevel === 3) {
      gaNaar("eind");
    } else {
      gaNaar("level-klaar");
    }
    speelGeluid(true);
  }

  function controleerCode() {
    const invoer = document.getElementById("code-invoer");
    if (!invoer) return;
    const waarde = invoer.value.trim();
    if (!/^[0-9]{4}$/.test(waarde)) {
      codeMelding = "Vul precies vier cijfers in.";
      render();
      document.getElementById("code-invoer").focus();
      return;
    }
    codePogingen += 1;
    if (waarde === "1825") {
      registreerAntwoord("escape-code", true);
      voortgang.completed[3] = true;
      bewaarVoortgang();
      speelGeluid(true);
      gaNaar("eind");
    } else {
      speelGeluid(false);
      const hints = [
        "Controleer de Nederlandse minimumleeftijd en de maximale inhoud van het reservoir.",
        "Denk aan de leeftijd van 18 jaar, het reservoir van 2 ml en het Britse verbodsjaar 2025.",
        "Je bent er bijna. De cijfers vormen samen: leeftijd (2 cijfers), reservoir (1 cijfer), laatste cijfer van het jaartal (1 cijfer)."
      ];
      codeMelding = "Dat is niet de juiste code. " + hints[Math.min(codePogingen - 1, hints.length - 1)];
      render();
      document.getElementById("code-invoer").focus();
    }
  }

  function resetSpel() {
    const bevestiging = window.confirm("Weet je zeker dat je opnieuw wilt beginnen? Je score en vrijgespeelde levels worden op dit apparaat gewist.");
    if (!bevestiging) return;
    voortgang = legeVoortgang();
    bewaarVoortgang();
    huidigeVraag = 0;
    feedback = null;
    codeMelding = "";
    codePogingen = 0;
    gaNaar("start");
  }

  app.addEventListener("click", event => {
    const knopElement = event.target.closest("button");
    if (!knopElement || knopElement.disabled) return;
    if (knopElement.id === "start-knop") {
      gaNaar("kaart");
    } else if (knopElement.id === "hoe-knop") {
      gaNaar("hoe");
    } else if (knopElement.dataset.action === "naar-kaart") {
      gaNaar("kaart");
    } else if (knopElement.dataset.action === "naar-start") {
      gaNaar("start");
    } else if (knopElement.dataset.action === "start-level") {
      startLevel(Number(knopElement.dataset.level));
    } else if (knopElement.dataset.action === "antwoord") {
      antwoordOpVraag(Number(knopElement.dataset.index));
    } else if (knopElement.dataset.action === "volgende") {
      volgendeVraag();
    } else if (knopElement.dataset.action === "volgend-level") {
      startLevel(huidigLevel + 1);
    } else if (knopElement.dataset.action === "eindscherm") {
      gaNaar("eind");
    } else if (knopElement.dataset.action === "reset") {
      resetSpel();
    }
  });

  app.addEventListener("submit", event => {
    if (event.target && event.target.id === "code-formulier") {
      event.preventDefault();
      controleerCode();
    }
  });

  soundButton.addEventListener("click", () => {
    geluidAan = !geluidAan;
    werkGeluidBij();
    if (geluidAan) speelGeluid(true);
  });

  brandButton.addEventListener("click", event => {
    event.preventDefault();
    gaNaar("start");
  });

  render();
})();