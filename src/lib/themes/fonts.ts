import {Inconsolata, Montserrat} from 'next/font/google';

const _inconsolata = Inconsolata({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap'
});

const _montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese']
});

export const montserrat = _montserrat.style.fontFamily;

export const inconsolata = _inconsolata.style.fontFamily;