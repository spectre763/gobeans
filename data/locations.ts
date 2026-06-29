export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: string;
  weekend: string;
  phone: string;
  tag: string;
}

export const LOCATIONS: Location[] = [
  {
    id: "loc-ring-road",
    name: "Ring Road",
    address: "Shop No. 12, Shyam Plaza, Ring Road",
    city: "Bhavnagar, Gujarat 364001",
    hours: "Daily  11:00 AM – 11:00 PM",
    weekend: "",
    phone: "+91 98765 43210",
    tag: "Flagship",
  },
  {
    id: "loc-waghawadi",
    name: "Waghawadi Road",
    address: "15, Nilkanth Complex, Waghawadi Road",
    city: "Bhavnagar, Gujarat 364002",
    hours: "Daily  11:00 AM – 11:00 PM",
    weekend: "",
    phone: "+91 98765 43211",
    tag: "Roastery Bar",
  },
  {
    id: "loc-crescent",
    name: "Crescent Circle",
    address: "Crescent Circle, Near SBI Main Branch",
    city: "Bhavnagar, Gujarat 364001",
    hours: "Daily  11:00 AM – 11:00 PM",
    weekend: "",
    phone: "+91 98765 43212",
    tag: "Coming Soon",
  },
];

export const BOOKABLE_LOCATIONS = LOCATIONS.filter(
  (loc) => loc.tag !== "Coming Soon"
);
