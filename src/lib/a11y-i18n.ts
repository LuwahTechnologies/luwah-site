// Interface-language strings for the Accessibility Center panel only.
// This translates the WIDGET UI, never the site's own content. Every
// user-visible string inside the panel (profiles, cards, tiles, shortcut
// rows, report tab copy, structure view, the hide-interface confirm) is
// looked up here by language code. Persisted separately from the a11y
// prefs object (a11y-lang), read once on mount and changed from the
// language picker in the panel header.
//
// Read mode's overlay (src/components/a11y/ReadMode.tsx) is NOT covered
// here on purpose: it renders outside the panel, over the page's own
// content, and its two static labels ("Read mode" / "Close") are left in
// English. See .pipeline/changes.md for that deviation and the reasoning.

export type LangCode =
  | "en-US"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "nl"
  | "pl"
  | "tr"
  | "ru"
  | "ar"
  | "he"
  | "zh-CN"
  | "zh-TW"
  | "ja";

export const DEFAULT_LANG: LangCode = "en-US";

export const LANGUAGES: { code: LangCode; name: string; rtl?: boolean }[] = [
  { code: "en-US", name: "English (US)" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "it", name: "Italiano" },
  { code: "nl", name: "Nederlands" },
  { code: "pl", name: "Polski" },
  { code: "tr", name: "Türkçe" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية", rtl: true },
  { code: "he", name: "עברית", rtl: true },
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "ja", name: "日本語" },
];

export function isRtlLang(lang: LangCode): boolean {
  return lang === "ar" || lang === "he";
}

type ProfileStrings = { name: string; description: string };
type ShortcutStrings = { title: string; caption: string };

export type A11yStrings = {
  launcher: { ariaLabel: string; pill: string };
  header: { title: string; subtitle: string; close: string };
  language: { choose: string; current: string; pickerTitle: string; back: string };
  tabs: { tools: string; report: string };
  profiles: {
    title: string;
    subtitle: string;
    resetAll: string;
    epilepsy: ProfileStrings;
    vision: ProfileStrings;
    older: ProfileStrings;
    cognitive: ProfileStrings;
    adhd: ProfileStrings;
    blind: ProfileStrings;
    motor: ProfileStrings;
  };
  quickActions: { navigateStructure: string; showShortcuts: string };
  content: {
    title: string;
    contentScaling: string;
    lineHeight: string;
    letterSpacing: string;
    textAlignGroup: string;
    alignLeft: string;
    alignCenter: string;
    alignRight: string;
    left: string;
    center: string;
    right: string;
    textSize: string;
    font: string;
    highlight: string;
    magnifier: string;
    states: {
      largeText: { off: string; large: string; larger: string };
      font: { default: string; serif: string; readable: string };
      highlight: { off: string; links: string; headings: string; all: string };
    };
  };
  color: {
    title: string;
    contrast: string;
    saturation: string;
    textColors: string;
    titleColors: string;
    backgroundColors: string;
    cancel: string;
    states: {
      contrast: { off: string; high: string; inverted: string; dark: string; light: string };
      saturation: { off: string; high: string; low: string; monochrome: string };
    };
    swatches: {
      blue: string;
      purple: string;
      red: string;
      orange: string;
      teal: string;
      green: string;
      white: string;
      black: string;
    };
  };
  orientation: {
    title: string;
    muteSounds: string;
    hideImages: string;
    readMode: string;
    guide: string;
    window: string;
    animation: string;
    hover: string;
    focus: string;
    cursor: string;
    altText: string;
    usefulLinks: string;
    selectAPage: string;
    hideInterface: string;
    states: { cursor: { off: string; black: string; white: string } };
    links: {
      home: string;
      services: string;
      schedule: string;
      contact: string;
      patientInfo: string;
      statement: string;
    };
  };
  confirmHide: { title: string; body: string; cancel: string; confirm: string };
  shortcuts: {
    reset: ShortcutStrings;
    report: ShortcutStrings;
    structure: ShortcutStrings;
    close: ShortcutStrings;
    statement: ShortcutStrings;
    contentScaling: ShortcutStrings;
    usefulLinks: ShortcutStrings;
  };
  report: { title: string; subtitle: string };
  structure: { title: string; back: string; landmarks: string; headings: string; links: string; topOfPage: string };
  footer: { statement: string };
  common: { decrease: string; increase: string; activateNext: string; esc: string };
};

const EN: A11yStrings = {
  launcher: { ariaLabel: "Explore your accessibility options", pill: "Explore your accessibility options" },
  header: {
    title: "Accessibility Center",
    subtitle: "Adjust this site to your needs",
    close: "Close accessibility center",
  },
  language: {
    choose: "Choose interface language",
    current: "Current language",
    pickerTitle: "Choose a language",
    back: "Back",
  },
  tabs: { tools: "Personalization", report: "Report Issue" },
  profiles: {
    title: "Accessibility Profiles",
    subtitle: "One-tap presets that combine the adjustments below.",
    resetAll: "Reset all",
    epilepsy: {
      name: "Epilepsy Safe",
      description: "Stops animations and removes color intensity to reduce seizure risk.",
    },
    vision: {
      name: "Vision Impaired",
      description: "Larger text in a high-legibility font with wider line height and letter spacing.",
    },
    older: {
      name: "Older Adults",
      description: "Larger text, a high-legibility font, higher contrast, and highlighted links.",
    },
    cognitive: {
      name: "Cognitive Disability",
      description: "Highlights links and headings and adds a reading guide to aid focus.",
    },
    adhd: {
      name: "ADHD Friendly",
      description: "Cuts distractions with a focused reading window and less motion.",
    },
    blind: {
      name: "Blind Users (Screen-reader)",
      description: "Surfaces image descriptions for JAWS, NVDA, VoiceOver, and TalkBack users.",
    },
    motor: {
      name: "Keyboard Navigation (Motor)",
      description: "Strong focus outlines and a large black cursor for keyboard-first use.",
    },
  },
  quickActions: { navigateStructure: "Navigate by page structure", showShortcuts: "Show shortcuts" },
  content: {
    title: "Content Adjustments",
    contentScaling: "Content Scaling",
    lineHeight: "Line Height",
    letterSpacing: "Letter Spacing",
    textAlignGroup: "Text Align",
    alignLeft: "Align text left",
    alignCenter: "Align text center",
    alignRight: "Align text right",
    left: "Left",
    center: "Center",
    right: "Right",
    textSize: "Text Size",
    font: "Font",
    highlight: "Highlight",
    magnifier: "Magnifier",
    states: {
      largeText: { off: "Off", large: "Large", larger: "Larger" },
      font: { default: "Default", serif: "Serif", readable: "Readable" },
      highlight: { off: "Off", links: "Links", headings: "Headings", all: "All" },
    },
  },
  color: {
    title: "Color Adjustments",
    contrast: "Contrast",
    saturation: "Saturation",
    textColors: "Adjust Text Colors",
    titleColors: "Adjust Title Colors",
    backgroundColors: "Adjust Background Colors",
    cancel: "Cancel",
    states: {
      contrast: { off: "Off", high: "High", inverted: "Inverted", dark: "Dark", light: "Light" },
      saturation: { off: "Off", high: "High", low: "Low", monochrome: "Monochrome" },
    },
    swatches: {
      blue: "Blue",
      purple: "Purple",
      red: "Red",
      orange: "Orange",
      teal: "Teal",
      green: "Green",
      white: "White",
      black: "Black",
    },
  },
  orientation: {
    title: "Orientation Adjustments",
    muteSounds: "Mute Sounds",
    hideImages: "Hide Images",
    readMode: "Read Mode",
    guide: "Guide",
    window: "Window",
    animation: "Animation",
    hover: "Hover",
    focus: "Focus",
    cursor: "Cursor",
    altText: "Alt Text",
    usefulLinks: "Useful Links",
    selectAPage: "Select a page",
    hideInterface: "Hide Interface",
    states: { cursor: { off: "Off", black: "Black", white: "White" } },
    links: {
      home: "Home",
      services: "Services",
      schedule: "Schedule an appointment",
      contact: "Contact us",
      patientInfo: "Patient information",
      statement: "Accessibility statement",
    },
  },
  confirmHide: {
    title: "Hide the accessibility interface?",
    body: "This hides the accessibility button on every page. To bring it back, clear this site's browsing data in your browser and reload the page.",
    cancel: "Cancel",
    confirm: "Hide interface",
  },
  shortcuts: {
    reset: { title: "Reset Visual Toolkit", caption: 'Press the SHIFT key + the "r" key' },
    report: { title: "Report issue", caption: 'Press "h"' },
    structure: { title: "Navigate by page structure", caption: 'Press "n"' },
    close: { title: "Close Accessibility Center", caption: 'Use the "escape" key' },
    statement: { title: "View Accessibility Statement", caption: 'Press "b"' },
    contentScaling: { title: "Content scaling", caption: 'Press "[" or "]"' },
    usefulLinks: { title: "Useful links", caption: 'Press "u"' },
  },
  report: { title: "Report an accessibility issue", subtitle: "Please describe the accessibility issue you encountered" },
  structure: {
    title: "Page Structure",
    back: "Back to accessibility tools",
    landmarks: "Landmarks",
    headings: "Headings",
    links: "Links",
    topOfPage: "Top of page",
  },
  footer: { statement: "Accessibility Statement" },
  common: { decrease: "Decrease", increase: "Increase", activateNext: "Activate for next option.", esc: "esc" },
};

const ES: A11yStrings = {
  launcher: { ariaLabel: "Explora tus opciones de accesibilidad", pill: "Explora tus opciones de accesibilidad" },
  header: { title: "Centro de accesibilidad", subtitle: "Ajusta este sitio a tus necesidades", close: "Cerrar el centro de accesibilidad" },
  language: { choose: "Elegir idioma de la interfaz", current: "Idioma actual", pickerTitle: "Elige un idioma", back: "Volver" },
  tabs: { tools: "Personalización", report: "Reportar un problema" },
  profiles: {
    title: "Perfiles de accesibilidad",
    subtitle: "Ajustes predefinidos que combinan las opciones de abajo.",
    resetAll: "Restablecer todo",
    epilepsy: { name: "Seguro para epilepsia", description: "Detiene las animaciones y reduce la intensidad del color para bajar el riesgo de convulsiones." },
    vision: { name: "Discapacidad visual", description: "Texto más grande con una fuente de alta legibilidad, mayor interlineado y espaciado entre letras." },
    older: { name: "Adultos mayores", description: "Texto más grande, una fuente de alta legibilidad, mayor contraste y enlaces resaltados." },
    cognitive: { name: "Discapacidad cognitiva", description: "Resalta enlaces y encabezados y añade una guía de lectura para ayudar a enfocarse." },
    adhd: { name: "Amigable con el TDAH", description: "Reduce distracciones con una ventana de lectura enfocada y menos movimiento." },
    blind: { name: "Usuarios ciegos (lector de pantalla)", description: "Muestra descripciones de imágenes para JAWS, NVDA, VoiceOver y TalkBack." },
    motor: { name: "Navegación por teclado (motriz)", description: "Contornos de enfoque fuertes y un cursor negro grande para el uso con teclado." },
  },
  quickActions: { navigateStructure: "Navegar por la estructura de la página", showShortcuts: "Mostrar atajos" },
  content: {
    title: "Ajustes de contenido",
    contentScaling: "Escala del contenido",
    lineHeight: "Interlineado",
    letterSpacing: "Espaciado entre letras",
    textAlignGroup: "Alineación del texto",
    alignLeft: "Alinear texto a la izquierda",
    alignCenter: "Alinear texto al centro",
    alignRight: "Alinear texto a la derecha",
    left: "Izquierda",
    center: "Centro",
    right: "Derecha",
    textSize: "Tamaño del texto",
    font: "Fuente",
    highlight: "Resaltado",
    magnifier: "Lupa de texto",
    states: {
      largeText: { off: "Normal", large: "Grande", larger: "Más grande" },
      font: { default: "Predeterminada", serif: "Serif", readable: "Legible" },
      highlight: { off: "Ninguno", links: "Enlaces", headings: "Encabezados", all: "Todo" },
    },
  },
  color: {
    title: "Ajustes de color",
    contrast: "Contraste",
    saturation: "Saturación",
    textColors: "Ajustar colores de texto",
    titleColors: "Ajustar colores de títulos",
    backgroundColors: "Ajustar colores de fondo",
    cancel: "Cancelar",
    states: {
      contrast: { off: "Ninguno", high: "Alto", inverted: "Invertido", dark: "Oscuro", light: "Claro" },
      saturation: { off: "Ninguna", high: "Alta", low: "Baja", monochrome: "Monocromo" },
    },
    swatches: { blue: "Azul", purple: "Morado", red: "Rojo", orange: "Naranja", teal: "Verde azulado", green: "Verde", white: "Blanco", black: "Negro" },
  },
  orientation: {
    title: "Ajustes de orientación",
    muteSounds: "Silenciar sonidos",
    hideImages: "Ocultar imágenes",
    readMode: "Modo lectura",
    guide: "Guía",
    window: "Ventana",
    animation: "Animación",
    hover: "Resaltar al pasar el cursor",
    focus: "Enfoque",
    cursor: "Cursor",
    altText: "Texto alternativo",
    usefulLinks: "Enlaces útiles",
    selectAPage: "Selecciona una página",
    hideInterface: "Ocultar interfaz",
    states: { cursor: { off: "Normal", black: "Negro", white: "Blanco" } },
    links: { home: "Inicio", services: "Servicios", schedule: "Programar una cita", contact: "Contáctanos", patientInfo: "Información para pacientes", statement: "Declaración de accesibilidad" },
  },
  confirmHide: {
    title: "¿Ocultar la interfaz de accesibilidad?",
    body: "Esto oculta el botón de accesibilidad en todas las páginas. Para recuperarlo, borra los datos de navegación de este sitio en tu navegador y vuelve a cargar la página.",
    cancel: "Cancelar",
    confirm: "Ocultar interfaz",
  },
  shortcuts: {
    reset: { title: "Restablecer panel visual", caption: 'Presiona MAYÚS + la tecla "r"' },
    report: { title: "Reportar un problema", caption: 'Presiona "h"' },
    structure: { title: "Navegar por la estructura de la página", caption: 'Presiona "n"' },
    close: { title: "Cerrar el centro de accesibilidad", caption: 'Usa la tecla "escape"' },
    statement: { title: "Ver la declaración de accesibilidad", caption: 'Presiona "b"' },
    contentScaling: { title: "Escala del contenido", caption: 'Presiona "[" o "]"' },
    usefulLinks: { title: "Enlaces útiles", caption: 'Presiona "u"' },
  },
  report: { title: "Reportar un problema de accesibilidad", subtitle: "Describe el problema de accesibilidad que encontraste" },
  structure: { title: "Estructura de la página", back: "Volver a las herramientas de accesibilidad", landmarks: "Puntos de referencia", headings: "Encabezados", links: "Enlaces", topOfPage: "Inicio de la página" },
  footer: { statement: "Declaración de accesibilidad" },
  common: { decrease: "Disminuir", increase: "Aumentar", activateNext: "Actívalo para pasar a la siguiente opción.", esc: "esc" },
};

const FR: A11yStrings = {
  launcher: { ariaLabel: "Découvrez vos options d'accessibilité", pill: "Découvrez vos options d'accessibilité" },
  header: { title: "Centre d'accessibilité", subtitle: "Adaptez ce site à vos besoins", close: "Fermer le centre d'accessibilité" },
  language: { choose: "Choisir la langue de l'interface", current: "Langue actuelle", pickerTitle: "Choisissez une langue", back: "Retour" },
  tabs: { tools: "Personnalisation", report: "Signaler un problème" },
  profiles: {
    title: "Profils d'accessibilité",
    subtitle: "Des préréglages en un clic qui combinent les réglages ci-dessous.",
    resetAll: "Tout réinitialiser",
    epilepsy: { name: "Sécurité épilepsie", description: "Arrête les animations et réduit l'intensité des couleurs pour limiter le risque de crise." },
    vision: { name: "Déficience visuelle", description: "Texte agrandi dans une police très lisible, avec un interligne et un espacement des lettres plus larges." },
    older: { name: "Personnes âgées", description: "Texte agrandi, police très lisible, contraste plus élevé et liens surlignés." },
    cognitive: { name: "Handicap cognitif", description: "Met en évidence les liens et les titres et ajoute un guide de lecture pour aider la concentration." },
    adhd: { name: "Adapté au TDAH", description: "Réduit les distractions avec une fenêtre de lecture ciblée et moins de mouvement." },
    blind: { name: "Utilisateurs aveugles (lecteur d'écran)", description: "Affiche les descriptions d'images pour JAWS, NVDA, VoiceOver et TalkBack." },
    motor: { name: "Navigation au clavier (motricité)", description: "Contours de focus renforcés et grand curseur noir pour une utilisation au clavier." },
  },
  quickActions: { navigateStructure: "Naviguer par la structure de la page", showShortcuts: "Afficher les raccourcis" },
  content: {
    title: "Ajustements du contenu",
    contentScaling: "Mise à l'échelle du contenu",
    lineHeight: "Interligne",
    letterSpacing: "Espacement des lettres",
    textAlignGroup: "Alignement du texte",
    alignLeft: "Aligner le texte à gauche",
    alignCenter: "Centrer le texte",
    alignRight: "Aligner le texte à droite",
    left: "Gauche",
    center: "Centre",
    right: "Droite",
    textSize: "Taille du texte",
    font: "Police",
    highlight: "Surlignage",
    magnifier: "Loupe de texte",
    states: {
      largeText: { off: "Normal", large: "Grand", larger: "Plus grand" },
      font: { default: "Par défaut", serif: "Serif", readable: "Lisible" },
      highlight: { off: "Aucun", links: "Liens", headings: "Titres", all: "Tout" },
    },
  },
  color: {
    title: "Ajustements de couleur",
    contrast: "Contraste",
    saturation: "Saturation",
    textColors: "Ajuster les couleurs du texte",
    titleColors: "Ajuster les couleurs des titres",
    backgroundColors: "Ajuster les couleurs de fond",
    cancel: "Annuler",
    states: {
      contrast: { off: "Aucun", high: "Élevé", inverted: "Inversé", dark: "Sombre", light: "Clair" },
      saturation: { off: "Aucune", high: "Élevée", low: "Faible", monochrome: "Monochrome" },
    },
    swatches: { blue: "Bleu", purple: "Violet", red: "Rouge", orange: "Orange", teal: "Sarcelle", green: "Vert", white: "Blanc", black: "Noir" },
  },
  orientation: {
    title: "Ajustements d'orientation",
    muteSounds: "Couper le son",
    hideImages: "Masquer les images",
    readMode: "Mode lecture",
    guide: "Guide",
    window: "Fenêtre",
    animation: "Animation",
    hover: "Survol",
    focus: "Focus",
    cursor: "Curseur",
    altText: "Texte alternatif",
    usefulLinks: "Liens utiles",
    selectAPage: "Sélectionnez une page",
    hideInterface: "Masquer l'interface",
    states: { cursor: { off: "Normal", black: "Noir", white: "Blanc" } },
    links: { home: "Accueil", services: "Services", schedule: "Prendre rendez-vous", contact: "Nous contacter", patientInfo: "Informations pour les patients", statement: "Déclaration d'accessibilité" },
  },
  confirmHide: {
    title: "Masquer l'interface d'accessibilité ?",
    body: "Cela masque le bouton d'accessibilité sur toutes les pages. Pour le faire réapparaître, effacez les données de navigation de ce site dans votre navigateur puis rechargez la page.",
    cancel: "Annuler",
    confirm: "Masquer l'interface",
  },
  shortcuts: {
    reset: { title: "Réinitialiser le panneau visuel", caption: 'Appuyez sur MAJ + la touche "r"' },
    report: { title: "Signaler un problème", caption: 'Appuyez sur "h"' },
    structure: { title: "Naviguer par la structure de la page", caption: 'Appuyez sur "n"' },
    close: { title: "Fermer le centre d'accessibilité", caption: 'Utilisez la touche "échap"' },
    statement: { title: "Voir la déclaration d'accessibilité", caption: 'Appuyez sur "b"' },
    contentScaling: { title: "Mise à l'échelle du contenu", caption: 'Appuyez sur "[" ou "]"' },
    usefulLinks: { title: "Liens utiles", caption: 'Appuyez sur "u"' },
  },
  report: { title: "Signaler un problème d'accessibilité", subtitle: "Décrivez le problème d'accessibilité que vous avez rencontré" },
  structure: { title: "Structure de la page", back: "Retour aux outils d'accessibilité", landmarks: "Repères", headings: "Titres", links: "Liens", topOfPage: "Haut de la page" },
  footer: { statement: "Déclaration d'accessibilité" },
  common: { decrease: "Diminuer", increase: "Augmenter", activateNext: "Activez pour passer à l'option suivante.", esc: "échap" },
};

const DE: A11yStrings = {
  launcher: { ariaLabel: "Barrierefreiheitsoptionen entdecken", pill: "Barrierefreiheitsoptionen entdecken" },
  header: { title: "Zentrum für Barrierefreiheit", subtitle: "Passen Sie diese Website an Ihre Bedürfnisse an", close: "Zentrum für Barrierefreiheit schließen" },
  language: { choose: "Oberflächensprache wählen", current: "Aktuelle Sprache", pickerTitle: "Sprache wählen", back: "Zurück" },
  tabs: { tools: "Personalisierung", report: "Problem melden" },
  profiles: {
    title: "Barrierefreiheitsprofile",
    subtitle: "Voreinstellungen, die die folgenden Anpassungen kombinieren.",
    resetAll: "Alles zurücksetzen",
    epilepsy: { name: "Epilepsie-sicher", description: "Stoppt Animationen und reduziert die Farbintensität, um das Anfallsrisiko zu senken." },
    vision: { name: "Sehbehinderung", description: "Größerer Text in einer gut lesbaren Schrift mit größerem Zeilen- und Buchstabenabstand." },
    older: { name: "Ältere Erwachsene", description: "Größerer Text, eine gut lesbare Schrift, höherer Kontrast und hervorgehobene Links." },
    cognitive: { name: "Kognitive Beeinträchtigung", description: "Hebt Links und Überschriften hervor und fügt eine Lesehilfe zur Fokussierung hinzu." },
    adhd: { name: "ADHS-freundlich", description: "Reduziert Ablenkungen durch ein fokussiertes Lesefenster und weniger Bewegung." },
    blind: { name: "Blinde Nutzer (Screenreader)", description: "Zeigt Bildbeschreibungen für JAWS, NVDA, VoiceOver und TalkBack an." },
    motor: { name: "Tastaturnavigation (motorisch)", description: "Starke Fokusumrandungen und ein großer schwarzer Cursor für die Tastaturbedienung." },
  },
  quickActions: { navigateStructure: "Nach Seitenstruktur navigieren", showShortcuts: "Tastenkürzel anzeigen" },
  content: {
    title: "Inhaltsanpassungen",
    contentScaling: "Inhaltsskalierung",
    lineHeight: "Zeilenhöhe",
    letterSpacing: "Buchstabenabstand",
    textAlignGroup: "Textausrichtung",
    alignLeft: "Text linksbündig ausrichten",
    alignCenter: "Text zentrieren",
    alignRight: "Text rechtsbündig ausrichten",
    left: "Links",
    center: "Mitte",
    right: "Rechts",
    textSize: "Textgröße",
    font: "Schriftart",
    highlight: "Hervorhebung",
    magnifier: "Textlupe",
    states: {
      largeText: { off: "Normal", large: "Groß", larger: "Größer" },
      font: { default: "Standard", serif: "Serif", readable: "Gut lesbar" },
      highlight: { off: "Aus", links: "Links", headings: "Überschriften", all: "Alle" },
    },
  },
  color: {
    title: "Farbanpassungen",
    contrast: "Kontrast",
    saturation: "Sättigung",
    textColors: "Textfarben anpassen",
    titleColors: "Überschriftenfarben anpassen",
    backgroundColors: "Hintergrundfarben anpassen",
    cancel: "Abbrechen",
    states: {
      contrast: { off: "Aus", high: "Hoch", inverted: "Invertiert", dark: "Dunkel", light: "Hell" },
      saturation: { off: "Aus", high: "Hoch", low: "Niedrig", monochrome: "Einfarbig" },
    },
    swatches: { blue: "Blau", purple: "Violett", red: "Rot", orange: "Orange", teal: "Petrol", green: "Grün", white: "Weiß", black: "Schwarz" },
  },
  orientation: {
    title: "Orientierungsanpassungen",
    muteSounds: "Ton stummschalten",
    hideImages: "Bilder ausblenden",
    readMode: "Lesemodus",
    guide: "Führungslinie",
    window: "Fenster",
    animation: "Animation",
    hover: "Hover-Hervorhebung",
    focus: "Fokus",
    cursor: "Cursor",
    altText: "Alternativtext",
    usefulLinks: "Nützliche Links",
    selectAPage: "Seite auswählen",
    hideInterface: "Oberfläche ausblenden",
    states: { cursor: { off: "Normal", black: "Schwarz", white: "Weiß" } },
    links: { home: "Startseite", services: "Leistungen", schedule: "Termin vereinbaren", contact: "Kontakt", patientInfo: "Patienteninformationen", statement: "Erklärung zur Barrierefreiheit" },
  },
  confirmHide: {
    title: "Barrierefreiheits-Oberfläche ausblenden?",
    body: "Dadurch wird die Schaltfläche für Barrierefreiheit auf jeder Seite ausgeblendet. Um sie zurückzuholen, löschen Sie die Browserdaten dieser Website und laden Sie die Seite neu.",
    cancel: "Abbrechen",
    confirm: "Oberfläche ausblenden",
  },
  shortcuts: {
    reset: { title: "Visuelles Werkzeug zurücksetzen", caption: 'Drücken Sie UMSCHALT + die Taste "r"' },
    report: { title: "Problem melden", caption: 'Drücken Sie "h"' },
    structure: { title: "Nach Seitenstruktur navigieren", caption: 'Drücken Sie "n"' },
    close: { title: "Zentrum für Barrierefreiheit schließen", caption: 'Verwenden Sie die Taste "Esc"' },
    statement: { title: "Erklärung zur Barrierefreiheit ansehen", caption: 'Drücken Sie "b"' },
    contentScaling: { title: "Inhaltsskalierung", caption: 'Drücken Sie "[" oder "]"' },
    usefulLinks: { title: "Nützliche Links", caption: 'Drücken Sie "u"' },
  },
  report: { title: "Ein Barrierefreiheitsproblem melden", subtitle: "Beschreiben Sie das Barrierefreiheitsproblem, das Sie festgestellt haben" },
  structure: { title: "Seitenstruktur", back: "Zurück zu den Barrierefreiheitswerkzeugen", landmarks: "Orientierungspunkte", headings: "Überschriften", links: "Links", topOfPage: "Seitenanfang" },
  footer: { statement: "Erklärung zur Barrierefreiheit" },
  common: { decrease: "Verringern", increase: "Erhöhen", activateNext: "Aktivieren für die nächste Option.", esc: "Esc" },
};

const PT: A11yStrings = {
  launcher: { ariaLabel: "Explore suas opções de acessibilidade", pill: "Explore suas opções de acessibilidade" },
  header: { title: "Central de acessibilidade", subtitle: "Ajuste este site às suas necessidades", close: "Fechar a central de acessibilidade" },
  language: { choose: "Escolher idioma da interface", current: "Idioma atual", pickerTitle: "Escolha um idioma", back: "Voltar" },
  tabs: { tools: "Personalização", report: "Relatar um problema" },
  profiles: {
    title: "Perfis de acessibilidade",
    subtitle: "Predefinições que combinam os ajustes abaixo.",
    resetAll: "Redefinir tudo",
    epilepsy: { name: "Seguro para epilepsia", description: "Interrompe animações e reduz a intensidade das cores para diminuir o risco de convulsões." },
    vision: { name: "Deficiência visual", description: "Texto maior em uma fonte de alta legibilidade, com maior espaçamento entre linhas e letras." },
    older: { name: "Adultos mais velhos", description: "Texto maior, fonte de alta legibilidade, contraste mais alto e links destacados." },
    cognitive: { name: "Deficiência cognitiva", description: "Destaca links e títulos e adiciona um guia de leitura para ajudar a concentração." },
    adhd: { name: "Amigável para TDAH", description: "Reduz distrações com uma janela de leitura focada e menos movimento." },
    blind: { name: "Usuários cegos (leitor de tela)", description: "Exibe descrições de imagens para JAWS, NVDA, VoiceOver e TalkBack." },
    motor: { name: "Navegação por teclado (motora)", description: "Contornos de foco fortes e um cursor preto grande para uso com teclado." },
  },
  quickActions: { navigateStructure: "Navegar pela estrutura da página", showShortcuts: "Mostrar atalhos" },
  content: {
    title: "Ajustes de conteúdo",
    contentScaling: "Escala do conteúdo",
    lineHeight: "Altura da linha",
    letterSpacing: "Espaçamento entre letras",
    textAlignGroup: "Alinhamento do texto",
    alignLeft: "Alinhar texto à esquerda",
    alignCenter: "Centralizar texto",
    alignRight: "Alinhar texto à direita",
    left: "Esquerda",
    center: "Centro",
    right: "Direita",
    textSize: "Tamanho do texto",
    font: "Fonte",
    highlight: "Destaque",
    magnifier: "Lupa de texto",
    states: {
      largeText: { off: "Normal", large: "Grande", larger: "Maior" },
      font: { default: "Padrão", serif: "Serif", readable: "Legível" },
      highlight: { off: "Nenhum", links: "Links", headings: "Títulos", all: "Tudo" },
    },
  },
  color: {
    title: "Ajustes de cor",
    contrast: "Contraste",
    saturation: "Saturação",
    textColors: "Ajustar cores do texto",
    titleColors: "Ajustar cores dos títulos",
    backgroundColors: "Ajustar cores de fundo",
    cancel: "Cancelar",
    states: {
      contrast: { off: "Nenhum", high: "Alto", inverted: "Invertido", dark: "Escuro", light: "Claro" },
      saturation: { off: "Nenhuma", high: "Alta", low: "Baixa", monochrome: "Monocromático" },
    },
    swatches: { blue: "Azul", purple: "Roxo", red: "Vermelho", orange: "Laranja", teal: "Verde-azulado", green: "Verde", white: "Branco", black: "Preto" },
  },
  orientation: {
    title: "Ajustes de orientação",
    muteSounds: "Silenciar sons",
    hideImages: "Ocultar imagens",
    readMode: "Modo de leitura",
    guide: "Guia",
    window: "Janela",
    animation: "Animação",
    hover: "Destaque ao passar o cursor",
    focus: "Foco",
    cursor: "Cursor",
    altText: "Texto alternativo",
    usefulLinks: "Links úteis",
    selectAPage: "Selecione uma página",
    hideInterface: "Ocultar interface",
    states: { cursor: { off: "Normal", black: "Preto", white: "Branco" } },
    links: { home: "Início", services: "Serviços", schedule: "Agendar uma consulta", contact: "Fale conosco", patientInfo: "Informações para pacientes", statement: "Declaração de acessibilidade" },
  },
  confirmHide: {
    title: "Ocultar a interface de acessibilidade?",
    body: "Isso oculta o botão de acessibilidade em todas as páginas. Para trazê-lo de volta, limpe os dados de navegação deste site no seu navegador e recarregue a página.",
    cancel: "Cancelar",
    confirm: "Ocultar interface",
  },
  shortcuts: {
    reset: { title: "Redefinir painel visual", caption: 'Pressione SHIFT + a tecla "r"' },
    report: { title: "Relatar um problema", caption: 'Pressione "h"' },
    structure: { title: "Navegar pela estrutura da página", caption: 'Pressione "n"' },
    close: { title: "Fechar a central de acessibilidade", caption: 'Use a tecla "esc"' },
    statement: { title: "Ver a declaração de acessibilidade", caption: 'Pressione "b"' },
    contentScaling: { title: "Escala do conteúdo", caption: 'Pressione "[" ou "]"' },
    usefulLinks: { title: "Links úteis", caption: 'Pressione "u"' },
  },
  report: { title: "Relatar um problema de acessibilidade", subtitle: "Descreva o problema de acessibilidade que você encontrou" },
  structure: { title: "Estrutura da página", back: "Voltar às ferramentas de acessibilidade", landmarks: "Pontos de referência", headings: "Títulos", links: "Links", topOfPage: "Topo da página" },
  footer: { statement: "Declaração de acessibilidade" },
  common: { decrease: "Diminuir", increase: "Aumentar", activateNext: "Ative para a próxima opção.", esc: "esc" },
};

const IT: A11yStrings = {
  launcher: { ariaLabel: "Scopri le tue opzioni di accessibilità", pill: "Scopri le tue opzioni di accessibilità" },
  header: { title: "Centro accessibilità", subtitle: "Adatta questo sito alle tue esigenze", close: "Chiudi il centro accessibilità" },
  language: { choose: "Scegli la lingua dell'interfaccia", current: "Lingua attuale", pickerTitle: "Scegli una lingua", back: "Indietro" },
  tabs: { tools: "Personalizzazione", report: "Segnala un problema" },
  profiles: {
    title: "Profili di accessibilità",
    subtitle: "Preimpostazioni che combinano le regolazioni qui sotto.",
    resetAll: "Ripristina tutto",
    epilepsy: { name: "Sicuro per epilessia", description: "Ferma le animazioni e riduce l'intensità del colore per abbassare il rischio di crisi." },
    vision: { name: "Ipovisione", description: "Testo più grande con un carattere ad alta leggibilità, interlinea e spaziatura tra lettere più ampie." },
    older: { name: "Adulti anziani", description: "Testo più grande, carattere ad alta leggibilità, contrasto più alto e link evidenziati." },
    cognitive: { name: "Disabilità cognitiva", description: "Evidenzia link e titoli e aggiunge una guida di lettura per aiutare la concentrazione." },
    adhd: { name: "Adatto all'ADHD", description: "Riduce le distrazioni con una finestra di lettura mirata e meno movimento." },
    blind: { name: "Utenti non vedenti (screen reader)", description: "Mostra le descrizioni delle immagini per JAWS, NVDA, VoiceOver e TalkBack." },
    motor: { name: "Navigazione da tastiera (motoria)", description: "Contorni di focus marcati e un grande cursore nero per l'uso da tastiera." },
  },
  quickActions: { navigateStructure: "Naviga per struttura della pagina", showShortcuts: "Mostra scorciatoie" },
  content: {
    title: "Regolazioni del contenuto",
    contentScaling: "Scala del contenuto",
    lineHeight: "Interlinea",
    letterSpacing: "Spaziatura tra lettere",
    textAlignGroup: "Allineamento del testo",
    alignLeft: "Allinea il testo a sinistra",
    alignCenter: "Centra il testo",
    alignRight: "Allinea il testo a destra",
    left: "Sinistra",
    center: "Centro",
    right: "Destra",
    textSize: "Dimensione del testo",
    font: "Carattere",
    highlight: "Evidenziazione",
    magnifier: "Lente di ingrandimento",
    states: {
      largeText: { off: "Normale", large: "Grande", larger: "Più grande" },
      font: { default: "Predefinito", serif: "Serif", readable: "Leggibile" },
      highlight: { off: "Nessuno", links: "Link", headings: "Titoli", all: "Tutto" },
    },
  },
  color: {
    title: "Regolazioni del colore",
    contrast: "Contrasto",
    saturation: "Saturazione",
    textColors: "Regola i colori del testo",
    titleColors: "Regola i colori dei titoli",
    backgroundColors: "Regola i colori dello sfondo",
    cancel: "Annulla",
    states: {
      contrast: { off: "Nessuno", high: "Alto", inverted: "Invertito", dark: "Scuro", light: "Chiaro" },
      saturation: { off: "Nessuna", high: "Alta", low: "Bassa", monochrome: "Monocromatico" },
    },
    swatches: { blue: "Blu", purple: "Viola", red: "Rosso", orange: "Arancione", teal: "Verde acqua", green: "Verde", white: "Bianco", black: "Nero" },
  },
  orientation: {
    title: "Regolazioni di orientamento",
    muteSounds: "Disattiva audio",
    hideImages: "Nascondi immagini",
    readMode: "Modalità lettura",
    guide: "Guida",
    window: "Finestra",
    animation: "Animazione",
    hover: "Evidenzia al passaggio del cursore",
    focus: "Focus",
    cursor: "Cursore",
    altText: "Testo alternativo",
    usefulLinks: "Link utili",
    selectAPage: "Seleziona una pagina",
    hideInterface: "Nascondi interfaccia",
    states: { cursor: { off: "Normale", black: "Nero", white: "Bianco" } },
    links: { home: "Home", services: "Servizi", schedule: "Prenota una visita", contact: "Contattaci", patientInfo: "Informazioni per i pazienti", statement: "Dichiarazione di accessibilità" },
  },
  confirmHide: {
    title: "Nascondere l'interfaccia di accessibilità?",
    body: "Questo nasconde il pulsante di accessibilità su ogni pagina. Per farlo tornare, cancella i dati di navigazione di questo sito nel tuo browser e ricarica la pagina.",
    cancel: "Annulla",
    confirm: "Nascondi interfaccia",
  },
  shortcuts: {
    reset: { title: "Ripristina il pannello visivo", caption: 'Premi MAIUSC + il tasto "r"' },
    report: { title: "Segnala un problema", caption: 'Premi "h"' },
    structure: { title: "Naviga per struttura della pagina", caption: 'Premi "n"' },
    close: { title: "Chiudi il centro accessibilità", caption: 'Usa il tasto "esc"' },
    statement: { title: "Visualizza la dichiarazione di accessibilità", caption: 'Premi "b"' },
    contentScaling: { title: "Scala del contenuto", caption: 'Premi "[" o "]"' },
    usefulLinks: { title: "Link utili", caption: 'Premi "u"' },
  },
  report: { title: "Segnala un problema di accessibilità", subtitle: "Descrivi il problema di accessibilità riscontrato" },
  structure: { title: "Struttura della pagina", back: "Torna agli strumenti di accessibilità", landmarks: "Punti di riferimento", headings: "Titoli", links: "Link", topOfPage: "Inizio pagina" },
  footer: { statement: "Dichiarazione di accessibilità" },
  common: { decrease: "Diminuisci", increase: "Aumenta", activateNext: "Attiva per l'opzione successiva.", esc: "esc" },
};

const NL: A11yStrings = {
  launcher: { ariaLabel: "Ontdek je toegankelijkheidsopties", pill: "Ontdek je toegankelijkheidsopties" },
  header: { title: "Toegankelijkheidscentrum", subtitle: "Pas deze site aan jouw behoeften aan", close: "Toegankelijkheidscentrum sluiten" },
  language: { choose: "Interfacetaal kiezen", current: "Huidige taal", pickerTitle: "Kies een taal", back: "Terug" },
  tabs: { tools: "Personalisatie", report: "Probleem melden" },
  profiles: {
    title: "Toegankelijkheidsprofielen",
    subtitle: "Voorinstellingen die de onderstaande aanpassingen combineren.",
    resetAll: "Alles resetten",
    epilepsy: { name: "Epilepsie-veilig", description: "Stopt animaties en vermindert de kleurintensiteit om het risico op aanvallen te verlagen." },
    vision: { name: "Slechtziend", description: "Grotere tekst in een goed leesbaar lettertype met meer regel- en letterafstand." },
    older: { name: "Oudere volwassenen", description: "Grotere tekst, een goed leesbaar lettertype, hoger contrast en gemarkeerde links." },
    cognitive: { name: "Cognitieve beperking", description: "Markeert links en koppen en voegt een leesgids toe om te helpen focussen." },
    adhd: { name: "ADHD-vriendelijk", description: "Vermindert afleiding met een gericht leesvenster en minder beweging." },
    blind: { name: "Blinde gebruikers (schermlezer)", description: "Toont beeldbeschrijvingen voor JAWS, NVDA, VoiceOver en TalkBack." },
    motor: { name: "Toetsenbordnavigatie (motorisch)", description: "Sterke focusomlijningen en een grote zwarte cursor voor gebruik met het toetsenbord." },
  },
  quickActions: { navigateStructure: "Navigeren via paginastructuur", showShortcuts: "Sneltoetsen tonen" },
  content: {
    title: "Inhoudsaanpassingen",
    contentScaling: "Inhoudsschaal",
    lineHeight: "Regelhoogte",
    letterSpacing: "Letterafstand",
    textAlignGroup: "Tekstuitlijning",
    alignLeft: "Tekst links uitlijnen",
    alignCenter: "Tekst centreren",
    alignRight: "Tekst rechts uitlijnen",
    left: "Links",
    center: "Midden",
    right: "Rechts",
    textSize: "Tekstgrootte",
    font: "Lettertype",
    highlight: "Markering",
    magnifier: "Tekstvergroter",
    states: {
      largeText: { off: "Normaal", large: "Groot", larger: "Groter" },
      font: { default: "Standaard", serif: "Serif", readable: "Goed leesbaar" },
      highlight: { off: "Uit", links: "Links", headings: "Koppen", all: "Alles" },
    },
  },
  color: {
    title: "Kleuraanpassingen",
    contrast: "Contrast",
    saturation: "Verzadiging",
    textColors: "Tekstkleuren aanpassen",
    titleColors: "Titelkleuren aanpassen",
    backgroundColors: "Achtergrondkleuren aanpassen",
    cancel: "Annuleren",
    states: {
      contrast: { off: "Uit", high: "Hoog", inverted: "Omgekeerd", dark: "Donker", light: "Licht" },
      saturation: { off: "Uit", high: "Hoog", low: "Laag", monochrome: "Monochroom" },
    },
    swatches: { blue: "Blauw", purple: "Paars", red: "Rood", orange: "Oranje", teal: "Blauwgroen", green: "Groen", white: "Wit", black: "Zwart" },
  },
  orientation: {
    title: "Oriëntatieaanpassingen",
    muteSounds: "Geluid dempen",
    hideImages: "Afbeeldingen verbergen",
    readMode: "Leesmodus",
    guide: "Gids",
    window: "Venster",
    animation: "Animatie",
    hover: "Hover-markering",
    focus: "Focus",
    cursor: "Cursor",
    altText: "Alternatieve tekst",
    usefulLinks: "Nuttige links",
    selectAPage: "Selecteer een pagina",
    hideInterface: "Interface verbergen",
    states: { cursor: { off: "Normaal", black: "Zwart", white: "Wit" } },
    links: { home: "Home", services: "Diensten", schedule: "Afspraak maken", contact: "Contact opnemen", patientInfo: "Informatie voor patiënten", statement: "Toegankelijkheidsverklaring" },
  },
  confirmHide: {
    title: "Toegankelijkheidsinterface verbergen?",
    body: "Dit verbergt de toegankelijkheidsknop op elke pagina. Om hem terug te halen, wis je de browsegegevens van deze site in je browser en laad je de pagina opnieuw.",
    cancel: "Annuleren",
    confirm: "Interface verbergen",
  },
  shortcuts: {
    reset: { title: "Visueel paneel resetten", caption: 'Druk op SHIFT + de "r"-toets' },
    report: { title: "Probleem melden", caption: 'Druk op "h"' },
    structure: { title: "Navigeren via paginastructuur", caption: 'Druk op "n"' },
    close: { title: "Toegankelijkheidscentrum sluiten", caption: 'Gebruik de "escape"-toets' },
    statement: { title: "Toegankelijkheidsverklaring bekijken", caption: 'Druk op "b"' },
    contentScaling: { title: "Inhoudsschaal", caption: 'Druk op "[" of "]"' },
    usefulLinks: { title: "Nuttige links", caption: 'Druk op "u"' },
  },
  report: { title: "Een toegankelijkheidsprobleem melden", subtitle: "Beschrijf het toegankelijkheidsprobleem dat je bent tegengekomen" },
  structure: { title: "Paginastructuur", back: "Terug naar toegankelijkheidshulpmiddelen", landmarks: "Oriëntatiepunten", headings: "Koppen", links: "Links", topOfPage: "Boven aan de pagina" },
  footer: { statement: "Toegankelijkheidsverklaring" },
  common: { decrease: "Verlagen", increase: "Verhogen", activateNext: "Activeer voor de volgende optie.", esc: "esc" },
};

const PL: A11yStrings = {
  launcher: { ariaLabel: "Poznaj opcje dostępności", pill: "Poznaj opcje dostępności" },
  header: { title: "Centrum dostępności", subtitle: "Dostosuj tę stronę do swoich potrzeb", close: "Zamknij centrum dostępności" },
  language: { choose: "Wybierz język interfejsu", current: "Bieżący język", pickerTitle: "Wybierz język", back: "Wstecz" },
  tabs: { tools: "Personalizacja", report: "Zgłoś problem" },
  profiles: {
    title: "Profile dostępności",
    subtitle: "Gotowe ustawienia łączące poniższe opcje.",
    resetAll: "Resetuj wszystko",
    epilepsy: { name: "Bezpieczny dla epilepsji", description: "Zatrzymuje animacje i zmniejsza intensywność kolorów, aby ograniczyć ryzyko napadu." },
    vision: { name: "Osoby niedowidzące", description: "Większy tekst w czytelnej czcionce, z większymi odstępami między wierszami i literami." },
    older: { name: "Osoby starsze", description: "Większy tekst, czytelna czcionka, wyższy kontrast i wyróżnione linki." },
    cognitive: { name: "Niepełnosprawność poznawcza", description: "Wyróżnia linki i nagłówki oraz dodaje prowadnicę czytania ułatwiającą skupienie." },
    adhd: { name: "Przyjazne dla ADHD", description: "Ogranicza rozpraszanie dzięki skupionemu oknu czytania i mniejszej ilości ruchu." },
    blind: { name: "Użytkownicy niewidomi (czytnik ekranu)", description: "Pokazuje opisy obrazów dla JAWS, NVDA, VoiceOver i TalkBack." },
    motor: { name: "Nawigacja klawiaturą (ruchowa)", description: "Wyraźne obramowania fokusu i duży czarny kursor do obsługi klawiaturą." },
  },
  quickActions: { navigateStructure: "Nawiguj po strukturze strony", showShortcuts: "Pokaż skróty" },
  content: {
    title: "Ustawienia treści",
    contentScaling: "Skalowanie treści",
    lineHeight: "Interlinia",
    letterSpacing: "Odstępy między literami",
    textAlignGroup: "Wyrównanie tekstu",
    alignLeft: "Wyrównaj tekst do lewej",
    alignCenter: "Wyśrodkuj tekst",
    alignRight: "Wyrównaj tekst do prawej",
    left: "Lewo",
    center: "Środek",
    right: "Prawo",
    textSize: "Rozmiar tekstu",
    font: "Czcionka",
    highlight: "Wyróżnienie",
    magnifier: "Lupa tekstu",
    states: {
      largeText: { off: "Normalny", large: "Duży", larger: "Większy" },
      font: { default: "Domyślna", serif: "Szeryfowa", readable: "Czytelna" },
      highlight: { off: "Brak", links: "Linki", headings: "Nagłówki", all: "Wszystko" },
    },
  },
  color: {
    title: "Ustawienia kolorów",
    contrast: "Kontrast",
    saturation: "Nasycenie",
    textColors: "Dostosuj kolory tekstu",
    titleColors: "Dostosuj kolory nagłówków",
    backgroundColors: "Dostosuj kolory tła",
    cancel: "Anuluj",
    states: {
      contrast: { off: "Brak", high: "Wysoki", inverted: "Odwrócony", dark: "Ciemny", light: "Jasny" },
      saturation: { off: "Brak", high: "Wysokie", low: "Niskie", monochrome: "Monochromatyczne" },
    },
    swatches: { blue: "Niebieski", purple: "Fioletowy", red: "Czerwony", orange: "Pomarańczowy", teal: "Morski", green: "Zielony", white: "Biały", black: "Czarny" },
  },
  orientation: {
    title: "Ustawienia orientacji",
    muteSounds: "Wycisz dźwięki",
    hideImages: "Ukryj obrazy",
    readMode: "Tryb czytania",
    guide: "Prowadnica",
    window: "Okno",
    animation: "Animacja",
    hover: "Wyróżnienie po najechaniu",
    focus: "Fokus",
    cursor: "Kursor",
    altText: "Tekst alternatywny",
    usefulLinks: "Przydatne linki",
    selectAPage: "Wybierz stronę",
    hideInterface: "Ukryj interfejs",
    states: { cursor: { off: "Normalny", black: "Czarny", white: "Biały" } },
    links: { home: "Strona główna", services: "Usługi", schedule: "Umów wizytę", contact: "Kontakt", patientInfo: "Informacje dla pacjentów", statement: "Deklaracja dostępności" },
  },
  confirmHide: {
    title: "Ukryć interfejs dostępności?",
    body: "To ukryje przycisk dostępności na każdej stronie. Aby go przywrócić, wyczyść dane przeglądania tej strony w przeglądarce i odśwież stronę.",
    cancel: "Anuluj",
    confirm: "Ukryj interfejs",
  },
  shortcuts: {
    reset: { title: "Resetuj panel wizualny", caption: 'Naciśnij SHIFT + klawisz "r"' },
    report: { title: "Zgłoś problem", caption: 'Naciśnij "h"' },
    structure: { title: "Nawiguj po strukturze strony", caption: 'Naciśnij "n"' },
    close: { title: "Zamknij centrum dostępności", caption: 'Użyj klawisza "escape"' },
    statement: { title: "Zobacz deklarację dostępności", caption: 'Naciśnij "b"' },
    contentScaling: { title: "Skalowanie treści", caption: 'Naciśnij "[" lub "]"' },
    usefulLinks: { title: "Przydatne linki", caption: 'Naciśnij "u"' },
  },
  report: { title: "Zgłoś problem z dostępnością", subtitle: "Opisz napotkany problem z dostępnością" },
  structure: { title: "Struktura strony", back: "Powrót do narzędzi dostępności", landmarks: "Punkty orientacyjne", headings: "Nagłówki", links: "Linki", topOfPage: "Góra strony" },
  footer: { statement: "Deklaracja dostępności" },
  common: { decrease: "Zmniejsz", increase: "Zwiększ", activateNext: "Aktywuj, aby przejść do następnej opcji.", esc: "esc" },
};

const TR: A11yStrings = {
  launcher: { ariaLabel: "Erişilebilirlik seçeneklerini keşfedin", pill: "Erişilebilirlik seçeneklerini keşfedin" },
  header: { title: "Erişilebilirlik Merkezi", subtitle: "Bu siteyi ihtiyaçlarınıza göre ayarlayın", close: "Erişilebilirlik merkezini kapat" },
  language: { choose: "Arayüz dilini seç", current: "Geçerli dil", pickerTitle: "Bir dil seçin", back: "Geri" },
  tabs: { tools: "Kişiselleştirme", report: "Sorun bildir" },
  profiles: {
    title: "Erişilebilirlik profilleri",
    subtitle: "Aşağıdaki ayarları birleştiren tek dokunuşluk hazır ayarlar.",
    resetAll: "Tümünü sıfırla",
    epilepsy: { name: "Epilepsi için güvenli", description: "Nöbet riskini azaltmak için animasyonları durdurur ve renk yoğunluğunu azaltır." },
    vision: { name: "Görme engelli", description: "Daha geniş satır ve harf aralığıyla, yüksek okunabilirlikli bir yazı tipinde daha büyük metin." },
    older: { name: "Yaşlı yetişkinler", description: "Daha büyük metin, yüksek okunabilirlikli yazı tipi, daha yüksek kontrast ve vurgulanmış bağlantılar." },
    cognitive: { name: "Bilişsel engel", description: "Bağlantıları ve başlıkları vurgular ve odaklanmaya yardımcı olacak bir okuma kılavuzu ekler." },
    adhd: { name: "DEHB dostu", description: "Odaklanmış bir okuma penceresi ve daha az hareketle dikkat dağıtıcıları azaltır." },
    blind: { name: "Görme engelli kullanıcılar (ekran okuyucu)", description: "JAWS, NVDA, VoiceOver ve TalkBack için görsel açıklamaları gösterir." },
    motor: { name: "Klavye ile gezinme (motor)", description: "Klavye ile kullanım için güçlü odak çerçeveleri ve büyük siyah bir imleç." },
  },
  quickActions: { navigateStructure: "Sayfa yapısına göre gezin", showShortcuts: "Kısayolları göster" },
  content: {
    title: "İçerik ayarları",
    contentScaling: "İçerik ölçeklendirme",
    lineHeight: "Satır yüksekliği",
    letterSpacing: "Harf aralığı",
    textAlignGroup: "Metin hizalama",
    alignLeft: "Metni sola hizala",
    alignCenter: "Metni ortala",
    alignRight: "Metni sağa hizala",
    left: "Sol",
    center: "Orta",
    right: "Sağ",
    textSize: "Metin boyutu",
    font: "Yazı tipi",
    highlight: "Vurgulama",
    magnifier: "Metin büyüteci",
    states: {
      largeText: { off: "Normal", large: "Büyük", larger: "Daha büyük" },
      font: { default: "Varsayılan", serif: "Serif", readable: "Okunabilir" },
      highlight: { off: "Kapalı", links: "Bağlantılar", headings: "Başlıklar", all: "Tümü" },
    },
  },
  color: {
    title: "Renk ayarları",
    contrast: "Kontrast",
    saturation: "Doygunluk",
    textColors: "Metin renklerini ayarla",
    titleColors: "Başlık renklerini ayarla",
    backgroundColors: "Arka plan renklerini ayarla",
    cancel: "İptal",
    states: {
      contrast: { off: "Kapalı", high: "Yüksek", inverted: "Ters çevrilmiş", dark: "Koyu", light: "Açık" },
      saturation: { off: "Kapalı", high: "Yüksek", low: "Düşük", monochrome: "Tek renk" },
    },
    swatches: { blue: "Mavi", purple: "Mor", red: "Kırmızı", orange: "Turuncu", teal: "Deniz mavisi", green: "Yeşil", white: "Beyaz", black: "Siyah" },
  },
  orientation: {
    title: "Yönelim ayarları",
    muteSounds: "Sesleri kapat",
    hideImages: "Görselleri gizle",
    readMode: "Okuma modu",
    guide: "Kılavuz",
    window: "Pencere",
    animation: "Animasyon",
    hover: "Üzerine gelince vurgula",
    focus: "Odak",
    cursor: "İmleç",
    altText: "Alternatif metin",
    usefulLinks: "Faydalı bağlantılar",
    selectAPage: "Bir sayfa seçin",
    hideInterface: "Arayüzü gizle",
    states: { cursor: { off: "Normal", black: "Siyah", white: "Beyaz" } },
    links: { home: "Ana sayfa", services: "Hizmetler", schedule: "Randevu al", contact: "Bize ulaşın", patientInfo: "Hasta bilgileri", statement: "Erişilebilirlik bildirimi" },
  },
  confirmHide: {
    title: "Erişilebilirlik arayüzü gizlensin mi?",
    body: "Bu, erişilebilirlik düğmesini her sayfada gizler. Geri getirmek için tarayıcınızda bu sitenin gezinme verilerini temizleyin ve sayfayı yeniden yükleyin.",
    cancel: "İptal",
    confirm: "Arayüzü gizle",
  },
  shortcuts: {
    reset: { title: "Görsel paneli sıfırla", caption: 'SHIFT + "r" tuşuna basın' },
    report: { title: "Sorun bildir", caption: '"h" tuşuna basın' },
    structure: { title: "Sayfa yapısına göre gezin", caption: '"n" tuşuna basın' },
    close: { title: "Erişilebilirlik merkezini kapat", caption: '"escape" tuşunu kullanın' },
    statement: { title: "Erişilebilirlik bildirimini görüntüle", caption: '"b" tuşuna basın' },
    contentScaling: { title: "İçerik ölçeklendirme", caption: '"[" veya "]" tuşuna basın' },
    usefulLinks: { title: "Faydalı bağlantılar", caption: '"u" tuşuna basın' },
  },
  report: { title: "Bir erişilebilirlik sorunu bildir", subtitle: "Karşılaştığınız erişilebilirlik sorununu açıklayın" },
  structure: { title: "Sayfa yapısı", back: "Erişilebilirlik araçlarına dön", landmarks: "Yer imleri", headings: "Başlıklar", links: "Bağlantılar", topOfPage: "Sayfa başı" },
  footer: { statement: "Erişilebilirlik bildirimi" },
  common: { decrease: "Azalt", increase: "Artır", activateNext: "Sonraki seçenek için etkinleştirin.", esc: "esc" },
};

const RU: A11yStrings = {
  launcher: { ariaLabel: "Изучите параметры доступности", pill: "Изучите параметры доступности" },
  header: { title: "Центр специальных возможностей", subtitle: "Настройте этот сайт под свои потребности", close: "Закрыть центр специальных возможностей" },
  language: { choose: "Выбрать язык интерфейса", current: "Текущий язык", pickerTitle: "Выберите язык", back: "Назад" },
  tabs: { tools: "Персонализация", report: "Сообщить о проблеме" },
  profiles: {
    title: "Профили доступности",
    subtitle: "Готовые наборы настроек, объединяющие параметры ниже.",
    resetAll: "Сбросить всё",
    epilepsy: { name: "Безопасно при эпилепсии", description: "Останавливает анимацию и снижает насыщенность цвета, чтобы уменьшить риск приступа." },
    vision: { name: "Нарушение зрения", description: "Более крупный текст в удобочитаемом шрифте с увеличенным межстрочным и межбуквенным интервалом." },
    older: { name: "Пожилые пользователи", description: "Более крупный текст, удобочитаемый шрифт, более высокий контраст и выделенные ссылки." },
    cognitive: { name: "Когнитивные нарушения", description: "Выделяет ссылки и заголовки и добавляет направляющую для чтения, помогающую сосредоточиться." },
    adhd: { name: "Подходит при СДВГ", description: "Снижает отвлекающие факторы с помощью сфокусированного окна чтения и меньшего количества движения." },
    blind: { name: "Незрячие пользователи (программа чтения с экрана)", description: "Показывает описания изображений для JAWS, NVDA, VoiceOver и TalkBack." },
    motor: { name: "Навигация с клавиатуры (моторные нарушения)", description: "Заметные контуры фокуса и большой чёрный курсор для работы с клавиатурой." },
  },
  quickActions: { navigateStructure: "Навигация по структуре страницы", showShortcuts: "Показать сочетания клавиш" },
  content: {
    title: "Настройки содержимого",
    contentScaling: "Масштаб содержимого",
    lineHeight: "Межстрочный интервал",
    letterSpacing: "Межбуквенный интервал",
    textAlignGroup: "Выравнивание текста",
    alignLeft: "Выровнять текст по левому краю",
    alignCenter: "Выровнять текст по центру",
    alignRight: "Выровнять текст по правому краю",
    left: "Слева",
    center: "По центру",
    right: "Справа",
    textSize: "Размер текста",
    font: "Шрифт",
    highlight: "Выделение",
    magnifier: "Лупа текста",
    states: {
      largeText: { off: "Обычный", large: "Крупный", larger: "Ещё крупнее" },
      font: { default: "По умолчанию", serif: "С засечками", readable: "Удобочитаемый" },
      highlight: { off: "Выкл.", links: "Ссылки", headings: "Заголовки", all: "Всё" },
    },
  },
  color: {
    title: "Настройки цвета",
    contrast: "Контраст",
    saturation: "Насыщенность",
    textColors: "Настроить цвет текста",
    titleColors: "Настроить цвет заголовков",
    backgroundColors: "Настроить цвет фона",
    cancel: "Отмена",
    states: {
      contrast: { off: "Выкл.", high: "Высокий", inverted: "Инвертированный", dark: "Тёмный", light: "Светлый" },
      saturation: { off: "Выкл.", high: "Высокая", low: "Низкая", monochrome: "Монохром" },
    },
    swatches: { blue: "Синий", purple: "Фиолетовый", red: "Красный", orange: "Оранжевый", teal: "Бирюзовый", green: "Зелёный", white: "Белый", black: "Чёрный" },
  },
  orientation: {
    title: "Настройки ориентации",
    muteSounds: "Отключить звук",
    hideImages: "Скрыть изображения",
    readMode: "Режим чтения",
    guide: "Направляющая",
    window: "Окно",
    animation: "Анимация",
    hover: "Выделение при наведении",
    focus: "Фокус",
    cursor: "Курсор",
    altText: "Альтернативный текст",
    usefulLinks: "Полезные ссылки",
    selectAPage: "Выберите страницу",
    hideInterface: "Скрыть интерфейс",
    states: { cursor: { off: "Обычный", black: "Чёрный", white: "Белый" } },
    links: { home: "Главная", services: "Услуги", schedule: "Записаться на приём", contact: "Связаться с нами", patientInfo: "Информация для пациентов", statement: "Заявление о доступности" },
  },
  confirmHide: {
    title: "Скрыть интерфейс специальных возможностей?",
    body: "Это скроет кнопку специальных возможностей на каждой странице. Чтобы вернуть её, очистите данные просмотра этого сайта в браузере и перезагрузите страницу.",
    cancel: "Отмена",
    confirm: "Скрыть интерфейс",
  },
  shortcuts: {
    reset: { title: "Сбросить визуальную панель", caption: 'Нажмите SHIFT + клавишу "r"' },
    report: { title: "Сообщить о проблеме", caption: 'Нажмите "h"' },
    structure: { title: "Навигация по структуре страницы", caption: 'Нажмите "n"' },
    close: { title: "Закрыть центр специальных возможностей", caption: 'Используйте клавишу "escape"' },
    statement: { title: "Просмотреть заявление о доступности", caption: 'Нажмите "b"' },
    contentScaling: { title: "Масштаб содержимого", caption: 'Нажмите "[" или "]"' },
    usefulLinks: { title: "Полезные ссылки", caption: 'Нажмите "u"' },
  },
  report: { title: "Сообщить о проблеме с доступностью", subtitle: "Опишите проблему с доступностью, с которой вы столкнулись" },
  structure: { title: "Структура страницы", back: "Назад к инструментам доступности", landmarks: "Ориентиры", headings: "Заголовки", links: "Ссылки", topOfPage: "Начало страницы" },
  footer: { statement: "Заявление о доступности" },
  common: { decrease: "Уменьшить", increase: "Увеличить", activateNext: "Активируйте для следующего варианта.", esc: "esc" },
};

const AR: A11yStrings = {
  launcher: { ariaLabel: "استكشف خيارات إمكانية الوصول", pill: "استكشف خيارات إمكانية الوصول" },
  header: { title: "مركز إمكانية الوصول", subtitle: "خصص هذا الموقع بما يلائم احتياجاتك", close: "إغلاق مركز إمكانية الوصول" },
  language: { choose: "اختر لغة الواجهة", current: "اللغة الحالية", pickerTitle: "اختر لغة", back: "رجوع" },
  tabs: { tools: "التخصيص", report: "الإبلاغ عن مشكلة" },
  profiles: {
    title: "ملفات إمكانية الوصول",
    subtitle: "إعدادات جاهزة بلمسة واحدة تجمع التعديلات أدناه.",
    resetAll: "إعادة تعيين الكل",
    epilepsy: { name: "آمن لمرضى الصرع", description: "يوقف الحركات المتحركة ويقلل من شدة الألوان لتقليل خطر النوبات." },
    vision: { name: "ضعاف البصر", description: "نص أكبر بخط عالي الوضوح مع تباعد أوسع بين الأسطر والحروف." },
    older: { name: "كبار السن", description: "نص أكبر، خط عالي الوضوح، تباين أعلى، وروابط بارزة." },
    cognitive: { name: "الإعاقة الإدراكية", description: "يبرز الروابط والعناوين ويضيف دليل قراءة للمساعدة على التركيز." },
    adhd: { name: "مناسب لفرط الحركة ونقص الانتباه", description: "يقلل من المشتتات بنافذة قراءة مركزة وحركة أقل." },
    blind: { name: "المستخدمون المكفوفون (قارئ الشاشة)", description: "يعرض أوصاف الصور لمستخدمي JAWS وNVDA وVoiceOver وTalkBack." },
    motor: { name: "التنقل بلوحة المفاتيح (الإعاقة الحركية)", description: "إطارات تركيز واضحة ومؤشر أسود كبير للاستخدام بلوحة المفاتيح." },
  },
  quickActions: { navigateStructure: "التنقل حسب بنية الصفحة", showShortcuts: "إظهار الاختصارات" },
  content: {
    title: "تعديلات المحتوى",
    contentScaling: "تحجيم المحتوى",
    lineHeight: "ارتفاع السطر",
    letterSpacing: "تباعد الأحرف",
    textAlignGroup: "محاذاة النص",
    alignLeft: "محاذاة النص إلى اليسار",
    alignCenter: "توسيط النص",
    alignRight: "محاذاة النص إلى اليمين",
    left: "يسار",
    center: "وسط",
    right: "يمين",
    textSize: "حجم النص",
    font: "الخط",
    highlight: "تمييز",
    magnifier: "مكبّر النص",
    states: {
      largeText: { off: "عادي", large: "كبير", larger: "أكبر" },
      font: { default: "افتراضي", serif: "بذيل", readable: "سهل القراءة" },
      highlight: { off: "إيقاف", links: "الروابط", headings: "العناوين", all: "الكل" },
    },
  },
  color: {
    title: "تعديلات الألوان",
    contrast: "التباين",
    saturation: "التشبع",
    textColors: "تعديل ألوان النص",
    titleColors: "تعديل ألوان العناوين",
    backgroundColors: "تعديل ألوان الخلفية",
    cancel: "إلغاء",
    states: {
      contrast: { off: "إيقاف", high: "عالٍ", inverted: "معكوس", dark: "داكن", light: "فاتح" },
      saturation: { off: "إيقاف", high: "عالٍ", low: "منخفض", monochrome: "أحادي اللون" },
    },
    swatches: { blue: "أزرق", purple: "بنفسجي", red: "أحمر", orange: "برتقالي", teal: "أزرق مخضر", green: "أخضر", white: "أبيض", black: "أسود" },
  },
  orientation: {
    title: "تعديلات التوجيه",
    muteSounds: "كتم الأصوات",
    hideImages: "إخفاء الصور",
    readMode: "وضع القراءة",
    guide: "دليل القراءة",
    window: "نافذة القراءة",
    animation: "الحركة",
    hover: "تمييز عند التمرير",
    focus: "التركيز",
    cursor: "المؤشر",
    altText: "النص البديل",
    usefulLinks: "روابط مفيدة",
    selectAPage: "اختر صفحة",
    hideInterface: "إخفاء الواجهة",
    states: { cursor: { off: "عادي", black: "أسود", white: "أبيض" } },
    links: { home: "الرئيسية", services: "الخدمات", schedule: "حجز موعد", contact: "تواصل معنا", patientInfo: "معلومات المرضى", statement: "بيان إمكانية الوصول" },
  },
  confirmHide: {
    title: "هل تريد إخفاء واجهة إمكانية الوصول؟",
    body: "سيؤدي هذا إلى إخفاء زر إمكانية الوصول في كل صفحة. لإعادته، امسح بيانات تصفح هذا الموقع من متصفحك وأعد تحميل الصفحة.",
    cancel: "إلغاء",
    confirm: "إخفاء الواجهة",
  },
  shortcuts: {
    reset: { title: "إعادة تعيين اللوحة المرئية", caption: 'اضغط SHIFT + مفتاح "r"' },
    report: { title: "الإبلاغ عن مشكلة", caption: 'اضغط "h"' },
    structure: { title: "التنقل حسب بنية الصفحة", caption: 'اضغط "n"' },
    close: { title: "إغلاق مركز إمكانية الوصول", caption: 'استخدم مفتاح "escape"' },
    statement: { title: "عرض بيان إمكانية الوصول", caption: 'اضغط "b"' },
    contentScaling: { title: "تحجيم المحتوى", caption: 'اضغط "[" أو "]"' },
    usefulLinks: { title: "روابط مفيدة", caption: 'اضغط "u"' },
  },
  report: { title: "الإبلاغ عن مشكلة في إمكانية الوصول", subtitle: "صف مشكلة إمكانية الوصول التي واجهتها" },
  structure: { title: "بنية الصفحة", back: "العودة إلى أدوات إمكانية الوصول", landmarks: "المعالم", headings: "العناوين", links: "الروابط", topOfPage: "أعلى الصفحة" },
  footer: { statement: "بيان إمكانية الوصول" },
  common: { decrease: "تقليل", increase: "زيادة", activateNext: "فعّل للانتقال إلى الخيار التالي.", esc: "esc" },
};

const HE: A11yStrings = {
  launcher: { ariaLabel: "גלו את אפשרויות הנגישות", pill: "גלו את אפשרויות הנגישות" },
  header: { title: "מרכז הנגישות", subtitle: "התאימו את האתר לצרכים שלכם", close: "סגירת מרכז הנגישות" },
  language: { choose: "בחירת שפת הממשק", current: "השפה הנוכחית", pickerTitle: "בחרו שפה", back: "חזרה" },
  tabs: { tools: "התאמה אישית", report: "דיווח על בעיה" },
  profiles: {
    title: "פרופילי נגישות",
    subtitle: "הגדרות מוכנות מראש שמשלבות את ההתאמות שלמטה.",
    resetAll: "איפוס הכול",
    epilepsy: { name: "בטוח לאפילפסיה", description: "עוצר אנימציות ומפחית את עוצמת הצבע כדי להפחית סיכון להתקף." },
    vision: { name: "לקויי ראייה", description: "טקסט גדול יותר בגופן קריא במיוחד, עם רווח שורות ואותיות רחב יותר." },
    older: { name: "מבוגרים", description: "טקסט גדול יותר, גופן קריא במיוחד, ניגודיות גבוהה יותר וקישורים מודגשים." },
    cognitive: { name: "מוגבלות קוגניטיבית", description: "מדגיש קישורים וכותרות ומוסיף מדריך קריאה שמסייע בריכוז." },
    adhd: { name: "ידידותי ל-ADHD", description: "מפחית הסחות דעת באמצעות חלון קריאה ממוקד ופחות תנועה." },
    blind: { name: "משתמשים עיוורים (קורא מסך)", description: "מציג תיאורי תמונות עבור JAWS, NVDA, VoiceOver ו-TalkBack." },
    motor: { name: "ניווט במקלדת (מוגבלות מוטורית)", description: "מסגרות מיקוד בולטות וסמן שחור גדול לשימוש במקלדת." },
  },
  quickActions: { navigateStructure: "ניווט לפי מבנה העמוד", showShortcuts: "הצגת קיצורי מקשים" },
  content: {
    title: "התאמות תוכן",
    contentScaling: "הגדלת תוכן",
    lineHeight: "גובה שורה",
    letterSpacing: "ריווח אותיות",
    textAlignGroup: "יישור טקסט",
    alignLeft: "יישור טקסט לשמאל",
    alignCenter: "יישור טקסט למרכז",
    alignRight: "יישור טקסט לימין",
    left: "שמאל",
    center: "מרכז",
    right: "ימין",
    textSize: "גודל טקסט",
    font: "גופן",
    highlight: "הדגשה",
    magnifier: "זכוכית מגדלת לטקסט",
    states: {
      largeText: { off: "רגיל", large: "גדול", larger: "גדול יותר" },
      font: { default: "ברירת מחדל", serif: "סריף", readable: "קריא" },
      highlight: { off: "כבוי", links: "קישורים", headings: "כותרות", all: "הכול" },
    },
  },
  color: {
    title: "התאמות צבע",
    contrast: "ניגודיות",
    saturation: "רוויה",
    textColors: "התאמת צבעי טקסט",
    titleColors: "התאמת צבעי כותרות",
    backgroundColors: "התאמת צבעי רקע",
    cancel: "ביטול",
    states: {
      contrast: { off: "כבוי", high: "גבוהה", inverted: "הפוכה", dark: "כהה", light: "בהירה" },
      saturation: { off: "כבויה", high: "גבוהה", low: "נמוכה", monochrome: "חד-גוני" },
    },
    swatches: { blue: "כחול", purple: "סגול", red: "אדום", orange: "כתום", teal: "טורקיז", green: "ירוק", white: "לבן", black: "שחור" },
  },
  orientation: {
    title: "התאמות ניווט",
    muteSounds: "השתקת קולות",
    hideImages: "הסתרת תמונות",
    readMode: "מצב קריאה",
    guide: "מדריך קריאה",
    window: "חלון קריאה",
    animation: "אנימציה",
    hover: "הדגשה במעבר עכבר",
    focus: "מיקוד",
    cursor: "סמן",
    altText: "טקסט חלופי",
    usefulLinks: "קישורים שימושיים",
    selectAPage: "בחרו עמוד",
    hideInterface: "הסתרת הממשק",
    states: { cursor: { off: "רגיל", black: "שחור", white: "לבן" } },
    links: { home: "בית", services: "שירותים", schedule: "קביעת תור", contact: "צרו קשר", patientInfo: "מידע למטופלים", statement: "הצהרת נגישות" },
  },
  confirmHide: {
    title: "להסתיר את ממשק הנגישות?",
    body: "פעולה זו תסתיר את כפתור הנגישות בכל עמוד. כדי להחזיר אותו, נקו את נתוני הגלישה של אתר זה בדפדפן שלכם וטענו את העמוד מחדש.",
    cancel: "ביטול",
    confirm: "הסתרת הממשק",
  },
  shortcuts: {
    reset: { title: "איפוס הפאנל החזותי", caption: 'לחצו SHIFT + מקש "r"' },
    report: { title: "דיווח על בעיה", caption: 'לחצו "h"' },
    structure: { title: "ניווט לפי מבנה העמוד", caption: 'לחצו "n"' },
    close: { title: "סגירת מרכז הנגישות", caption: 'השתמשו במקש "escape"' },
    statement: { title: "צפייה בהצהרת הנגישות", caption: 'לחצו "b"' },
    contentScaling: { title: "הגדלת תוכן", caption: 'לחצו "[" או "]"' },
    usefulLinks: { title: "קישורים שימושיים", caption: 'לחצו "u"' },
  },
  report: { title: "דיווח על בעיית נגישות", subtitle: "תארו את בעיית הנגישות שנתקלתם בה" },
  structure: { title: "מבנה העמוד", back: "חזרה לכלי הנגישות", landmarks: "ציוני דרך", headings: "כותרות", links: "קישורים", topOfPage: "תחילת העמוד" },
  footer: { statement: "הצהרת נגישות" },
  common: { decrease: "הקטנה", increase: "הגדלה", activateNext: "הפעילו כדי לעבור לאפשרות הבאה.", esc: "esc" },
};

const ZH_CN: A11yStrings = {
  launcher: { ariaLabel: "探索无障碍选项", pill: "探索无障碍选项" },
  header: { title: "无障碍中心", subtitle: "根据您的需求调整本网站", close: "关闭无障碍中心" },
  language: { choose: "选择界面语言", current: "当前语言", pickerTitle: "选择语言", back: "返回" },
  tabs: { tools: "个性化设置", report: "报告问题" },
  profiles: {
    title: "无障碍配置",
    subtitle: "一键预设,组合下方的多项调整。",
    resetAll: "全部重置",
    epilepsy: { name: "癫痫安全模式", description: "停止动画并降低色彩强度,以降低发作风险。" },
    vision: { name: "视力障碍", description: "使用高辨识度字体放大文字,并增加行距与字距。" },
    older: { name: "老年用户", description: "放大文字,使用高辨识度字体,提高对比度,并突出显示链接。" },
    cognitive: { name: "认知障碍", description: "突出显示链接和标题,并添加阅读引导条以帮助集中注意力。" },
    adhd: { name: "注意力友好模式", description: "通过聚焦阅读窗口和减少动态效果来减少干扰。" },
    blind: { name: "视障用户(屏幕阅读器)", description: "为 JAWS、NVDA、VoiceOver 和 TalkBack 用户显示图片说明。" },
    motor: { name: "键盘导航(肢体障碍)", description: "提供强焦点轮廓和大号黑色光标,方便键盘操作。" },
  },
  quickActions: { navigateStructure: "按页面结构导航", showShortcuts: "显示快捷键" },
  content: {
    title: "内容调整",
    contentScaling: "内容缩放",
    lineHeight: "行高",
    letterSpacing: "字间距",
    textAlignGroup: "文本对齐",
    alignLeft: "文本左对齐",
    alignCenter: "文本居中对齐",
    alignRight: "文本右对齐",
    left: "左",
    center: "居中",
    right: "右",
    textSize: "文字大小",
    font: "字体",
    highlight: "高亮",
    magnifier: "文字放大镜",
    states: {
      largeText: { off: "默认", large: "较大", larger: "更大" },
      font: { default: "默认", serif: "衬线", readable: "易读" },
      highlight: { off: "关闭", links: "链接", headings: "标题", all: "全部" },
    },
  },
  color: {
    title: "颜色调整",
    contrast: "对比度",
    saturation: "饱和度",
    textColors: "调整文字颜色",
    titleColors: "调整标题颜色",
    backgroundColors: "调整背景颜色",
    cancel: "取消",
    states: {
      contrast: { off: "关闭", high: "高", inverted: "反转", dark: "深色", light: "浅色" },
      saturation: { off: "关闭", high: "高", low: "低", monochrome: "单色" },
    },
    swatches: { blue: "蓝色", purple: "紫色", red: "红色", orange: "橙色", teal: "青色", green: "绿色", white: "白色", black: "黑色" },
  },
  orientation: {
    title: "方向调整",
    muteSounds: "静音",
    hideImages: "隐藏图片",
    readMode: "阅读模式",
    guide: "阅读引导条",
    window: "阅读窗口",
    animation: "动画",
    hover: "悬停高亮",
    focus: "焦点",
    cursor: "光标",
    altText: "替代文字",
    usefulLinks: "常用链接",
    selectAPage: "选择页面",
    hideInterface: "隐藏界面",
    states: { cursor: { off: "默认", black: "黑色", white: "白色" } },
    links: { home: "首页", services: "服务项目", schedule: "预约就诊", contact: "联系我们", patientInfo: "患者信息", statement: "无障碍声明" },
  },
  confirmHide: {
    title: "要隐藏无障碍界面吗?",
    body: "这会在每个页面上隐藏无障碍按钮。要恢复,请在浏览器中清除本网站的浏览数据并重新加载页面。",
    cancel: "取消",
    confirm: "隐藏界面",
  },
  shortcuts: {
    reset: { title: "重置视觉面板", caption: '按 SHIFT + "r" 键' },
    report: { title: "报告问题", caption: '按 "h" 键' },
    structure: { title: "按页面结构导航", caption: '按 "n" 键' },
    close: { title: "关闭无障碍中心", caption: '使用 "esc" 键' },
    statement: { title: "查看无障碍声明", caption: '按 "b" 键' },
    contentScaling: { title: "内容缩放", caption: '按 "[" 或 "]" 键' },
    usefulLinks: { title: "常用链接", caption: '按 "u" 键' },
  },
  report: { title: "报告无障碍问题", subtitle: "请描述您遇到的无障碍问题" },
  structure: { title: "页面结构", back: "返回无障碍工具", landmarks: "地标", headings: "标题", links: "链接", topOfPage: "页面顶部" },
  footer: { statement: "无障碍声明" },
  common: { decrease: "减小", increase: "增大", activateNext: "激活以切换到下一个选项。", esc: "esc" },
};

const ZH_TW: A11yStrings = {
  launcher: { ariaLabel: "探索無障礙選項", pill: "探索無障礙選項" },
  header: { title: "無障礙中心", subtitle: "根據您的需求調整本網站", close: "關閉無障礙中心" },
  language: { choose: "選擇介面語言", current: "目前語言", pickerTitle: "選擇語言", back: "返回" },
  tabs: { tools: "個人化設定", report: "回報問題" },
  profiles: {
    title: "無障礙設定檔",
    subtitle: "一鍵套用預設,組合下方的多項調整。",
    resetAll: "全部重設",
    epilepsy: { name: "癲癇安全模式", description: "停止動畫並降低色彩強度,以降低發作風險。" },
    vision: { name: "視力障礙", description: "使用高辨識度字型放大文字,並增加行距與字距。" },
    older: { name: "年長使用者", description: "放大文字,使用高辨識度字型,提高對比度,並醒目標示連結。" },
    cognitive: { name: "認知障礙", description: "醒目標示連結與標題,並加入閱讀輔助條以協助專注。" },
    adhd: { name: "注意力友善模式", description: "透過聚焦閱讀視窗和減少動態效果來降低干擾。" },
    blind: { name: "視障使用者(螢幕閱讀器)", description: "為 JAWS、NVDA、VoiceOver 與 TalkBack 使用者顯示圖片說明。" },
    motor: { name: "鍵盤導覽(肢體障礙)", description: "提供強焦點外框與大型黑色游標,方便鍵盤操作。" },
  },
  quickActions: { navigateStructure: "依頁面結構導覽", showShortcuts: "顯示快速鍵" },
  content: {
    title: "內容調整",
    contentScaling: "內容縮放",
    lineHeight: "行高",
    letterSpacing: "字距",
    textAlignGroup: "文字對齊",
    alignLeft: "文字靠左對齊",
    alignCenter: "文字置中對齊",
    alignRight: "文字靠右對齊",
    left: "左",
    center: "置中",
    right: "右",
    textSize: "文字大小",
    font: "字型",
    highlight: "醒目提示",
    magnifier: "文字放大鏡",
    states: {
      largeText: { off: "預設", large: "較大", larger: "更大" },
      font: { default: "預設", serif: "襯線", readable: "易讀" },
      highlight: { off: "關閉", links: "連結", headings: "標題", all: "全部" },
    },
  },
  color: {
    title: "顏色調整",
    contrast: "對比度",
    saturation: "飽和度",
    textColors: "調整文字顏色",
    titleColors: "調整標題顏色",
    backgroundColors: "調整背景顏色",
    cancel: "取消",
    states: {
      contrast: { off: "關閉", high: "高", inverted: "反轉", dark: "深色", light: "淺色" },
      saturation: { off: "關閉", high: "高", low: "低", monochrome: "單色" },
    },
    swatches: { blue: "藍色", purple: "紫色", red: "紅色", orange: "橙色", teal: "藍綠色", green: "綠色", white: "白色", black: "黑色" },
  },
  orientation: {
    title: "方向調整",
    muteSounds: "靜音",
    hideImages: "隱藏圖片",
    readMode: "閱讀模式",
    guide: "閱讀輔助條",
    window: "閱讀視窗",
    animation: "動畫",
    hover: "滑鼠停留醒目提示",
    focus: "焦點",
    cursor: "游標",
    altText: "替代文字",
    usefulLinks: "常用連結",
    selectAPage: "選擇頁面",
    hideInterface: "隱藏介面",
    states: { cursor: { off: "預設", black: "黑色", white: "白色" } },
    links: { home: "首頁", services: "服務項目", schedule: "預約看診", contact: "聯絡我們", patientInfo: "病患資訊", statement: "無障礙聲明" },
  },
  confirmHide: {
    title: "要隱藏無障礙介面嗎?",
    body: "這會在每個頁面隱藏無障礙按鈕。若要復原,請在瀏覽器中清除本網站的瀏覽資料並重新載入頁面。",
    cancel: "取消",
    confirm: "隱藏介面",
  },
  shortcuts: {
    reset: { title: "重設視覺面板", caption: '按 SHIFT + "r" 鍵' },
    report: { title: "回報問題", caption: '按 "h" 鍵' },
    structure: { title: "依頁面結構導覽", caption: '按 "n" 鍵' },
    close: { title: "關閉無障礙中心", caption: '使用 "esc" 鍵' },
    statement: { title: "檢視無障礙聲明", caption: '按 "b" 鍵' },
    contentScaling: { title: "內容縮放", caption: '按 "[" 或 "]" 鍵' },
    usefulLinks: { title: "常用連結", caption: '按 "u" 鍵' },
  },
  report: { title: "回報無障礙問題", subtitle: "請描述您遇到的無障礙問題" },
  structure: { title: "頁面結構", back: "返回無障礙工具", landmarks: "地標", headings: "標題", links: "連結", topOfPage: "頁面頂端" },
  footer: { statement: "無障礙聲明" },
  common: { decrease: "減少", increase: "增加", activateNext: "啟用以切換至下一個選項。", esc: "esc" },
};

const JA: A11yStrings = {
  launcher: { ariaLabel: "アクセシビリティ オプションを見る", pill: "アクセシビリティ オプションを見る" },
  header: { title: "アクセシビリティセンター", subtitle: "このサイトをご自身のニーズに合わせて調整します", close: "アクセシビリティセンターを閉じる" },
  language: { choose: "インターフェースの言語を選択", current: "現在の言語", pickerTitle: "言語を選択してください", back: "戻る" },
  tabs: { tools: "パーソナライズ", report: "問題を報告" },
  profiles: {
    title: "アクセシビリティ プロファイル",
    subtitle: "下記の調整項目をまとめたワンタップのプリセットです。",
    resetAll: "すべてリセット",
    epilepsy: { name: "てんかん配慮モード", description: "発作のリスクを減らすため、アニメーションを停止し色の強度を下げます。" },
    vision: { name: "視覚障がい配慮", description: "読みやすい書体で文字を拡大し、行間と文字間隔を広げます。" },
    older: { name: "高齢の方向け", description: "文字を拡大し、読みやすい書体、高コントラスト、リンクの強調表示を行います。" },
    cognitive: { name: "認知障がい配慮", description: "リンクと見出しを強調表示し、集中を助ける読書ガイドを追加します。" },
    adhd: { name: "ADHD配慮モード", description: "集中読書ウィンドウと動きの低減で気の散りを抑えます。" },
    blind: { name: "視覚障がい者(スクリーンリーダー)", description: "JAWS、NVDA、VoiceOver、TalkBack向けに画像の説明を表示します。" },
    motor: { name: "キーボード操作(運動機能配慮)", description: "キーボード操作向けに強いフォーカス枠と大きな黒いカーソルを表示します。" },
  },
  quickActions: { navigateStructure: "ページ構造から移動", showShortcuts: "ショートカットを表示" },
  content: {
    title: "コンテンツ調整",
    contentScaling: "コンテンツの拡大縮小",
    lineHeight: "行の高さ",
    letterSpacing: "文字間隔",
    textAlignGroup: "テキストの配置",
    alignLeft: "テキストを左揃えにする",
    alignCenter: "テキストを中央揃えにする",
    alignRight: "テキストを右揃えにする",
    left: "左",
    center: "中央",
    right: "右",
    textSize: "文字サイズ",
    font: "フォント",
    highlight: "強調表示",
    magnifier: "テキスト拡大鏡",
    states: {
      largeText: { off: "標準", large: "大", larger: "特大" },
      font: { default: "標準", serif: "明朝体", readable: "読みやすい書体" },
      highlight: { off: "オフ", links: "リンク", headings: "見出し", all: "すべて" },
    },
  },
  color: {
    title: "色の調整",
    contrast: "コントラスト",
    saturation: "彩度",
    textColors: "文字色を調整",
    titleColors: "見出し色を調整",
    backgroundColors: "背景色を調整",
    cancel: "キャンセル",
    states: {
      contrast: { off: "オフ", high: "高", inverted: "反転", dark: "ダーク", light: "ライト" },
      saturation: { off: "オフ", high: "高", low: "低", monochrome: "モノクロ" },
    },
    swatches: { blue: "青", purple: "紫", red: "赤", orange: "オレンジ", teal: "ティール", green: "緑", white: "白", black: "黒" },
  },
  orientation: {
    title: "操作性の調整",
    muteSounds: "音を消す",
    hideImages: "画像を非表示",
    readMode: "読書モード",
    guide: "読書ガイド",
    window: "読書ウィンドウ",
    animation: "アニメーション",
    hover: "ホバー強調",
    focus: "フォーカス",
    cursor: "カーソル",
    altText: "代替テキスト",
    usefulLinks: "よく使うリンク",
    selectAPage: "ページを選択してください",
    hideInterface: "インターフェースを非表示",
    states: { cursor: { off: "標準", black: "黒", white: "白" } },
    links: { home: "ホーム", services: "診療内容", schedule: "予約する", contact: "お問い合わせ", patientInfo: "患者様向け情報", statement: "アクセシビリティ方針" },
  },
  confirmHide: {
    title: "アクセシビリティインターフェースを非表示にしますか?",
    body: "すべてのページでアクセシビリティボタンが非表示になります。元に戻すには、ブラウザでこのサイトの閲覧データを削除してページを再読み込みしてください。",
    cancel: "キャンセル",
    confirm: "インターフェースを非表示にする",
  },
  shortcuts: {
    reset: { title: "ビジュアルパネルをリセット", caption: 'SHIFT + "r" キーを押す' },
    report: { title: "問題を報告", caption: '"h" キーを押す' },
    structure: { title: "ページ構造から移動", caption: '"n" キーを押す' },
    close: { title: "アクセシビリティセンターを閉じる", caption: '"esc" キーを使う' },
    statement: { title: "アクセシビリティ方針を見る", caption: '"b" キーを押す' },
    contentScaling: { title: "コンテンツの拡大縮小", caption: '"[" または "]" キーを押す' },
    usefulLinks: { title: "よく使うリンク", caption: '"u" キーを押す' },
  },
  report: { title: "アクセシビリティの問題を報告", subtitle: "発生したアクセシビリティの問題をご記入ください" },
  structure: { title: "ページ構造", back: "アクセシビリティツールに戻る", landmarks: "ランドマーク", headings: "見出し", links: "リンク", topOfPage: "ページの先頭" },
  footer: { statement: "アクセシビリティ方針" },
  common: { decrease: "縮小", increase: "拡大", activateNext: "次のオプションに切り替えるには選択してください。", esc: "esc" },
};

const STRINGS: Record<LangCode, A11yStrings> = {
  "en-US": EN,
  es: ES,
  fr: FR,
  de: DE,
  pt: PT,
  it: IT,
  nl: NL,
  pl: PL,
  tr: TR,
  ru: RU,
  ar: AR,
  he: HE,
  "zh-CN": ZH_CN,
  "zh-TW": ZH_TW,
  ja: JA,
};

export function getStrings(lang: LangCode): A11yStrings {
  return STRINGS[lang] ?? STRINGS[DEFAULT_LANG];
}

const LANG_STORAGE_KEY = "a11y-lang";

export function readStoredLang(): LangCode {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const raw = window.localStorage.getItem(LANG_STORAGE_KEY);
    return LANGUAGES.some((l) => l.code === raw) ? (raw as LangCode) : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function persistLang(lang: LangCode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

// Maps the English swatch names stored in A11Y_SWATCHES (src/lib/a11y.ts)
// to the current language's swatch label, so aria-labels stay translated
// without duplicating the swatch list itself per language.
export function swatchLabel(strings: A11yStrings, englishName: string): string {
  const key = englishName.toLowerCase() as keyof A11yStrings["color"]["swatches"];
  return strings.color.swatches[key] ?? englishName;
}
