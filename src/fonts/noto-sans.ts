import localFont from 'next/font/local';

export const notoSans = localFont({
  src: [
    {
      path: './noto-sans/NotoSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-noto-sans',
  display: 'swap',
});
