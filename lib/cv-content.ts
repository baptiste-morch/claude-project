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
    'Visionnaire stratégique · Développement de partenariats · Accompagnement numérique',
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
  "Mon métier, mon plaisir et ma manière d'être tiennent dans une phrase : **créer des liens improbables**. Entre une idée et une personne. Entre une cause et son public. Entre deux mondes qui s'ignorent. Au micro comme dans la vie, j'écoute, j'associe et je raconte. Je cherche le point de contact que personne n'avait vu — celui qui fait sens, et qui fait du bien.";

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
      "Premier point de contact : traduire les besoins en solutions, accompagner les équipes — même les moins à l'aise avec le numérique.",
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
      "Simplifier les processus, automatiser, faire dialoguer les outils — l'IA comprise.",
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
      "Rendre le complexe accessible et vivant — au micro, sur scène, dans une chronique.",
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
      "Obtention des premiers mandats de service (Conseil des systèmes alimentaires montréalais, Mères avec pouvoir, Parc-Extension).",
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
      "Gérer des équipes et livrer des projets web d'envergure, à temps et dans les budgets — avec la méthode SCRUM/Agile.",
    bullets: [
      "Gestion quotidienne d'équipes (devs, designers, QA) et relation client de la vente à la livraison.",
      "Mise en place de SCRUM/Agile : daily, sprint planning/review, estimations en t-shirt sizes.",
      "Livraisons d'envergure : Devinci, Centraide Québec Chaudières-Appalaches, Barreau du Québec, Québec-Cité, Village Vacances Valcartier.",
      "Participation aux comités de gestion (projets puis entreprise) pour les réflexions stratégiques.",
      "Deux prix de reconnaissance interne accordés par les pairs (gestion, design, développement).",
    ],
  },
  {
    id: 'absolu',
    role: 'Chargé de projets web',
    org: 'Absolu',
    dates: 'Janv. 2016 – sept. 2017',
    start: 2016,
    end: 2017,
    territoires: ['numerique', 'relation'],
    pitch:
      "Réflexion stratégique en amont, estimations, aide à la vente et gestion de production.",
    bullets: [
      "Stratégie de projet (arborescence, contenus, SEO, cibles) et estimations techniques.",
      "Rédaction d'offres de services et de cahiers des charges ; gestion de production.",
      "Architecture des liens entre site web et outils internes du client (API).",
      "Refonte Ecommerce de Surplus RD / Meubles RD : gestion, QA, formation, support.",
    ],
  },
  {
    id: 'ixmedia',
    role: 'Chargé de projets web',
    org: 'iXmédia',
    dates: 'Févr. 2015 – nov. 2015',
    start: 2015,
    end: 2015,
    territoires: ['numerique'],
    pitch:
      "Analyse fonctionnelle, maquettes UX et pilotage serré de budgets et délais.",
    bullets: [
      "Analyse fonctionnelle et structurelle (arborescence, ébauches UX, scénarios).",
      "Projet phare FCVQ : contraintes très serrées tenues avec l'équipe — ma plus grande réussite de l'époque.",
      "Maison de la littérature : interface culturelle avec de beaux enjeux techniques.",
    ],
  },
  {
    id: 'piranha',
    role: 'Chargé de projets interactifs',
    org: 'Équation Humaine (Agence Piranha)',
    dates: 'Mai 2014 – févr. 2015',
    start: 2014,
    end: 2015,
    territoires: ['numerique', 'relation'],
    pitch:
      "Gardien de l'équipe, traducteur entre la technique et les clients.",
    bullets: [
      "Recueils de besoin, cahiers des charges, suivi de production de la maquette à la mise en ligne.",
      "Projet Simons : développement web mobile et application native, mis sur des rails solides.",
      "Reconnu par les devs et designers pour bien les comprendre et les représenter.",
    ],
  },
  {
    id: 'debuts',
    role: 'Premières armes — webmarketing & dev',
    org: 'Rivadis · ACEOS · Consultant · SAS Institute',
    dates: '2010 – 2014',
    start: 2010,
    end: 2014,
    territoires: ['voix', 'numerique'],
    pitch:
      "Stages fondateurs : marketing digital, partenariats, bénévolat de conseil et business intelligence.",
    bullets: [
      "Laboratoire Rivadis (2012-2013) : campagne d'influence avant l'heure — 15 blogueuses, +1000 fans Facebook, idée primée à l'interne.",
      "ACEOS (2012) : refonte de site menée côté client, gains SEO (1 à 10 places selon les termes), mandat proposé à la sortie du stage.",
      "Consultant bénévole (2013-2014) : conseil pour une formation pro, une décoratrice d'intérieur et une structure jeunesse — blogs WordPress.",
      "SAS Institute (2010) : outil de business intelligence codé from scratch pour le comité d'entreprise, salué par le superviseur.",
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
  "Vulgariser, rendre le numérique accessible à celles et ceux pour qui c'est plus difficile — et les sentir contents.",
  "Monter sur scène, animer un panel, préparer longuement puis livrer une performance pertinente.",
  "Explorer l'optimisation, les automatisations et l'IA, et partager l'enthousiasme de la découverte.",
  "Réseauter dans des événements à vocation sociale et environnementale, me sentir à ma place.",
  "Faire « l'extra mile » : livrer ce qui était demandé, et glisser un petit plus pour le WOW.",
];

export const scene: SceneItem[] = [
  {
    role: 'Chroniqueur technologique',
    org: 'CKIA — émission « Québec Réveille »',
    dates: 'Sept. 2018 – juin 2020',
    desc:
      "Chronique aux deux semaines : 3-4 h de recherche pour 10 minutes d'antenne accessibles à toutes et tous.",
  },
  {
    role: 'Assistant régisseur',
    org: 'Improdôme (OBNL, arts et culture)',
    dates: 'Janv. 2019 – présent',
    desc:
      "Logistique des soirées, régie son/lumière, gestion du pacing et de l'ambiance d'un show.",
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
    degree: 'Transformation numérique organisationnelle (2ᵉ cycle)',
    year: '2023',
    note: '94 / 100',
  },
  {
    school: 'ISEG (Paris)',
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
