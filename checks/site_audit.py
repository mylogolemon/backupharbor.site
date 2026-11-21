from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
from collections import Counter
import json, re, sys, xml.etree.ElementTree as ET

root=Path(__file__).resolve().parent.parent
base='https://www.backupharbor.site'
class Page(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.links=[];self.ids=[];self.h1=0;self.title='';self.in_title=False;self.description='';self.canonical='';self.lang='';self.viewport=False;self.ads=[];self.jsonld=[];self.in_json=False;self.json='';self.noindex=False;self.images_without_alt=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang','')
  if a.get('id'):self.ids.append(a['id'])
  if tag in ('a','link') and a.get('href'):self.links.append(a['href'])
  if tag in ('script','img') and a.get('src'):self.links.append(a['src'])
  if tag=='img' and 'alt' not in a:self.images_without_alt.append(a.get('src',''))
  if tag=='h1':self.h1+=1
  if tag=='title':self.in_title=True
  if tag=='meta' and a.get('name')=='description':self.description=a.get('content','')
  if tag=='meta' and a.get('name')=='viewport':self.viewport=True
  if tag=='meta' and a.get('name')=='robots' and 'noindex' in a.get('content','').lower():self.noindex=True
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
  if tag=='script' and 'adsbygoogle.js' in a.get('src',''):self.ads.append(a.get('src',''))
  if tag=='script' and a.get('type')=='application/ld+json':self.in_json=True;self.json=''
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  if tag=='script' and self.in_json:
   self.in_json=False
   try:self.jsonld.append(json.loads(self.json))
   except json.JSONDecodeError as ex:self.jsonld.append({'error':str(ex)})
 def handle_data(self,data):
  if self.in_title:self.title+=data
  if self.in_json:self.json+=data
errors=[];parsed={};files=sorted(root.rglob('*.html'))
for file in files:
 if any(part.startswith('.') or part in {'dist','node_modules'} for part in file.relative_to(root).parts):continue
 page=Page();page.feed(file.read_text(encoding='utf-8'));parsed[file]=page
 rel=file.relative_to(root);is_content=(file==root/'index.html' or file.parent==root/'guides' and file.name!='index.html' or file.parent==root/'updates' and file.name!='index.html')
 expected_ads=1 if is_content else 0
 if page.lang!='en' or page.h1!=1 or not page.description or not page.viewport:errors.append(f'{rel}: missing language, H1, description, or viewport')
 if not page.canonical.startswith(base+'/'):errors.append(f'{rel}: missing expected canonical')
 if len(page.ads)!=expected_ads or any('client=ca-pub-9278916846563994' not in s for s in page.ads):errors.append(f'{rel}: incorrect AdSense script')
 if page.images_without_alt:errors.append(f'{rel}: image missing alt')
 if len(set(page.ids))!=len(page.ids):errors.append(f'{rel}: duplicate id')
 if any('error' in x for x in page.jsonld):errors.append(f'{rel}: invalid JSON-LD')
 if file.parent==root/'guides' and file.name!='index.html' and not any(x.get('@type')=='Article' for x in page.jsonld):errors.append(f'{rel}: Article JSON-LD missing')
for file,page in parsed.items():
 for href in page.links:
  if href.startswith(('mailto:','tel:','data:','javascript:')):continue
  u=urlparse(href)
  if u.netloc and u.netloc not in {'www.backupharbor.site','backupharbor.site'}:continue
  dest=file if not u.path else (root/unquote(u.path).lstrip('/') if u.path.startswith('/') else file.parent/unquote(u.path))
  dest=dest.resolve()
  if not dest.is_relative_to(root):errors.append(f'{file.relative_to(root)}: path outside site: {href}');continue
  if dest.is_dir():dest=dest/'index.html'
  if not dest.is_file():errors.append(f'{file.relative_to(root)}: missing {href}')
  elif u.fragment and dest in parsed and u.fragment not in parsed[dest].ids:errors.append(f'{file.relative_to(root)}: missing fragment {href}')
for key in ('title','description','canonical'):
 c=Counter(getattr(p,key) for p in parsed.values())
 if any(n>1 for n in c.values()):errors.append(f'duplicate {key}')
guides=[f for f in parsed if f.parent==root/'guides' and f.name!='index.html']
if len(guides)!=24:errors.append(f'expected 24 guides, found {len(guides)}')
if 'mylogolemon@gmail.com' not in (root/'contact.html').read_text():errors.append('contact email missing')
if 'Putri Dahlia' not in (root/'contact.html').read_text():errors.append('contact name missing')
if (root/'ads.txt').read_text().strip()!='google.com, pub-9278916846563994, DIRECT, f08c47fec0942fa0':errors.append('ads.txt mismatch')
if f'Sitemap: {base}/sitemap.xml' not in (root/'robots.txt').read_text():errors.append('robots sitemap mismatch')
urls=[x.text for x in ET.parse(root/'sitemap.xml').findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
canon={p.canonical for p in parsed.values() if not p.noindex}
if len(urls)!=len(set(urls)) or set(urls)!=canon:errors.append('sitemap URLs differ from indexable canonical pages')
for file in root.rglob('*'):
 if file.is_file() and file.suffix in ('.html','.js','.txt','.xml') and not any(p.startswith('.') or p in {'dist','node_modules'} for p in file.relative_to(root).parts):
  s=file.read_text(encoding='utf-8')
  if re.search(r'ca-pub-(?!9278916846563994)\d{16}',s):errors.append(f'{file.relative_to(root)}: unexpected publisher ID')
if errors:print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(parsed)} HTML pages, {len(guides)} guides, {len(urls)} sitemap URLs; links, metadata, contact, and ads.txt checked.')
