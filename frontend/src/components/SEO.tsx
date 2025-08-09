import React from 'react';
import { Helmet } from 'react-helmet-async';

type Props = { title?: string; description?: string; canonical?: string };

const SEO: React.FC<Props> = ({ title, description, canonical }) => (
  <Helmet>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {canonical && <link rel="canonical" href={canonical} />}
  </Helmet>
);

export default SEO;


