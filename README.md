# Sajt – Borislav Knežević, grafički dizajner

Lični portfolio sajt na dva jezika:

- **srpski** (otvara se prvi): https://borislavknezevic.com/
- **engleski**: https://borislavknezevic.com/en/

Sajt čine obični HTML, CSS i JS fajlovi i ne treba mu nikakav dodatni alat. GitHub Pages ga objavljuje besplatno, a domen `borislavknezevic.com` je kupljen na Spaceship-u.

---

## 1. Ubaci fajlove na GitHub

Repozitorijum je **github.com/bdesigner1993/bdesignerd**.

1. Raspakuj ZIP na računaru.
2. Na stranici repozitorijuma klikni **„uploading an existing file“** (ili **Add file → Upload files**).
3. Otvori raspakovani folder `bdesignerd-website`, označi **sve što je unutra** (Ctrl+A) i prevuci u prozor na GitHubu.
   Prevlači sadržaj foldera, a ne sam folder. Fajlovi `index.html` i `CNAME` moraju da budu na vrhu repozitorijuma.
4. Sačekaj da se učitaju svi fajlovi (ima ih oko 90), pa klikni **Commit changes**.

> Fajl `.nojekyll` je skriven na Mac računarima. Ako se ne učita, ništa se ne kvari.

## 2. Uključi GitHub Pages i domen

1. U repozitorijumu otvori **Settings → Pages**.
2. Pod **Source** izaberi **Deploy from a branch**, zatim **main** i **/ (root)**, pa klikni **Save**.
3. Pod **Custom domain** proveri da piše `borislavknezevic.com`. Ako ne piše, upiši ga i klikni **Save**.
   (Fajl `CNAME` iz ZIP-a obično ovo upiše sam.)

## 3. Podesi DNS u Spaceship-u

1. Uloguj se na **spaceship.com** i otvori **Advanced DNS Manager**.
2. Izaberi domen **borislavknezevic.com**, pa **DNS records → Custom records**.
3. **Prvo obriši** postojeće zapise koji bi smetali: **A**, **CNAME** ili **URL Redirect** zapise za `@` i `www` (na primer stranicu za parkiranje domena).
4. Dodaj ove zapise (**+ Add record**):

| Tip | Host / Name | Vrednost |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `bdesigner1993.github.io` |

5. Sačuvaj izmene.

DNS obično proradi za nekoliko minuta, a nekad treba i do 24 sata.

## 4. Uključi HTTPS

1. Vrati se u GitHub **Settings → Pages**.
2. Kad se pojavi poruka da je DNS ispravan („DNS check successful“), čekiraj **Enforce HTTPS**.
3. Otvori **https://borislavknezevic.com** – sajt je online. I `www.borislavknezevic.com` će automatski voditi na isti sajt.

> Dodatna zaštita (preporučeno): na GitHubu otvori **profilna slika → Settings → Pages → Add a domain** i potvrdi domen dodavanjem TXT zapisa u Spaceship-u, po uputstvu koje GitHub prikaže. Tako niko drugi ne može da poveže tvoj domen sa svojim sajtom.

---

## 5. Prijavi sajt Google-u (SEO)

Sajt već ima sve što Google traži: naslov i opis za svaki jezik, oznake za srpsku i englesku verziju (hreflang), podatke o tebi u formatu koji Google razume (Person i ProfilePage), mapu sajta sa svih 60 slika (`sitemap.xml`), `robots.txt` i slike koje se prikazuju kad se link podeli na društvenim mrežama.

Da bi te Google brže našao:

1. Idi na **search.google.com/search-console** i prijavi se Gmail nalogom.
2. Klikni **Add property** i izaberi **Domain**. Upiši `borislavknezevic.com`.
3. Google će ti dati **TXT zapis**. U Spaceship-u (DNS records → Custom records) dodaj zapis tipa **TXT**, sa Host `@` i vrednošću koju je Google dao. Zatim u Search Console klikni **Verify**.
4. U meniju levo otvori **Sitemaps**, upiši `https://borislavknezevic.com/sitemap.xml` i klikni **Submit**.

Još saveta:
- Dodaj **borislavknezevic.com** na Instagram, LinkedIn (Contact info → Website) i Behance profil, kao i u potpis mejla.
- Upiši adresu sajta i u CV.

---

## Kako da menjaš sajt kasnije

- **Tekst:** na GitHubu otvori `index.html` (srpski) ili `en/index.html` (engleski), klikni ikonicu olovke, izmeni tekst i klikni **Commit changes**. Izmena je na sajtu za 1–2 minuta.
- **Slika:** ubaci novu sliku sa **potpuno istim imenom** u `assets/img/work/` (Add file → Upload files). Stara će biti zamenjena.
- **CV:** ubaci novi PDF sa istim imenom u folder `files/`.

## Šta je u fajlovima

| Fajl / folder | Čemu služi |
|---|---|
| `index.html` | Srpska verzija sajta (početna) |
| `en/index.html` | Engleska verzija |
| `404.html` | Stranica za pogrešnu adresu |
| `CNAME` | Govori GitHubu da sajt radi na `borislavknezevic.com` – ne briši ga |
| `assets/css/style.css` | Izgled sajta |
| `assets/js/main.js` | Interaktivni delovi: slot aparat, filteri, galerija, forma, kopiranje mejla |
| `assets/img/work/` | 60 radova (WebP, bez Vivatbet logoa) |
| `assets/img/logos/` | Logoi klijenata |
| `assets/fonts/` | Fontovi Archivo Black i Fira Sans |
| `files/` | CV i CV + portfolio u PDF-u |
| `sitemap.xml`, `robots.txt` | Za Google |
| `site.webmanifest`, `favicon.ico`, `*.png` | Ikonica sajta (tvoja slika) |
