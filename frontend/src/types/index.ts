export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'panes' | 'pasteles' | 'galletas' | 'bebidas' | 'especiales';
  available: boolean;
  featured: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  location: string;
}

export interface NavItem {
  name: string;
  href: string;
  current?: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}