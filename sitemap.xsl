<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="sitemap image xhtml">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="robots" content="noindex, follow"/>
        <title>Sitemap — Healthians | bookbloodtest.in</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #F0FAFB; color: #1E293B; }

          .sitemap-header {
            background: linear-gradient(135deg, #00A0A8 0%, #006B72 100%);
            color: white;
            padding: 32px 24px 28px;
            text-align: center;
          }
          .sitemap-header h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 6px; }
          .sitemap-header p  { font-size: 0.95rem; opacity: 0.88; }
          .badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.35);
            border-radius: 50px;
            padding: 4px 16px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-top: 10px;
          }

          .stats-bar {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            background: #fff;
            border-bottom: 1px solid #E2E8F0;
            padding: 14px 24px;
          }
          .stat-pill {
            display: flex; align-items: center; gap: 6px;
            font-size: 0.82rem; font-weight: 600; color: #475569;
          }
          .stat-pill span.dot {
            width: 10px; height: 10px; border-radius: 50%; display: inline-block;
          }
          .dot-green  { background: #22C55E; }
          .dot-teal   { background: #00A0A8; }
          .dot-orange { background: #F97316; }
          .dot-purple { background: #8B5CF6; }

          .container { max-width: 1080px; margin: 0 auto; padding: 24px 16px 48px; }

          .filter-bar {
            display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;
          }
          .filter-btn {
            padding: 6px 18px; border-radius: 50px; border: 1.5px solid #CBD5E1;
            background: #FFF; color: #475569; font-size: 0.8rem; font-weight: 600;
            cursor: pointer; transition: all 0.2s;
          }
          .filter-btn.active, .filter-btn:hover {
            background: #00A0A8; color: #FFF; border-color: #00A0A8;
          }

          table {
            width: 100%; border-collapse: collapse;
            background: #FFF; border-radius: 12px;
            overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          }
          thead th {
            background: #0F172A; color: #FFF;
            padding: 12px 16px; text-align: left;
            font-size: 0.78rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: 0.5px;
          }
          tbody tr { border-bottom: 1px solid #F1F5F9; transition: background 0.15s; }
          tbody tr:last-child { border-bottom: none; }
          tbody tr:hover { background: #F0FAFB; }
          tbody td { padding: 11px 16px; font-size: 0.82rem; vertical-align: middle; }

          .url-link { color: #00A0A8; text-decoration: none; font-weight: 500; word-break: break-all; }
          .url-link:hover { text-decoration: underline; }

          .tag {
            display: inline-block; padding: 2px 10px; border-radius: 20px;
            font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          }
          .tag-home     { background: #DCFCE7; color: #166534; }
          .tag-location { background: #DBEAFE; color: #1D4ED8; }
          .tag-test     { background: #FEF9C3; color: #854D0E; }
          .tag-package  { background: #F3E8FF; color: #7C3AED; }
          .tag-article  { background: #FEE2E2; color: #B91C1C; }
          .tag-service  { background: #E0F2FE; color: #0369A1; }

          .priority-bar-wrap { display: flex; align-items: center; gap: 6px; }
          .priority-bar {
            height: 6px; border-radius: 4px; background: #E2E8F0; flex: 1; max-width: 60px; overflow: hidden;
          }
          .priority-fill { height: 100%; border-radius: 4px; background: #00A0A8; }

          .footer-note {
            text-align: center; margin-top: 28px;
            font-size: 0.78rem; color: #94A3B8;
          }
          .footer-note a { color: #00A0A8; text-decoration: none; font-weight: 600; }
          .footer-note a:hover { text-decoration: underline; }

          @media (max-width: 640px) {
            thead th:nth-child(3), thead th:nth-child(4), thead th:nth-child(5),
            tbody td:nth-child(3), tbody td:nth-child(4), tbody td:nth-child(5) { display: none; }
            .stats-bar { gap: 12px; }
          }
        </style>
      </head>
      <body>

        <!-- Header -->
        <div class="sitemap-header">
          <h1>&#127968; Healthians — XML Sitemap</h1>
          <p>bookbloodtest.in | NABL Certified Home Blood Test Booking</p>
          <div class="badge">&#9989; <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs — Google Indexed</div>
        </div>

        <!-- Stats Bar -->
        <div class="stats-bar">
          <div class="stat-pill"><span class="dot dot-green"></span> Homepage: 1</div>
          <div class="stat-pill"><span class="dot dot-teal"></span> Cities: <xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc,'/locations/')])"/></div>
          <div class="stat-pill"><span class="dot dot-orange"></span> Tests: <xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc,'/tests/')])"/></div>
          <div class="stat-pill"><span class="dot dot-purple"></span> Packages: <xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc,'/packages/')])"/></div>
          <div class="stat-pill"><span class="dot" style="background:#EC4899;"></span> Articles: <xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc,'/articles/')])"/></div>
        </div>

        <div class="container">

          <!-- Table -->
          <table id="sitemap-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Page URL</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Last Updated</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <xsl:variable name="loc" select="sitemap:loc"/>
                <xsl:variable name="pri" select="sitemap:priority"/>

                <!-- Determine page type -->
                <xsl:variable name="type">
                  <xsl:choose>
                    <xsl:when test="contains($loc,'/locations/')">location</xsl:when>
                    <xsl:when test="contains($loc,'/tests/')">test</xsl:when>
                    <xsl:when test="contains($loc,'/packages/')">package</xsl:when>
                    <xsl:when test="contains($loc,'/articles/')">article</xsl:when>
                    <xsl:when test="contains($loc,'-at-home') or contains($loc,'pathology') or contains($loc,'diagnostic')">service</xsl:when>
                    <xsl:otherwise>home</xsl:otherwise>
                  </xsl:choose>
                </xsl:variable>

                <xsl:variable name="tag-class">
                  <xsl:choose>
                    <xsl:when test="$type='location'">tag-location</xsl:when>
                    <xsl:when test="$type='test'">tag-test</xsl:when>
                    <xsl:when test="$type='package'">tag-package</xsl:when>
                    <xsl:when test="$type='article'">tag-article</xsl:when>
                    <xsl:when test="$type='service'">tag-service</xsl:when>
                    <xsl:otherwise>tag-home</xsl:otherwise>
                  </xsl:choose>
                </xsl:variable>

                <!-- Priority bar width -->
                <xsl:variable name="bar-pct">
                  <xsl:choose>
                    <xsl:when test="$pri='1.0'">100%</xsl:when>
                    <xsl:when test="$pri='0.9'">90%</xsl:when>
                    <xsl:when test="$pri='0.85'">85%</xsl:when>
                    <xsl:when test="$pri='0.8'">80%</xsl:when>
                    <xsl:otherwise>75%</xsl:otherwise>
                  </xsl:choose>
                </xsl:variable>

                <tr>
                  <td style="color:#94A3B8;font-weight:600;width:40px;">
                    <xsl:value-of select="position()"/>
                  </td>
                  <td>
                    <a class="url-link" href="{$loc}" target="_blank" rel="noopener">
                      <xsl:value-of select="$loc"/>
                    </a>
                  </td>
                  <td>
                    <span class="tag {$tag-class}">
                      <xsl:value-of select="$type"/>
                    </span>
                  </td>
                  <td>
                    <div class="priority-bar-wrap">
                      <div class="priority-bar">
                        <div class="priority-fill" style="width:{$bar-pct};"></div>
                      </div>
                      <span style="font-size:0.78rem;font-weight:700;color:#0F172A;">
                        <xsl:value-of select="$pri"/>
                      </span>
                    </div>
                  </td>
                  <td style="color:#64748B;">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                  <td style="color:#64748B;text-transform:capitalize;">
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                </tr>

              </xsl:for-each>
            </tbody>
          </table>

          <div class="footer-note">
            <p>
              Sitemap valid for Google &#10003; &#160;|&#160;
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener">Submit in Search Console</a>
              &#160;|&#160;
              <a href="/">&#8592; Back to Homepage</a>
            </p>
          </div>

        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
