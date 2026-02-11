export const destinations = [
  {
    id: 'cretace',
    name: 'Crétacé',
    epoch: '-65 millions d\'années',
    tagline: 'À l\'époque des dinosaures',
    description: 'Vivez une expérience paléontologique unique au cœur du Crétacé supérieur. Paysages préhistoriques, faune et flore disparues, et protocoles de sécurité stricts pour un voyage dans le temps responsable.',
    longDescription: 'Le Crétacé (-65 millions d\'années) vous place au plus près des derniers dinosaures et des écosystèmes disparus. Notre dispositif de voyage temporel vous garantit une observation à distance sécurisée et des moments inoubliables sans interférence avec la chronologie.',
    highlights: [
      'Observation de dinosaures dans leur milieu naturel',
      'Paysages et végétation du Crétacé supérieur',
      'Sessions encadrées par des guides paléontologues',
      'Protocole d\'isolation temporelle strict',
    ],
    safety: [
      'Ne jamais quitter la bulle de protection temporelle',
      'Interdiction de prélever tout élément (végétal, minéral, organique)',
      'Équipement de survie et signal d\'urgence fourni',
      'Durée maximale du séjour : 72 heures (temps subjectif)',
    ],
    image: '/destinations/cretace.png',
    imageAlt: 'Paysage du Crétacé, époque des dinosaures',
  },
  {
    id: 'florence-1504',
    name: 'Florence',
    epoch: '1504',
    tagline: 'Renaissance italienne',
    description: 'Florence en 1504 : ateliers de Léonard de Vinci et Michel-Ange, naissance du David et de la Joconde. Un voyage au cœur de la Renaissance pour les amateurs d\'art et d\'histoire.',
    longDescription: 'En 1504, Florence est le creuset de la Renaissance. Vous pourrez approcher les ateliers des plus grands maîtres, assister aux débats des humanistes et découvrir la ville dans son âge d\'or, avec un protocole de discrétion absolue pour ne pas altérer le cours de l\'histoire.',
    highlights: [
      'Visite des ateliers de Léonard de Vinci et Michel-Ange',
      'Florence des Médicis et de la République',
      'Accès à des événements culturels de l\'époque',
      'Séjour en immersion avec identité d\'époque fournie',
    ],
    safety: [
      'Identité et tenue d\'époque obligatoires',
      'Interdiction de révéler toute information sur l\'avenir',
      'Comportement conforme aux usages du XVIe siècle',
      'Contact permanent avec la base de retour',
    ],
    image: '/destinations/florence-1504.png',
    imageAlt: 'Florence en 1504, Renaissance',
  },
  {
    id: 'paris-1889',
    name: 'Paris',
    epoch: '1889',
    tagline: 'Exposition universelle et Belle Époque',
    description: 'Paris en 1889 : inauguration de la Tour Eiffel, Exposition universelle, cafés littéraires et vie de bohème. La Belle Époque à son apogée pour un séjour culturel et festif.',
    longDescription: 'L\'Exposition universelle de 1889 marque Paris et le monde. Vous assisterez à l\'effervescence autour de la Tour Eiffel, aux débats dans les cafés, aux salons et aux premiers pas du cinéma. Un voyage dans le Paris de la Belle Époque, avec hébergement et programme sur mesure.',
    highlights: [
      'Inauguration et ascension de la Tour Eiffel',
      'Exposition universelle et pavillons internationaux',
      'Cafés littéraires et artistiques (Montmartre, Saint-Germain)',
      'Soirées et spectacles de la Belle Époque',
    ],
    safety: [
      'Tenue et comportement conformes à l\'époque',
      'Interdiction de divulguer des événements futurs',
      'Éviter tout contact prolongé avec des personnalités historiques majeures',
      'Point de retour fixe et horaire impératif',
    ],
    image: '/destinations/paris-1889.png',
    imageAlt: 'Paris 1889, Tour Eiffel et Exposition universelle',
  },
]

export function getDestinationById(id) {
  return destinations.find((d) => d.id === id) || null
}
