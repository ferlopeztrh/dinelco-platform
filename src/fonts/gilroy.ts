import localFont from 'next/font/local';

export const gilroy = localFont({
  src: [
    { path: './gilroy/Gilroy-Thin.woff2', weight: '100', style: 'normal' },
    { path: './gilroy/Gilroy-Light.woff2', weight: '300', style: 'normal' },
    { path: './gilroy/Gilroy-Regular.woff2', weight: '400', style: 'normal' },
    { path: './gilroy/Gilroy-Medium.woff2', weight: '500', style: 'normal' },
    { path: './gilroy/Gilroy-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './gilroy/Gilroy-Bold.woff2', weight: '700', style: 'normal' },
    { path: './gilroy/Gilroy-ExtraBold.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-gilroy',
  display: 'swap',
});
