import type { Route } from "../types/booking";

export const routes: Route[] = [
  {
    id: "blue-lagoon-trogir",
    nameEn: "Blue Lagoon & Trogir",
    nameHr: "Plava Laguna i Trogir",
    descriptionEn:
      "Experience the crystal clear waters of Blue Lagoon and visit the historic UNESCO town of Trogir",
    descriptionHr:
      "Doživite kristalno čisto more Plave Lagune i posjetite povijesni UNESCO grad Trogir",
    duration: 300, // 5 hours in minutes
    capacity: 10,
    basePrice: 70, // Group tour price
    privateTourPrice: 550, // Private tour price
    discountedPrivateTourPrice: 400,
    stops: ["Trogir", "Blue Lagoon", "Maslinica"],
  },
  {
    id: "blue-cave-vis",
    nameEn: "Blue Cave & Island Vis",
    nameHr: "Modra Špilja i Otok Vis",
    descriptionEn:
      "Full day adventure visiting the magical Blue Cave, Stiniva bay, and beautiful islands",
    descriptionHr:
      "Cjelodnevna avantura s posjetom čarobnoj Modroj špilji, uvali Stiniva i prekrasnim otocima",
    duration: 660, // 11 hours in minutes
    capacity: 10,
    basePrice: 130, // Group tour price
    privateTourPrice: 1200, // Private tour price
    discountedPrivateTourPrice: 1100,
    stops: [
      "Blue Cave",
      "Stiniva bay",
      "Budikovac Island",
      "Pakleni Island",
      "Hvar",
    ],
  },
  {
    id: "swimming-horses-brac",
    nameEn: "Swimming with Horses - Brač",
    nameHr: "Plivanje s Konjima - Brač",
    descriptionEn:
      "Unique experience swimming with horses on the beautiful island of Brač",
    descriptionHr:
      "Jedinstveni doživljaj plivanja s konjima na prekrasnom otoku Braču",
    duration: 300, // 5 hours in minutes
    capacity: 10,
    basePrice: 500,
    privateTourPrice: 500,
    discountedPrivateTourPrice: 400,
    stops: ["Brač"],
  },
  {
    id: "hvar-blue-lagoon",
    nameEn: "Hvar & Blue Lagoon",
    nameHr: "Hvar i Plava Laguna",
    descriptionEn:
      "Combine the glamour of Hvar with the natural beauty of Blue Lagoon",
    descriptionHr: "Spojite glamur Hvara s prirodnim ljepotama Plave Lagune",
    duration: 600, // 10 hours in minutes
    capacity: 10,
    basePrice: 900,
    privateTourPrice: 900,
    discountedPrivateTourPrice: 800,
    stops: ["Hvar", "Blue Lagoon"],
  },
  // Transfer Routes
  {
    id: "split-airport-transfer",
    nameEn: "Split - Airport Transfer",
    nameHr: "Split - Zračna Luka Transfer",
    descriptionEn: "Quick and comfortable boat transfer to Split Airport",
    descriptionHr: "Brzi i udobni transfer brodom do zračne luke Split",
    duration: 15,
    capacity: 10,
    basePrice: 150,
    discountedPrivateTourPrice: 150,
    stops: ["Split", "Airport"],
  },
  {
    id: "split-trogir-transfer",
    nameEn: "Split - Trogir Transfer",
    nameHr: "Split - Trogir Transfer",
    descriptionEn: "Scenic boat transfer between Split and Trogir",
    descriptionHr: "Slikoviti transfer brodom između Splita i Trogira",
    duration: 20,
    capacity: 10,
    basePrice: 180,
    discountedPrivateTourPrice: 180,
    stops: ["Split", "Trogir"],
  },
  {
    id: "split-supetar-transfer",
    nameEn: "Split - Supetar (Brač) Transfer",
    nameHr: "Split - Supetar (Brač) Transfer",
    descriptionEn: "Direct boat transfer to Supetar on Brač island",
    descriptionHr: "Direktni transfer brodom do Supetra na otoku Braču",
    duration: 20,
    capacity: 10,
    basePrice: 200,
    discountedPrivateTourPrice: 200,
    stops: ["Split", "Supetar"],
  },
  {
    id: "split-milna-transfer",
    nameEn: "Split - Milna (Brač) Transfer",
    nameHr: "Split - Milna (Brač) Transfer",
    descriptionEn: "Comfortable boat transfer to Milna on Brač island",
    descriptionHr: "Udobni transfer brodom do Milne na otoku Braču",
    duration: 25,
    capacity: 10,
    basePrice: 200,
    discountedPrivateTourPrice: 200,
    stops: ["Split", "Milna"],
  },
  {
    id: "split-bol-transfer",
    nameEn: "Split - Bol (Brač) Transfer",
    nameHr: "Split - Bol (Brač) Transfer",
    descriptionEn: "Fast boat transfer to Bol on Brač island",
    descriptionHr: "Brzi transfer brodom do Bola na otoku Braču",
    duration: 60,
    capacity: 10,
    basePrice: 350,
    discountedPrivateTourPrice: 350,
    stops: ["Split", "Bol"],
  },
  {
    id: "split-stomorska-transfer",
    nameEn: "Split - Stomorska (Šolta) Transfer",
    nameHr: "Split - Stomorska (Šolta) Transfer",
    descriptionEn: "Direct boat transfer to Stomorska on Šolta island",
    descriptionHr: "Direktni transfer brodom do Stomorske na otoku Šolti",
    duration: 25,
    capacity: 10,
    basePrice: 200,
    discountedPrivateTourPrice: 200,
    stops: ["Split", "Stomorska"],
  },
  {
    id: "split-rogac-transfer",
    nameEn: "Split - Rogač (Šolta) Transfer",
    nameHr: "Split - Rogač (Šolta) Transfer",
    descriptionEn: "Quick boat transfer to Rogač on Šolta island",
    descriptionHr: "Brzi transfer brodom do Rogača na otoku Šolti",
    duration: 25,
    capacity: 10,
    basePrice: 200,
    discountedPrivateTourPrice: 200,
    stops: ["Split", "Rogač"],
  },
  {
    id: "split-hvar-transfer",
    nameEn: "Split/Airport - Hvar Transfer",
    nameHr: "Split/Zračna Luka - Hvar Transfer",
    descriptionEn: "Luxury boat transfer to Hvar island",
    descriptionHr: "Luksuzni transfer brodom do otoka Hvara",
    duration: 60,
    capacity: 10,
    basePrice: 350,
    discountedPrivateTourPrice: 350,
    stops: ["Split", "Airport", "Hvar"],
  },
];
