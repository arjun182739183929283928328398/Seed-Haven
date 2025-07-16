
import { Product } from './types';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Individual White Seed',
    type: 'white',
    price: 1.50,
    description: 'A single, pristine white seed.',
    longDescription: 'Our signature white seed, known for its rapid growth and beautiful blossoms. Sourced ethically and guaranteed to sprout.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVrqz1dMoQ7UPHXPQUHzZjT-2nMVUp5mbdACZC4KhynPtiGKx0pl25pUlQFExK9qIPfuYjtTzaFjL8CsELo0RLvNQ3F1qxELuKc5C6snr0RM4wNOzQrdQdnFnmNsOOeJYy5ys-TbCEmhgItRcCkl9BeZhIb4MGAFvj8DTiEZd9AxQYkZAUK13HZl5dPfYO7EWB4Xwlmiyfe9OQaLC-uRAAiwNmtHpL56kFN1BY6FYnqegTLAqjI5yOI4s3wnt6UFBPwwpaSlY-OUU', // A white/light object
    rating: 4.8,
    reviewCount: 120,
    stock: 500,
    origin: 'Himalayan Highlands',
    growthEnvironment: 'Indoor/Outdoor, moderate sunlight'
  },
  {
    id: 'p2',
    name: 'Individual Black Seed',
    type: 'black',
    price: 1.75,
    description: 'A single, lustrous black seed.',
    longDescription: 'A rare and beautiful black seed that produces stunning dark foliage. Perfect for creating contrast in your garden.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDffd4gRU0eppk7uORauqTre8q42rfAfXvt6Ht2p3aZ0WvFi4SZXHUx5oXIgFUBrH4ZpquKNzm4FDeZFrdCpxCdMEnjIcRYYGpzP7h-01IJiGkvb2mc52QEu44SsWrD4m3w7idLMVT-YmWxnS9QO96PIKj5ewnVOmFp4CGyNvFQs4RxecZ5Szdferia3zsZyJb9-39kdQCP54eZTmi8sMADTiNnfYPVYQ3-h0msTtfZ_Tmhf5U3bYIhqV28MdUGSIFmbpUu2z7Y4To', // A black/dark object
    rating: 4.9,
    reviewCount: 150,
    stock: 450,
    origin: 'Volcanic Plains of Andes',
    growthEnvironment: 'Outdoor, full sun'
  },
  {
    id: 'p3',
    name: 'White Seed Pack (x10)',
    type: 'white',
    price: 12.00,
    description: 'A pack of 10 pristine white seeds.',
    longDescription: 'Get a head start on your garden with this value pack of 10 white seeds. Ideal for larger pots or garden beds.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQwTEg3IU22Kls9duU260UYmStBIRrse1kP8cBq87mBSQ74VdxIu2ocIzkZPfAkYNZjEZdekLgJ8w3iLLpRjIwj5pB8hRhmFip-xF4DtXH4rBpecGT-BIJOUnlui8TCuyJJ2FAUKuiBA42P9L6WbPamuTxkQn4rgc9FSbQ6DZVEtkDMDThn4W2dqUsbObmsPKBmqls72nERa3rN9NcMC1ujZjjhzqS8-cqYUraAD-ZziWL3oDykPw0psME11V7Gb56SkGQ9aXVGS0', // White flowers
    rating: 4.7,
    reviewCount: 80,
    stock: 100,
    origin: 'Himalayan Highlands',
    growthEnvironment: 'Indoor/Outdoor, moderate sunlight'
  },
  {
    id: 'p4',
    name: 'Black Seed Pack (x10)',
    type: 'black',
    price: 14.50,
    description: 'A pack of 10 lustrous black seeds.',
    longDescription: 'A full pack of our exotic black seeds. Create a dramatic and elegant garden display with this 10-seed collection.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQwTEg3IU22Kls9duU260UYmStBIRrse1kP8cBq87mBSQ74VdxIu2ocIzkZPfAkYNZjEZdekLgJ8w3iLLpRjIwj5pB8hRhmFip-xF4DtXH4rBpecGT-BIJOUnlui8TCuyJJ2FAUKuiBA42P9L6WbPamuTxkQn4rgc9FSbQ6DZVEtkDMDThn4W2dqUsbObmsPKBmqls72nERa3rN9NcMC1ujZjjhzqS8-cqYUraAD-ZziWL3oDykPw0psME11V7Gb56SkGQ9aXVGS0', // Dark moody nature
    rating: 4.9,
    reviewCount: 95,
    stock: 90,
    origin: 'Volcanic Plains of Andes',
    growthEnvironment: 'Outdoor, full sun'
  },
  {
    id: 'p5',
    name: 'Mixed Seed Pack (5+5)',
    type: 'mixed',
    price: 13.50,
    description: 'A balanced pack of 5 white & 5 black seeds.',
    longDescription: 'The best of both worlds. This mixed pack contains 5 white and 5 black seeds, perfect for creating beautiful patterns and experiencing both varieties. Grown with care in our partner School Gardens.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7E2D8tvj915u-qNoKUzenP9KIcGaKDind4adHQ6VBEN2xZgTsB7PN1aizTUNPcFVQOp7UghwyJwOVEObwLvxYnfEey3DwL-oQNu_zQ3w8OVAkC9OqMEGAZF-sw93J5v3Vwn7YiqUGLkmUim2K0cB4yoO2KpCAz7uH-QkpTVqLpE-KacAp5ZsHT1VW0KLJZ6rAOxByeb9Abkgeb31KE2elkBW-X7tPbfp_YqY-kCbySvvcVuTdtGwozTp1wlv9kP5S7bD8H64TQwU', // Black and white contrast
    rating: 4.8,
    reviewCount: 210,
    stock: 120,
    origin: 'Partner School Gardens',
    growthEnvironment: 'Varies, see individual seed info'
  },
];