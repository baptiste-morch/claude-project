// Contenu du CV interactif de Baptiste Morch.
// Sources de vérité : bilan_competences_Baptiste_Morch + profil LinkedIn à jour.
// Éditer ce fichier pour ajuster textes, dates, ordre, etc.

export type TerritoireId = 'strategie' | 'relation' | 'numerique' | 'voix';

export type Territoire = {
  id: TerritoireId;
  label: string;
  color: string;
  line: string;
  skills: string[];
};

export type Experience = {
  id: string;
  role: string;
  org: string;
  dates: string;
  start: number;
  end?: number;
  current?: boolean;
  territoires: TerritoireId[];
  pitch: string;
  bullets: string[];
};

export type Realisation = {
  id: string;
  title: string;
  color: string;
  tag: string;
  desc: string;
};

export type SceneItem = {
  role: string;
  org: string;
  dates: string;
  desc: string;
};

export type FormationItem = {
  school: string;
  degree: string;
  year: string;
  note?: string;
};

export const profile = {
  name: 'Baptiste Morch',
  hello: "Salut, moi c'est Baptiste.",
  headline: 'Créons des liens improbables',
  positioning:
    "Je souhaite guider les orientations stratégiques et l'innovation d'une organisation à vocation sociale, en m'appuyant sur ma capacité à bâtir des partenariats.",
  intro:
    "Depuis plus de dix ans, je relie le numérique et l'humain — au service des organisations à vocation sociale, environnementale, citoyenne ou de santé. Réseauteur, improvisateur et chroniqueur radio, je passe mon temps à chercher le point de contact que personne n'avait vu : entre une idée et une personne, entre une cause et son public, entre deux mondes qui s'ignorent.",
  location: 'Québec, QC',
  email: 'baptiste.morch@gmail.com',
  linkedin: 'linkedin.com/in/baptistemorch',
  languages: [
    'Français (langue maternelle)',
    'Anglais (professionnel complet)',
    'Espagnol (notions)',
  ],
};

export const pitch =
  "Mon métier, mon plaisir et ma manière d'être tiennent dans une phrase : **créer des liens improbables**. Entre une idée et une personne. Entre une cause et son public. Au micro comme dans la vie, j'écoute, j'associe et je raconte. J'aime mettre en valeur et servir des humains et des causes sociales et environnementales.";

export const territoires: Territoire[] = [
  {
    id: 'strategie',
    label: 'Stratégie & développement',
    color: '#2B4BF2',
    line:
      "Créer des réseaux à partir de zéro, ouvrir des portes, placer les organisations sur la carte.",
    skills: [
      'Planification stratégique',
      'Développement de partenariats',
      'Réseautage',
      'Vision & prospective',
      'Convaincre & fédérer',
      'Agent de changement',
    ],
  },
  {
    id: 'relation',
    label: 'Relation & accompagnement',
    color: '#E2447C',
    line:
      "Premier point de contact : traduire les besoins en solutions, accompagner les équipes et conseiller les clients.",
    skills: [
      'Gestion de comptes',
      'Conseil & coaching',
      'Écoute & empathie',
      'Vulgarisation',
      'Diplomatie',
      'Négociation',
    ],
  },
  {
    id: 'numerique',
    label: 'Transformation & numérique',
    color: '#1FA37A',
    line:
      "Simplifier les processus, automatiser, faire dialoguer les outils et surtout gérer des projets d'envergure depuis 12 ans.",
    skills: [
      'Gestion de projet (Agile / Scrum)',
      'Optimisation de processus',
      'Automatisations & IA',
      'Gestion du changement',
      "Cartographie d'écosystèmes",
      'No-code / Low-code',
    ],
  },
  {
    id: 'voix',
    label: 'Voix & scène',
    color: '#F4A82A',
    line:
      "Rendre le complexe accessible et vivant : au micro, sur scène, dans une chronique.",
    skills: [
      'Communication',
      'Storytelling',
      'Animation de panels',
      'Chronique radio',
      'Prise de parole',
      'Improvisation',
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: 'compagnons',
    role: 'Chargé de comptes & ambassadeur',
    org: 'Compagnons',
    dates: 'Sept. 2022 – présent',
    start: 2022,
    current: true,
    territoires: ['strategie', 'relation', 'numerique', 'voix'],
    pitch:
      "Conseiller numérique, voix de l'entreprise et entremetteur : de la planification stratégique à l'animation de panels.",
    bullets: [
      "Participation à la planification stratégique de l'entreprise et suivi des indicateurs avec le comité de gestion.",
      "Posture de conseiller numérique en amont des projets : faisabilité, prototypage, cartographie d'écosystèmes et de processus.",
      "Représentation : réseautage, animation de panels, conférences, élargissement de la notoriété.",
      "Automatisations internes reliant nos outils (chat, budgets, ventes ↔ Google) et exploration d'outils d'IA pour le marketing, la QA et le support.",
      "Gestion de projets d'envergure (2022-2025) auprès de clients stratégiques pour des livraisons à temps et dans les budgets.",
    ],
  },
  {
    id: 'dataide',
    role: 'Accompagnateur & coach numérique — DATAide',
    org: 'Compagnons × Nord Ouvert',
    dates: 'Nov. 2025 – présent',
    start: 2025,
    current: true,
    territoires: ['relation', 'numerique'],
    pitch:
      "Accompagner des cohortes d'organismes communautaires dans leur plan de transformation numérique. Vulgariser, rassurer, rendre accessible.",
    bullets: [
      "Coach de cohortes dans le cadre du programme DATAide orchestré par Nord Ouvert.",
      "Aide à la structuration des plans de transformation numérique d'organismes communautaires.",
      "Vulgarisation pour celles et ceux dont la littératie numérique est plus faible.",
    ],
  },
  {
    id: 'flambeau',
    role: 'Ambassadeur & co-fondateur',
    org: 'Flambeau (OBNL)',
    dates: 'Janv. 2024 – mars 2025',
    start: 2024,
    end: 2025,
    territoires: ['strategie', 'relation'],
    pitch:
      "Bâtir un réseau à partir de zéro pour positionner une OBNL dans l'économie sociale et l'innovation sociale.",
    bullets: [
      "Création d'un réseau de rien : 50 à 70 rencontres en quelques mois, chaque interlocuteur en recommandant au moins un autre.",
      "Obtention des premiers mandats de service (Conseil des systèmes alimentaires montréalais, Mères avec pouvoir, Fondation AGES).",
      "Constitution d'un conseil d'administration de profils stratégiques et engagés.",
    ],
  },
  {
    id: 'sigmund',
    role: 'Chargé de projets',
    org: 'Compagnons (anciennement Sigmund)',
    dates: 'Sept. 2017 – sept. 2022',
    start: 2017,
    end: 2022,
    territoires: ['relation', 'numerique'],
    pitch:
      "Gérer des équipes et livrer des projets web d'envergure, à temps et dans les budgets, en appliquant la méthode SCRUM / Agile.",
    bullets: [
      "Gestion quotidienne d'équipes (devs, designers, QA) et relation client de la vente à la livraison.",
      "Mise en place de SCRUM/Agile : daily, sprint planning/review, estimations en t-shirt sizes.",
      "Livraisons d'envergure : Devinci, Centraide Québec Chaudières-Appalaches, Barreau du Québec, Québec-Cité, Village Vacances Valcartier.",
      "Participation aux comités de gestion (projets puis entreprise) pour les réflexions stratégiques.",
      "Deux prix de reconnaissance interne accordés par les pairs (gestion, design, développement).",
    ],
  },
];

export const realisations: Realisation[] = [
  {
    id: 'dataide',
    title: 'DATAide',
    color: '#1FA37A',
    tag: 'Accompagnement numérique',
    desc:
      "Accompagnement de cohortes d'organismes communautaires dans leurs plans de transformation numérique, au sein du programme DATAide (Nord Ouvert). Vulgariser, rassurer, rendre le numérique accessible à celles et ceux pour qui la littératie numérique est plus faible.",
  },
  {
    id: 'flambeau',
    title: 'Flambeau',
    color: '#2B4BF2',
    tag: 'Réseau bâti de zéro',
    desc:
      "Bâtir un réseau à partir de rien pour lancer l'OBNL Flambeau : 50 à 70 rencontres en quelques mois, premiers mandats de service obtenus, conseil d'administration aussi pertinent qu'engagé. De quoi placer l'organisation sur la carte de l'innovation sociale.",
  },
  {
    id: 'off-numerique',
    title: 'OFF Numérique',
    color: '#E2447C',
    tag: 'Animation de panel',
    desc:
      "Organisation et animation du panel d'ouverture de l'événement OFF Numérique, avec des exemples inspirants d'organismes en processus de transformation numérique. Préparer, fédérer les intervenant·e·s et livrer une performance qui rend un enjeu complexe vivant et accessible.",
  },
];

export const vibrer: string[] = [
  "Tisser des liens et faire l'entremetteur entre des personnes ou des organisations qui gagneraient à se rencontrer.",
  "Vulgariser, rendre le numérique accessible à celles et ceux pour qui c'est plus difficile, et leur montrer ce que ça rend possible.",
  "Monter sur scène, animer un panel, préparer longuement puis livrer une performance pertinente.",
  "Explorer l'optimisation, les automatisations et l'IA, et partager l'enthousiasme de la découverte.",
  "Réseauter dans des événements à vocation sociale et environnementale, me sentir à ma place.",
  "Faire « l'extra mile » : livrer ce qui était demandé, et glisser un petit plus pour le WOW.",
];

export const scene: SceneItem[] = [
  {
    role: 'Hôte du podcast « J\'adore ça »',
    org: 'Production indépendante',
    dates: 'Janv. 2024 – présent',
    desc:
      "Plus de deux ans d'épisodes mensuels : conversations enthousiastes avec des invité·e·s autour de ce qui les fait vibrer. Préparation, conduite d'entretien et diffusion.",
  },
  {
    role: 'Improvisateur & aide à la régie',
    org: 'Improdôme (OBNL, arts et culture)',
    dates: 'Janv. 2019 – présent',
    desc:
      "En plus des tâches logistiques et de régie son/lumière, j'anime et participe à un show d'impro mensuel depuis 2019 — pacing, ambiance, public.",
  },
  {
    role: 'Chroniqueur technologique',
    org: 'Radio communautaire CKIA, matinale Québec Réveille',
    dates: 'Sept. 2018 – juin 2020',
    desc:
      "Chronique aux deux semaines : 3-4 h de recherche pour 10 minutes d'antenne accessibles à toutes et tous.",
  },
  {
    role: 'Chargé de projets & communications',
    org: 'Web à Québec',
    dates: '2014 – 2016',
    desc:
      "Stratégie de communication et refonte du site de l'événement, deux années de suite.",
  },
];

export const formation: FormationItem[] = [
  {
    school: 'ESG UQAM',
    degree: 'Formation No-code / Low-code',
    year: '2025',
    note: 'Power Platform, cartographie de processus',
  },
  {
    school: 'Université TÉLUQ',
    degree: 'Transformation numérique organisationnelle (cours de 2ᵉ cycle)',
    year: '2023',
    note: '94 / 100',
  },
  {
    school: 'ISEG (Nantes)',
    degree: 'Master Marketing & Communication (Bac+5)',
    year: '2010–2013',
    note: "Brand management, stratégie d'entreprise",
  },
  {
    school: 'Dublin Business School',
    degree: 'B.A. Marketing Management',
    year: '2011',
    note: 'Upper Second Honours · mémoire en Business Intelligence',
  },
  {
    school: 'IUT de Nantes',
    degree: 'DUT Informatique',
    year: '2008–2010',
    note: 'Président du bureau des étudiants',
  },
  {
    school: 'Autoformations',
    degree: 'IA (IBM / Coursera) · Agile & Scrum · Power Searching',
    year: 'Continu',
    note: 'Rester pertinent et curieux',
  },
];
