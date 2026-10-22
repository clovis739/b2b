export type Product = {
  id: number; name: string; category: string; image: string; price: number | null;
  supplier: string; country: string; flag: string; verified: boolean; min: number; fresh: boolean;
};

export const categories = [
  { name: "All vegetables", count: 24, icon: "leaf" },
  { name: "Onion", count: 6, icon: "onion" },
  { name: "Potato", count: 4, icon: "potato" },
  { name: "Tomato", count: 4, icon: "tomato" },
  { name: "Pepper", count: 4, icon: "pepper" },
  { name: "Carrot", count: 3, icon: "carrot" },
  { name: "Broccoli", count: 3, icon: "broccoli" },
];
const base: Omit<Product, "id">[] = [
  {name:"Premium Indian Red Onions – Export Quality",category:"Onion",image:"onions",price:325,supplier:"Laskara LTD",country:"United Kingdom",flag:"🇬🇧",verified:true,min:20,fresh:true},
  {name:"Fresh Red Tomatoes, Premium Export Grade",category:"Tomato",image:"tomatoes",price:420,supplier:"Lohmod Exports",country:"India",flag:"🇮🇳",verified:true,min:10,fresh:true},
  {name:"Fresh Bell Peppers – Mixed Colors",category:"Pepper",image:"peppers",price:null,supplier:"EvoEthos International",country:"India",flag:"🇮🇳",verified:true,min:5,fresh:true},
  {name:"Fresh Egyptian Potatoes – Export Quality",category:"Potato",image:"potatoes",price:490,supplier:"Egyland International Trade",country:"Egypt",flag:"🇪🇬",verified:true,min:25,fresh:true},
  {name:"Farm Fresh Carrots, Naturally Grown",category:"Carrot",image:"carrots",price:380,supplier:"Green Harvest Exports",country:"Netherlands",flag:"🇳🇱",verified:true,min:10,fresh:true},
  {name:"Fresh Green Broccoli – Premium Quality",category:"Broccoli",image:"broccoli",price:null,supplier:"Stellar Export",country:"Vietnam",flag:"🇻🇳",verified:false,min:5,fresh:true},
  {name:"Red & White Onions, Bulk Wholesale",category:"Onion",image:"onions",price:440,supplier:"Egyland International Trade",country:"Egypt",flag:"🇪🇬",verified:true,min:20,fresh:true},
  {name:"Fresh Vine Tomatoes for Wholesale",category:"Tomato",image:"tomatoes",price:510,supplier:"Atlas Fresh Produce",country:"Morocco",flag:"🇲🇦",verified:true,min:5,fresh:true},
  {name:"Sweet Bell Peppers, Farm Direct",category:"Pepper",image:"peppers",price:680,supplier:"Green Harvest Exports",country:"Netherlands",flag:"🇳🇱",verified:true,min:10,fresh:true},
  {name:"Golden Potatoes, Selected for Export",category:"Potato",image:"potatoes",price:460,supplier:"Paradise MultiTrade",country:"Nigeria",flag:"🇳🇬",verified:false,min:15,fresh:true},
  {name:"Organic Carrots, Fresh Bulk Supply",category:"Carrot",image:"carrots",price:550,supplier:"Atlas Fresh Produce",country:"Morocco",flag:"🇲🇦",verified:true,min:5,fresh:true},
  {name:"IQF Frozen Broccoli Florets",category:"Broccoli",image:"broccoli",price:890,supplier:"ATL Global Co. Ltd",country:"Vietnam",flag:"🇻🇳",verified:true,min:10,fresh:false},
  {name:"Large Red Onions, Premium 55+ mm",category:"Onion",image:"onions",price:290,supplier:"Lucy Vastralaya",country:"India",flag:"🇮🇳",verified:true,min:25,fresh:true},
  {name:"White Onions, Carefully Selected",category:"Onion",image:"onions",price:410,supplier:"Lohmod Exports",country:"India",flag:"🇮🇳",verified:true,min:10,fresh:true},
  {name:"Pink Onions, Fresh Harvest",category:"Onion",image:"onions",price:null,supplier:"Paradise MultiTrade",country:"Nigeria",flag:"🇳🇬",verified:false,min:15,fresh:true},
  {name:"Fresh Red Onions, Bulk Export Supply",category:"Onion",image:"onions",price:350,supplier:"Laskara LTD",country:"United Kingdom",flag:"🇬🇧",verified:true,min:20,fresh:true},
  {name:"Selected Table Potatoes, Wholesale",category:"Potato",image:"potatoes",price:470,supplier:"Green Harvest Exports",country:"Netherlands",flag:"🇳🇱",verified:true,min:20,fresh:true},
  {name:"Frozen Potato Cubes, Food Service",category:"Potato",image:"potatoes",price:1100,supplier:"Egyland International Trade",country:"Egypt",flag:"🇪🇬",verified:true,min:10,fresh:false},
  {name:"Fresh Tomatoes, Carefully Packed",category:"Tomato",image:"tomatoes",price:null,supplier:"Egyland International Trade",country:"Egypt",flag:"🇪🇬",verified:true,min:10,fresh:true},
  {name:"Ripe Red Tomatoes, Bulk Supply",category:"Tomato",image:"tomatoes",price:390,supplier:"Stellar Export",country:"Vietnam",flag:"🇻🇳",verified:false,min:5,fresh:true},
  {name:"Green Bell Peppers, Export Grade",category:"Pepper",image:"peppers",price:620,supplier:"Atlas Fresh Produce",country:"Morocco",flag:"🇲🇦",verified:true,min:10,fresh:true},
  {name:"Sweet Peppers, Mixed Wholesale Pack",category:"Pepper",image:"peppers",price:null,supplier:"Laskara LTD",country:"United Kingdom",flag:"🇬🇧",verified:true,min:5,fresh:true},
  {name:"Fresh Carrots, Food Processing Grade",category:"Carrot",image:"carrots",price:320,supplier:"Lohmod Exports",country:"India",flag:"🇮🇳",verified:true,min:25,fresh:true},
  {name:"Broccoli Crowns, Fresh Bulk Supply",category:"Broccoli",image:"broccoli",price:720,supplier:"Green Harvest Exports",country:"Netherlands",flag:"🇳🇱",verified:true,min:10,fresh:true},
];
export const products: Product[] = base.map((p, i) => ({ ...p, id: i + 1 }));
export const countries = [...new Set(products.map(p => p.country))].sort();
