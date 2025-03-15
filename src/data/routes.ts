import type { Route } from '../types/booking';

export const routes: Route[] = [
  {
    id: 'blue-lagoon-trogir',
    nameEn: 'Blue Lagoon & Trogir',
    nameHr: 'Plava Laguna i Trogir',
    descriptionEn: 'Experience the crystal clear waters of Blue Lagoon and visit the historic UNESCO town of Trogir',
    descriptionHr: 'Doživite kristalno čisto more Plave Lagune i posjetite povijesni UNESCO grad Trogir',
    duration: 300, // 5 hours in minutes
    capacity: 10,
    basePrice: 70,
    stops: ['Trogir', 'Blue Lagoon', 'Maslinica']
  },
  {
    id: 'blue-cave-vis',
    nameEn: 'Blue Cave & Island Vis',
    nameHr: 'Modra Špilja i Otok Vis',
    descriptionEn: 'Full day adventure visiting the magical Blue Cave, Stiniva bay, and beautiful islands',
    descriptionHr: 'Cjelodnevna avantura s posjetom čarobnoj Modroj špilji, uvali Stiniva i prekrasnim otocima',
    duration: 660, // 11 hours in minutes
    capacity: 10,
    basePrice: 130,
    stops: ['Blue Cave', 'Stiniva bay', 'Budikovac Island', 'Pakleni Island', 'Hvar']
  },
  {
    id: 'swimming-horses-brac',
    nameEn: 'Swimming with Horses - Brač',
    nameHr: 'Plivanje s Konjima - Brač',
    descriptionEn: 'Unique experience swimming with horses on the beautiful island of Brač',
    descriptionHr: 'Jedinstveni doživljaj plivanja s konjima na prekrasnom otoku Braču',
    duration: 300, // 5 hours in minutes
    capacity: 10,
    basePrice: 500,
    stops: ['Brač']
  },
  {
    id: 'hvar-blue-lagoon',
    nameEn: 'Hvar & Blue Lagoon',
    nameHr: 'Hvar i Plava Laguna',
    descriptionEn: 'Combine the glamour of Hvar with the natural beauty of Blue Lagoon',
    descriptionHr: 'Spojite glamur Hvara s prirodnim ljepotama Plave Lagune',
    duration: 600, // 10 hours in minutes
    capacity: 10,
    basePrice: 900,
    stops: ['Hvar', 'Blue Lagoon']
  },
  {
    id: 'split-airport-transfer',
    nameEn: 'Split - Airport Transfer',
    nameHr: 'Split - Zračna Luka Transfer',
    descriptionEn: 'Quick and comfortable boat transfer to Split Airport',
    descriptionHr: 'Brzi i udobni transfer brodom do zračne luke Split',
    duration: 15,
    capacity: 10,
    basePrice: 150,
    stops: ['Split', 'Airport']
  },
  {
    id: 'split-trogir-transfer',
    nameEn: 'Split - Trogir Transfer',
    nameHr: 'Split - Trogir Transfer',
    descriptionEn: 'Scenic boat transfer between Split and Trogir',
    descriptionHr: 'Slikoviti transfer brodom između Splita i Trogira',
    duration: 20,
    capacity: 10,
    basePrice: 180,
    stops: ['Split', 'Trogir']
  }
];