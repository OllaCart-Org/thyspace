import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
}

export default function SEO({ title, description, canonical }: SEOProps) {
  return (
    <Head>
      <title>{title} | ThySpace</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="ThySpace" />
      {canonical && <link rel="canonical" href={canonical} />}
    </Head>
  )
}
