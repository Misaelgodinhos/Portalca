#!/usr/bin/env python3
"""Generate O Ponto sitemap from published Supabase article IDs. Public data only."""
import json
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
BASE = "https://misaelgodinhos.github.io/Portalca/"
API = "https://dthqzavxqoejqszsijqd.supabase.co/rest/v1/portal_ca_articles?select=id,updated_at&status=eq.published&order=created_at.desc&limit=1000"
# Publishable key is public by design; no privileged credentials are needed.
KEY = "sb_publishable_rN1cirhfpFyxghxKx-gLTA_Ca0TP_Rn"
req = urllib.request.Request(API, headers={"apikey": KEY, "Accept": "application/json"})
with urllib.request.urlopen(req, timeout=20) as response:
    articles = json.load(response)
ns = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", ns)
root = ET.Element(f"{{{ns}}}urlset")
def add(url, lastmod=None):
    item = ET.SubElement(root, f"{{{ns}}}url")
    ET.SubElement(item, f"{{{ns}}}loc").text = url
    if lastmod:
        ET.SubElement(item, f"{{{ns}}}lastmod").text = lastmod[:10]
add(BASE)
for article in articles:
    if article.get("id"):
        add(BASE + "article.html?id=" + article["id"], article.get("updated_at"))
ET.indent(root, space="  ")
ET.ElementTree(root).write(Path(__file__).resolve().parent.parent / "sitemap.xml", encoding="utf-8", xml_declaration=True)
print(f"Sitemap gerado com {len(articles)} notícias.")
