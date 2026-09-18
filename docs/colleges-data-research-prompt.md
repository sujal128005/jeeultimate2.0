# Colleges data research prompt (JEE Ultimate 2.0)

Paste the master prompt once, then paste one batch per message. The reply for each
batch is a single JSON array that gets saved and merged into the site by slug.

---

## Master prompt (paste this first)

You are filling a factual database for a JEE counselling website. Accuracy matters more
than completeness: a missing value is fine, an invented one is not.

For every college I give you, find these fields and return them as JSON. Use only the
sources listed below. If a number is not in one of those sources, return null for it.
Never estimate, never average across years, never carry a number over from a similar
college, and never use a coaching or listing website as the source of a number.

Allowed sources, in order of preference:
1. The college's own website: fee structure or fee notification page, hostel page,
   annual report, and the placement or training-and-placement page.
2. The NIRF data files the college itself submitted (nirfindia.org), Engineering
   discipline, latest year available.
3. The JoSAA or CSAB seat matrix on josaa.nic.in or csab.nic.in for seat counts, and
   the UPTAC (uptac.admissions.nic.in) or JAC Delhi (jacdelhi.admissions.nic.in) seat
   matrix for those colleges.
4. AICTE approved intake (facilities.aicte-india.org) only when the counselling seat
   matrix does not cover the college.

Fields per college:

- slug: copy exactly the slug I gave you, do not change it
- seats: total B.Tech / B.E. intake across all branches for the latest admission year,
  integer. Say which document it came from.
- fees: tuition fee for one year for a general category B.Tech student, in rupees,
  integer, latest year. Tuition only: exclude hostel, mess, caution money and one time
  admission charges. If the college only publishes a semester fee, double it and say so
  in the note.
- hostel: true if the college provides hostel accommodation, false if it does not,
  null if you cannot confirm it from the college's own site.
- hostelFee: hostel plus mess charges for one year in rupees, integer, or null.
- campusAcres: campus area in acres, number, or null.
- students: total number of students on campus (all programmes), integer, or null.
- nirfRank: the college's rank in the NIRF Engineering ranking, integer, only if the
  college is actually ranked in it, else null.
- nirfYear: the year of that NIRF ranking.
- placement: an object with year, median, average, highest, placedPct, source.
  median, average and highest are annual packages in lakh per annum (a number, so 21.5
  not "21.5 LPA"), placedPct is the share of eligible students placed as a number from
  0 to 100, source is the URL. Use one placement season only, and say which. If the
  college publishes no placement report and is not in NIRF, return null for the whole
  object rather than a figure from a news article or a listing site.
- sources: array of the URLs you actually used.
- note: one short line for anything I should double check, or "" if there is nothing.

Reply format, nothing else around it:

```json
[
  {
    "slug": "iit-bombay",
    "seats": null,
    "fees": null,
    "hostel": null,
    "hostelFee": null,
    "campusAcres": null,
    "students": null,
    "nirfRank": null,
    "nirfYear": null,
    "placement": { "year": null, "median": null, "average": null, "highest": null, "placedPct": null, "source": null },
    "sources": [],
    "note": ""
  }
]
```

Rules for the reply:
- One object per college, in the order I gave them, every slug present.
- No text before or after the JSON block.
- Do not skip a college because you found nothing. Return it with nulls and a note.
- If two sources disagree, use the college's own site and mention the disagreement in
  the note.

Confirm you understand, then wait for the first batch.

---

## Batch 1 of 6: IITs (24 colleges)

Format: slug | name | city, state | official site

```
iit-bombay | Indian Institute of Technology Bombay | Mumbai, Maharashtra | https://www.iitb.ac.in
iit-delhi | Indian Institute of Technology Delhi | New Delhi, Delhi | https://home.iitd.ac.in
iit-madras | Indian Institute of Technology Madras | Chennai, Tamil Nadu | https://www.iitm.ac.in
iit-kanpur | Indian Institute of Technology Kanpur | Kanpur, Uttar Pradesh | https://www.iitk.ac.in
iit-kharagpur | Indian Institute of Technology Kharagpur | Kharagpur, West Bengal | https://www.iitkgp.ac.in
iit-roorkee | Indian Institute of Technology Roorkee | Roorkee, Uttarakhand | https://www.iitr.ac.in
iit-guwahati | Indian Institute of Technology Guwahati | Guwahati, Assam | https://www.iitg.ac.in
iit-hyderabad | Indian Institute of Technology Hyderabad | Sangareddy, Telangana | https://www.iith.ac.in
iit-bhu | Indian Institute of Technology (Banaras Hindu University) Varanasi | Varanasi, Uttar Pradesh | https://www.iitbhu.ac.in
iit-ism-dhanbad | Indian Institute of Technology (Indian School of Mines) Dhanbad | Dhanbad, Jharkhand | https://www.iitism.ac.in
iit-gandhinagar | Indian Institute of Technology Gandhinagar | Gandhinagar, Gujarat | https://iitgn.ac.in
iit-indore | Indian Institute of Technology Indore | Indore, Madhya Pradesh | https://www.iiti.ac.in
iit-mandi | Indian Institute of Technology Mandi | Mandi, Himachal Pradesh | https://www.iitmandi.ac.in
iit-patna | Indian Institute of Technology Patna | Patna, Bihar | https://www.iitp.ac.in
iit-ropar | Indian Institute of Technology Ropar | Rupnagar, Punjab | https://www.iitrpr.ac.in
iit-jodhpur | Indian Institute of Technology Jodhpur | Jodhpur, Rajasthan | https://www.iitj.ac.in
iit-bhubaneswar | Indian Institute of Technology Bhubaneswar | Bhubaneswar, Odisha | https://www.iitbbs.ac.in
iit-tirupati | Indian Institute of Technology Tirupati | Tirupati, Andhra Pradesh | https://www.iittp.ac.in
iit-palakkad | Indian Institute of Technology Palakkad | Palakkad, Kerala | https://iitpkd.ac.in
iit-goa | Indian Institute of Technology Goa | Ponda, Goa | https://iitgoa.ac.in
iit-jammu | Indian Institute of Technology Jammu | Jammu, Jammu and Kashmir | https://www.iitjammu.ac.in
iit-bhilai | Indian Institute of Technology Bhilai | Bhilai, Chhattisgarh | https://www.iitbhilai.ac.in
iit-dharwad | Indian Institute of Technology Dharwad | Dharwad, Karnataka | https://www.iitdh.ac.in
iisc-bengaluru | Indian Institute of Science | Bengaluru, Karnataka | https://iisc.ac.in
```

## Batch 2 of 6: NITs (32 colleges)

Format: slug | name | city, state | official site

```
nit-trichy | National Institute of Technology Tiruchirappalli | Tiruchirappalli, Tamil Nadu | https://www.nitt.edu
nit-surathkal | National Institute of Technology Karnataka, Surathkal | Mangaluru, Karnataka | https://www.nitk.ac.in
nit-warangal | National Institute of Technology Warangal | Warangal, Telangana | https://www.nitw.ac.in
nit-rourkela | National Institute of Technology Rourkela | Rourkela, Odisha | https://www.nitrkl.ac.in
nit-calicut | National Institute of Technology Calicut | Kozhikode, Kerala | https://nitc.ac.in
mnnit-allahabad | Motilal Nehru National Institute of Technology Allahabad | Prayagraj, Uttar Pradesh | https://www.mnnit.ac.in
mnit-jaipur | Malaviya National Institute of Technology Jaipur | Jaipur, Rajasthan | https://www.mnit.ac.in
manit-bhopal | Maulana Azad National Institute of Technology Bhopal | Bhopal, Madhya Pradesh | https://www.manit.ac.in
vnit-nagpur | Visvesvaraya National Institute of Technology Nagpur | Nagpur, Maharashtra | https://vnit.ac.in
svnit-surat | Sardar Vallabhbhai National Institute of Technology Surat | Surat, Gujarat | https://www.svnit.ac.in
nit-kurukshetra | National Institute of Technology Kurukshetra | Kurukshetra, Haryana | https://nitkkr.ac.in
nit-durgapur | National Institute of Technology Durgapur | Durgapur, West Bengal | https://nitdgp.ac.in
nit-delhi | National Institute of Technology Delhi | New Delhi, Delhi | https://nitdelhi.ac.in
nit-silchar | National Institute of Technology Silchar | Silchar, Assam | https://www.nits.ac.in
nit-jalandhar | Dr. B R Ambedkar National Institute of Technology Jalandhar | Jalandhar, Punjab | https://www.nitj.ac.in
nit-hamirpur | National Institute of Technology Hamirpur | Hamirpur, Himachal Pradesh | https://nith.ac.in
nit-patna | National Institute of Technology Patna | Patna, Bihar | https://www.nitp.ac.in
nit-raipur | National Institute of Technology Raipur | Raipur, Chhattisgarh | https://www.nitrr.ac.in
nit-jamshedpur | National Institute of Technology Jamshedpur | Jamshedpur, Jharkhand | https://www.nitjsr.ac.in
nit-srinagar | National Institute of Technology Srinagar | Srinagar, Jammu and Kashmir | https://nitsri.ac.in
nit-agartala | National Institute of Technology Agartala | Agartala, Tripura | https://www.nita.ac.in
nit-goa | National Institute of Technology Goa | Ponda, Goa | https://www.nitgoa.ac.in
nit-puducherry | National Institute of Technology Puducherry | Karaikal, Puducherry | https://nitpy.ac.in
nit-uttarakhand | National Institute of Technology Uttarakhand | Srinagar (Garhwal), Uttarakhand | https://www.nituk.ac.in
nit-andhra-pradesh | National Institute of Technology Andhra Pradesh | Tadepalligudem, Andhra Pradesh | https://nitandhra.ac.in
nit-arunachal-pradesh | National Institute of Technology Arunachal Pradesh | Jote, Arunachal Pradesh | https://www.nitap.ac.in
nit-manipur | National Institute of Technology Manipur | Imphal, Manipur | https://www.nitmanipur.ac.in
nit-meghalaya | National Institute of Technology Meghalaya | Shillong, Meghalaya | https://www.nitm.ac.in
nit-mizoram | National Institute of Technology Mizoram | Aizawl, Mizoram | https://www.nitmz.ac.in
nit-nagaland | National Institute of Technology Nagaland | Chumoukedima, Nagaland | https://nitnagaland.ac.in
nit-sikkim | National Institute of Technology Sikkim | Ravangla, Sikkim | https://nitsikkim.ac.in
iiest-shibpur | Indian Institute of Engineering Science and Technology, Shibpur | Howrah, West Bengal | https://www.iiests.ac.in
```

## Batch 3 of 6: IIITs (26 colleges)

Format: slug | name | city, state | official site

```
iiit-allahabad | Indian Institute of Information Technology Allahabad | Prayagraj, Uttar Pradesh | https://www.iiita.ac.in
abv-iiitm-gwalior | Atal Bihari Vajpayee Indian Institute of Information Technology and Management Gwalior | Gwalior, Madhya Pradesh | https://www.iiitm.ac.in
iiitdm-jabalpur | PDPM Indian Institute of Information Technology, Design and Manufacturing Jabalpur | Jabalpur, Madhya Pradesh | https://www.iiitdmj.ac.in
iiitdm-kancheepuram | Indian Institute of Information Technology, Design and Manufacturing Kancheepuram | Chennai, Tamil Nadu | https://www.iiitdm.ac.in
iiitdm-kurnool | Indian Institute of Information Technology, Design and Manufacturing Kurnool | Kurnool, Andhra Pradesh | https://iiitk.ac.in
iiit-guwahati | Indian Institute of Information Technology Guwahati | Guwahati, Assam | https://www.iiitg.ac.in
iiit-kota | Indian Institute of Information Technology Kota | Kota, Rajasthan | https://www.iiitkota.ac.in
iiit-vadodara | Indian Institute of Information Technology Vadodara | Gandhinagar, Gujarat | https://iiitvadodara.ac.in
iiit-vadodara-diu | Indian Institute of Information Technology Vadodara International Campus Diu | Diu, Dadra and Nagar Haveli and Daman and Diu | https://iiitvadodara.ac.in
iiit-sri-city | Indian Institute of Information Technology Sri City, Chittoor | Sri City, Andhra Pradesh | https://www.iiits.ac.in
iiit-tiruchirappalli | Indian Institute of Information Technology Tiruchirappalli | Tiruchirappalli, Tamil Nadu | https://iiitt.ac.in
iiit-una | Indian Institute of Information Technology Una | Una, Himachal Pradesh | https://iiitu.ac.in
iiit-sonepat | Indian Institute of Information Technology Sonepat | Sonipat, Haryana | https://iiitsonepat.ac.in
iiit-kalyani | Indian Institute of Information Technology Kalyani | Kalyani, West Bengal | https://iiitkalyani.ac.in
iiit-lucknow | Indian Institute of Information Technology Lucknow | Lucknow, Uttar Pradesh | https://iiitl.ac.in
iiit-dharwad | Indian Institute of Information Technology Dharwad | Dharwad, Karnataka | https://iiitdwd.ac.in
iiit-kottayam | Indian Institute of Information Technology Kottayam | Kottayam, Kerala | https://www.iiitkottayam.ac.in
iiit-manipur | Indian Institute of Information Technology Senapati, Manipur | Imphal, Manipur | https://www.iiitmanipur.ac.in
iiit-nagpur | Indian Institute of Information Technology Nagpur | Nagpur, Maharashtra | https://iiitn.ac.in
iiit-pune | Indian Institute of Information Technology Pune | Pune, Maharashtra | https://www.iiitp.ac.in
iiit-ranchi | Indian Institute of Information Technology Ranchi | Ranchi, Jharkhand | https://iiitranchi.ac.in
iiit-bhagalpur | Indian Institute of Information Technology Bhagalpur | Bhagalpur, Bihar | https://www.iiitbh.ac.in
iiit-bhopal | Indian Institute of Information Technology Bhopal | Bhopal, Madhya Pradesh | https://iiitbhopal.ac.in
iiit-surat | Indian Institute of Information Technology Surat | Surat, Gujarat | https://iiitsurat.ac.in
iiit-agartala | Indian Institute of Information Technology Agartala | Agartala, Tripura | https://iiitagartala.ac.in
iiit-raichur | Indian Institute of Information Technology Raichur | Raichur, Karnataka | https://iiitr.ac.in
```

## Batch 4 of 6: GFTIs part 1 (28 colleges)

Format: slug | name | city, state | official site

```
assam-university | Assam University, Silchar | Silchar, Assam | https://www.aus.ac.in
bit-deoghar | Birla Institute of Technology, Deoghar Off-Campus | Deoghar, Jharkhand | https://www.bitmesra.ac.in
bit-mesra | Birla Institute of Technology, Mesra, Ranchi | Ranchi, Jharkhand | https://www.bitmesra.ac.in
bit-patna | Birla Institute of Technology, Patna Off-Campus | Patna, Bihar | https://www.bitmesra.ac.in
cit-kokrajhar | Central Institute of Technology Kokrajhar | Kokrajhar, Assam | https://www.cit.ac.in
cu-haryana | Central University of Haryana | Mahendergarh, Haryana | https://www.cuh.ac.in
cu-jammu | Central University of Jammu | Samba, Jammu and Kashmir | https://www.cujammu.ac.in
cu-jharkhand | Central University of Jharkhand | Ranchi, Jharkhand | https://www.cuj.ac.in
cu-karnataka | Central University of Karnataka | Kalaburagi, Karnataka | https://www.cuk.ac.in
cu-punjab | Central University of Punjab | Bathinda, Punjab | https://www.cup.edu.in
cu-rajasthan | Central University of Rajasthan | Kishangarh, Rajasthan | https://www.curaj.ac.in
csvtu-bhilai | Chhattisgarh Swami Vivekanand Technical University, Bhilai | Bhilai, Chhattisgarh | https://csvtu.ac.in
gsv-vadodara | Gati Shakti Vishwavidyalaya, Vadodara | Vadodara, Gujarat | https://gsv.ac.in
gkciet-malda | Ghani Khan Choudhury Institute of Engineering and Technology, Malda | Malda, West Bengal | https://www.gkciet.ac.in
gkv-haridwar | Gurukula Kangri Vishwavidyalaya, Haridwar | Haridwar, Uttarakhand | https://www.gkv.ac.in
iict-bhadohi | Indian Institute of Carpet Technology, Bhadohi | Bhadohi, Uttar Pradesh | no site on file
iiht-salem | Indian Institute of Handloom Technology, Salem | Salem, Tamil Nadu | no site on file
iiht-varanasi | Indian Institute of Handloom Technology, Varanasi | Varanasi, Uttar Pradesh | no site on file
ict-ioc-bhubaneswar | Institute of Chemical Technology, Mumbai: IndianOil Odisha Campus, Bhubaneswar | Bhubaneswar, Odisha | no site on file
iet-sagar | Institute of Engineering and Technology, Dr. H. S. Gour University, Sagar | Sagar, Madhya Pradesh | https://www.dhsgsu.edu.in
iitram-ahmedabad | Institute of Infrastructure, Technology, Research and Management, Ahmedabad | Ahmedabad, Gujarat | https://iitram.ac.in
ggv-bilaspur | Institute of Technology, Guru Ghasidas Vishwavidyalaya, Bilaspur | Bilaspur, Chhattisgarh | https://www.ggu.ac.in
iiit-bhubaneswar | International Institute of Information Technology, Bhubaneswar | Bhubaneswar, Odisha | https://www.iiit-bh.ac.in
iiit-naya-raipur | International Institute of Information Technology, Naya Raipur | Nava Raipur, Chhattisgarh | https://www.iiitnr.ac.in
iust-awantipora | Islamic University of Science and Technology, Kashmir | Awantipora, Jammu and Kashmir | https://www.iust.ac.in
jkiapt-allahabad | J.K. Institute of Applied Physics and Technology, University of Allahabad | Prayagraj, Uttar Pradesh | https://www.allduniv.ac.in
jnu-delhi | Jawaharlal Nehru University, Delhi (School of Engineering) | New Delhi, Delhi | https://www.jnu.ac.in
mizoram-university | Mizoram University, Aizawl | Aizawl, Mizoram | https://mzu.edu.in
```

## Batch 5 of 6: GFTIs part 2 (28 colleges)

Format: slug | name | city, state | official site

```
niamt-ranchi | National Institute of Advanced Manufacturing Technology, Ranchi | Ranchi, Jharkhand | https://niamt.ac.in
nielit-agartala | National Institute of Electronics and Information Technology, Agartala | Agartala, Tripura | https://nielit.gov.in
nielit-aizawl | National Institute of Electronics and Information Technology, Aizawl | Aizawl, Mizoram | https://nielit.gov.in
nielit-ajmer | National Institute of Electronics and Information Technology, Ajmer | Ajmer, Rajasthan | https://nielit.gov.in
nielit-aurangabad | National Institute of Electronics and Information Technology, Aurangabad | Chhatrapati Sambhajinagar, Maharashtra | https://nielit.gov.in
nielit-calicut | National Institute of Electronics and Information Technology, Calicut | Kozhikode, Kerala | https://nielit.gov.in
nielit-gorakhpur | National Institute of Electronics and Information Technology, Gorakhpur | Gorakhpur, Uttar Pradesh | https://nielit.gov.in
nielit-imphal | National Institute of Electronics and Information Technology, Imphal | Imphal, Manipur | https://nielit.gov.in
nielit-kohima | National Institute of Electronics and Information Technology, Kohima | Kohima, Nagaland | https://nielit.gov.in
nielit-patna | National Institute of Electronics and Information Technology, Patna | Patna, Bihar | https://nielit.gov.in
nielit-ropar | National Institute of Electronics and Information Technology, Ropar | Rupnagar, Punjab | https://nielit.gov.in
nielit-srinagar | National Institute of Electronics and Information Technology, Srinagar | Srinagar, Jammu and Kashmir | https://nielit.gov.in
niftem-kundli | National Institute of Food Technology Entrepreneurship and Management, Kundli | Sonipat, Haryana | https://niftem.ac.in
niftem-thanjavur | National Institute of Food Technology Entrepreneurship and Management, Thanjavur | Thanjavur, Tamil Nadu | no site on file
nitttr-bhopal | National Institute of Technical Teachers Training and Research, Bhopal | Bhopal, Madhya Pradesh | https://www.nitttrbpl.ac.in
nerist-itanagar | North Eastern Regional Institute of Science and Technology, Itanagar | Nirjuli, Arunachal Pradesh | https://nerist.ac.in
nehu-shillong | North-Eastern Hill University, Shillong | Shillong, Meghalaya | https://nehu.ac.in
ptu-puducherry | Puducherry Technological University, Puducherry | Puducherry, Puducherry | https://ptuniv.edu.in
pec-chandigarh | Punjab Engineering College, Chandigarh | Chandigarh, Chandigarh | https://pec.ac.in
rgnau-amethi | Rajiv Gandhi National Aviation University, Fursatganj | Fursatganj, Uttar Pradesh | https://rgnau.ac.in
sliet-longowal | Sant Longowal Institute of Engineering and Technology, Longowal | Longowal, Punjab | https://sliet.ac.in
tezpur-university | School of Engineering, Tezpur University | Tezpur, Assam | https://www.tezu.ernet.in
spa-bhopal | School of Planning and Architecture, Bhopal | Bhopal, Madhya Pradesh | https://www.spabhopal.ac.in
spa-delhi | School of Planning and Architecture, New Delhi | New Delhi, Delhi | https://spa.ac.in
spa-vijayawada | School of Planning and Architecture, Vijayawada | Vijayawada, Andhra Pradesh | https://www.spav.ac.in
sgsits-indore | Shri G. S. Institute of Technology and Science, Indore | Indore, Madhya Pradesh | https://www.sgsits.ac.in
smvdu-katra | Shri Mata Vaishno Devi University, Katra | Katra, Jammu and Kashmir | https://www.smvdu.ac.in
uoh-hyderabad | University of Hyderabad | Hyderabad, Telangana | https://uohyd.ac.in
```

## Batch 6 of 6: JAC Delhi and UPTAC colleges (41 colleges)

Format: slug | name | city, state | official site

```
dtu | Delhi Technological University | New Delhi, Delhi | https://dtu.ac.in
nsut | Netaji Subhas University of Technology | New Delhi, Delhi | https://nsut.ac.in
iiit-delhi | Indraprastha Institute of Information Technology Delhi | New Delhi, Delhi | https://iiitd.ac.in
igdtuw | Indira Gandhi Delhi Technical University for Women | New Delhi, Delhi | https://www.igdtuw.ac.in
dseu | Delhi Skill and Entrepreneurship University | New Delhi, Delhi | https://dseu.ac.in
hbtu-kanpur | Harcourt Butler Technical University | Kanpur, Uttar Pradesh | https://hbtu.ac.in
mmmut-gorakhpur | Madan Mohan Malaviya University of Technology | Gorakhpur, Uttar Pradesh | https://www.mmmut.ac.in
iet-lucknow | Institute of Engineering and Technology, Lucknow | Lucknow, Uttar Pradesh | https://ietlucknow.ac.in
knit-sultanpur | Kamla Nehru Institute of Technology, Sultanpur | Sultanpur, Uttar Pradesh | https://knit.ac.in
biet-jhansi | Bundelkhand Institute of Engineering and Technology, Jhansi | Jhansi, Uttar Pradesh | https://bietjhs.ac.in
rec-ambedkar-nagar | Rajkiya Engineering College, Ambedkar Nagar | Akbarpur, Uttar Pradesh | https://recabn.ac.in
rec-azamgarh | Rajkiya Engineering College, Azamgarh | Azamgarh, Uttar Pradesh | no site on file
rec-banda | Rajkiya Engineering College, Banda | Banda, Uttar Pradesh | https://recbanda.ac.in
rec-bijnor | Rajkiya Engineering College, Bijnor | Bijnor, Uttar Pradesh | https://recb.ac.in
rec-kannauj | Rajkiya Engineering College, Kannauj | Kannauj, Uttar Pradesh | https://reck.ac.in
rec-mainpuri | Ahilyabai Holkar Rajkiya Engineering College, Mainpuri | Mainpuri, Uttar Pradesh | no site on file
rec-sonbhadra | Rajkiya Engineering College, Sonbhadra | Churk, Uttar Pradesh | https://www.recsonbhadra.ac.in
rec-basti | Sardar Patel Rajkiya Engineering College, Basti | Basti, Uttar Pradesh | no site on file
rec-gonda | Maa Pateshwari Devi Rajkiya Engineering College, Gonda | Gonda, Uttar Pradesh | no site on file
rec-mirzapur | Samrat Ashok Rajkiya Engineering College, Mirzapur | Mirzapur, Uttar Pradesh | no site on file
rec-pratapgarh | Bharat Ratna Babasaheb Bhimrao Ambedkar Rajkiya Engineering College, Pratapgarh | Pratapgarh, Uttar Pradesh | https://recp.ac.in
uiet-csjmu-kanpur | University Institute of Engineering and Technology, CSJM University, Kanpur | Kanpur, Uttar Pradesh | https://csjmu.ac.in
iet-bundelkhand-university | Institute of Engineering and Technology, Bundelkhand University, Jhansi | Jhansi, Uttar Pradesh | https://bujhansi.ac.in
foet-lucknow-university | Faculty of Engineering and Technology, University of Lucknow | Lucknow, Uttar Pradesh | https://www.lkouniv.ac.in
uptti-kanpur | Uttar Pradesh Textile Technology Institute, Kanpur | Kanpur, Uttar Pradesh | no site on file
aitd-kanpur | Dr. Ambedkar Institute of Technology for Divyangjan, Kanpur | Kanpur, Uttar Pradesh | no site on file
kiet-ghaziabad | KIET Group of Institutions | Ghaziabad, Uttar Pradesh | https://www.kiet.edu
akgec-ghaziabad | Ajay Kumar Garg Engineering College | Ghaziabad, Uttar Pradesh | https://www.akgec.ac.in
abes-ec-ghaziabad | ABES Engineering College | Ghaziabad, Uttar Pradesh | https://www.abes.ac.in
abesit-ghaziabad | ABES Institute of Technology | Ghaziabad, Uttar Pradesh | no site on file
gl-bajaj-greater-noida | G.L. Bajaj Institute of Technology and Management | Greater Noida, Uttar Pradesh | https://www.glbitm.org
jss-noida | JSS Academy of Technical Education, Noida | Noida, Uttar Pradesh | https://jssaten.ac.in
gcet-greater-noida | Galgotias College of Engineering and Technology | Greater Noida, Uttar Pradesh | https://www.galgotiacollege.edu
imsec-ghaziabad | IMS Engineering College | Ghaziabad, Uttar Pradesh | https://www.imsec.ac.in
niet-greater-noida | Noida Institute of Engineering and Technology | Greater Noida, Uttar Pradesh | https://www.niet.co.in
miet-meerut | Meerut Institute of Engineering and Technology | Meerut, Uttar Pradesh | https://www.miet.ac.in
rkgit-ghaziabad | Raj Kumar Goel Institute of Technology | Ghaziabad, Uttar Pradesh | https://www.rkgit.edu.in
gniot-greater-noida | Greater Noida Institute of Technology | Greater Noida, Uttar Pradesh | no site on file
psit-kanpur | Pranveer Singh Institute of Technology | Kanpur, Uttar Pradesh | https://psit.ac.in
kit-kanpur | Kanpur Institute of Technology | Kanpur, Uttar Pradesh | https://www.kit.ac.in
srmcem-lucknow | Shri Ramswaroop Memorial College of Engineering and Management | Lucknow, Uttar Pradesh | https://www.srmcem.ac.in
```

---

## Extra check: GFTI quota defaults

For each of these, tell me which quotas actually apply in JoSAA or CSAB for B.Tech
admission, and give the source. I currently have a default filled in and I want it
verified or corrected.

| College | What I have now | What to confirm |
| --- | --- | --- |
| Punjab Engineering College, Chandigarh | Home State and Other State | Does PEC admit through JoSAA with a home state quota for Chandigarh, or is it All India? |
| BIT Mesra, and the Patna, Deoghar campuses | Home State and All India | Which quota labels does the JoSAA business rules document use for BIT campuses? |
| Assam University, Silchar | Home State and All India | Confirm whether the Assam quota applies in the JoSAA seat matrix. |
| I. K. Gujral Punjab Technical University (PTU) | Home State and All India | Confirm the quota split shown in the JoSAA or CSAB seat matrix. |

Reply as a small JSON array:

```json
[{ "slug": "pec-chandigarh", "quotas": ["hs", "os"], "source": "", "note": "" }]
```

Use only these quota codes: "ai" for All India, "hs" for Home State, "os" for Other
State, "gopen" or others only if the seat matrix actually names them.

---

## What I am not asking for

- Student reviews and ratings. Those belong to the sites that collect them, and copying
  them would be both unreliable and not ours to publish. The site will link out instead.
- Campus photos and logos. The site already pulls each college's own icon from its
  official domain.
- Branch level cutoffs. That is the separate cutoffs dataset, not this one.
