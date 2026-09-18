# JEE Ultimate 2.0: one shot college data request

Read all of this before starting. The reply I need is ONE .json file, nothing else.

## What this is

I maintain a factual database of 179 engineering colleges that take part in JoSAA, CSAB,
JAC Delhi and UPTAC counselling. Most fields are already filled. Below is every college
that still has a gap, with the exact fields missing for that college after "needs:".
Fill only those fields. Anything not listed for a college is already done, so skip it.

## Sources you may use, in this order

1. The college's own website: fee structure or fee notification page, hostel page,
   about or campus page, annual report, training and placement page.
2. The college's own NIRF submission PDF. Search "<college name> NIRF 2026 engineering
   submitted data pdf", or try <site>/nirf. This single document usually carries
   sanctioned intake, total students and the median salary, so it is the fastest way to
   fill three fields at once. If only NIRF 2025 exists, use it and say so in the note.
3. josaa.nic.in or csab.nic.in seat matrix, uptac.admissions.nic.in or
   jacdelhi.admissions.nic.in for the state colleges, for seat counts.
4. facilities.aicte-india.org approved intake, only when nothing above covers it.

Never use coaching or listing sites. That means collegedunia, shiksha, careers360,
collegedekho, getmyuni, testbook, collegesearch, and anything similar. If a number only
exists on those, treat it as not found.

## Hard rules

- Never guess, never estimate, never round for convenience, never carry a number from a
  similar college. A null is a correct answer. A wrong number is worse than nothing.
- Every value you fill must carry a "quote" string: a short verbatim line copied from the
  page or PDF you took it from, and the URL of that exact page in "sources". No quote
  means the value must be null.
- Do not touch a field that is not in that college's "needs" list.
- Do not add colleges that are not in this list, and do not change any slug.

## Field definitions

- seats: total sanctioned B.Tech or B.E. intake across all branches for the latest
  admission year. Integer. Not branch-wise, not including M.Tech or PhD.
- fees: tuition fee for ONE YEAR for a general category B.Tech student, in rupees,
  integer. Tuition only: no hostel, no mess, no caution deposit, no one time admission
  charge. If the college publishes a per semester figure, double it and write
  "doubled from per semester figure" in the note.
- hostel: true if the college provides hostel accommodation, false if it does not,
  null if its own site does not say.
- hostelFee: hostel plus mess for one year in rupees, integer, or null.
- students: total students on campus across all programmes, integer.
- campusAcres: campus area in acres, number.
- placement: an object for ONE placement season, the 2024-25 graduating batch where
  possible. year is the ending year as a number (2025 for the 2024-25 batch). median,
  average and highest are annual packages in lakh per annum as numbers, so 12.5 not
  "12.5 LPA". placedPct is the share of eligible students placed, a number from 0 to 100.
  If a college publishes nothing and is not in NIRF, return null for the whole object.

## Reply format

Give me a single downloadable .json file. Its content is one JSON array. One object per
college that appears below, in the same order, every slug present, even when everything
came back null. Use exactly these keys:

```json
[
  {
    "slug": "iit-goa",
    "seats": null,
    "fees": null,
    "hostel": null,
    "hostelFee": null,
    "students": null,
    "campusAcres": null,
    "placement": { "year": null, "median": null, "average": null, "highest": null, "placedPct": null, "source": null },
    "quotes": { "seats": "", "fees": "", "hostel": "", "students": "", "campusAcres": "", "placement": "" },
    "sources": [],
    "note": ""
  }
]
```

No commentary in the file, no markdown around the JSON, no trailing text. If the file
would be very large, split it into several .json files with the same shape and tell me
how many there are.

## The colleges

179 of the 179 colleges still have at least one gap. Missing field counts across all of
them: seats 158, fees 124, hostel 83, students 167, placement 152, campus area 179.

### IITs and IISc (24)

Format: slug | name | city, state | official site | needs

```
iit-bombay | Indian Institute of Technology Bombay | Mumbai, Maharashtra | https://www.iitb.ac.in | needs: seats, students, placement, campusAcres
iit-delhi | Indian Institute of Technology Delhi | New Delhi, Delhi | https://home.iitd.ac.in | needs: seats, students, campusAcres
iit-madras | Indian Institute of Technology Madras | Chennai, Tamil Nadu | https://www.iitm.ac.in | needs: seats, students, placement, campusAcres
iit-kanpur | Indian Institute of Technology Kanpur | Kanpur, Uttar Pradesh | https://www.iitk.ac.in | needs: seats, students, campusAcres
iit-kharagpur | Indian Institute of Technology Kharagpur | Kharagpur, West Bengal | https://www.iitkgp.ac.in | needs: seats, students, placement, campusAcres
iit-roorkee | Indian Institute of Technology Roorkee | Roorkee, Uttarakhand | https://www.iitr.ac.in | needs: seats, students, placement, campusAcres
iit-guwahati | Indian Institute of Technology Guwahati | Guwahati, Assam | https://www.iitg.ac.in | needs: seats, students, campusAcres
iit-hyderabad | Indian Institute of Technology Hyderabad | Sangareddy, Telangana | https://www.iith.ac.in | needs: seats, students, campusAcres
iit-bhu | Indian Institute of Technology (Banaras Hindu University) Varanasi | Varanasi, Uttar Pradesh | https://www.iitbhu.ac.in | needs: seats, students, campusAcres
iit-ism-dhanbad | Indian Institute of Technology (Indian School of Mines) Dhanbad | Dhanbad, Jharkhand | https://www.iitism.ac.in | needs: seats, students, placement, campusAcres
iit-gandhinagar | Indian Institute of Technology Gandhinagar | Gandhinagar, Gujarat | https://iitgn.ac.in | needs: seats, students, placement, campusAcres
iit-indore | Indian Institute of Technology Indore | Indore, Madhya Pradesh | https://www.iiti.ac.in | needs: seats, students, placement, campusAcres
iit-mandi | Indian Institute of Technology Mandi | Mandi, Himachal Pradesh | https://www.iitmandi.ac.in | needs: seats, students, placement, campusAcres
iit-patna | Indian Institute of Technology Patna | Patna, Bihar | https://www.iitp.ac.in | needs: seats, students, placement, campusAcres
iit-ropar | Indian Institute of Technology Ropar | Rupnagar, Punjab | https://www.iitrpr.ac.in | needs: seats, students, placement, campusAcres
iit-jodhpur | Indian Institute of Technology Jodhpur | Jodhpur, Rajasthan | https://www.iitj.ac.in | needs: seats, students, placement, campusAcres
iit-bhubaneswar | Indian Institute of Technology Bhubaneswar | Bhubaneswar, Odisha | https://www.iitbbs.ac.in | needs: seats, students, campusAcres
iit-tirupati | Indian Institute of Technology Tirupati | Tirupati, Andhra Pradesh | https://www.iittp.ac.in | needs: seats, students, campusAcres
iit-palakkad | Indian Institute of Technology Palakkad | Palakkad, Kerala | https://iitpkd.ac.in | needs: seats, students, campusAcres
iit-goa | Indian Institute of Technology Goa | Ponda, Goa | https://iitgoa.ac.in | needs: seats, students, placement, campusAcres
iit-jammu | Indian Institute of Technology Jammu | Jammu, Jammu and Kashmir | https://www.iitjammu.ac.in | needs: seats, students, placement, campusAcres
iit-bhilai | Indian Institute of Technology Bhilai | Bhilai, Chhattisgarh | https://www.iitbhilai.ac.in | needs: seats, students, placement, campusAcres
iit-dharwad | Indian Institute of Technology Dharwad | Dharwad, Karnataka | https://www.iitdh.ac.in | needs: seats, students, placement, campusAcres
iisc-bengaluru | Indian Institute of Science | Bengaluru, Karnataka | https://iisc.ac.in | needs: fees, students, placement, campusAcres
```

### NITs and IIEST (32)

Format: slug | name | city, state | official site | needs

```
nit-trichy | National Institute of Technology Tiruchirappalli | Tiruchirappalli, Tamil Nadu | https://www.nitt.edu | needs: students, placement, campusAcres
nit-surathkal | National Institute of Technology Karnataka, Surathkal | Mangaluru, Karnataka | https://www.nitk.ac.in | needs: students, campusAcres
nit-warangal | National Institute of Technology Warangal | Warangal, Telangana | https://www.nitw.ac.in | needs: campusAcres
nit-rourkela | National Institute of Technology Rourkela | Rourkela, Odisha | https://www.nitrkl.ac.in | needs: students, campusAcres
nit-calicut | National Institute of Technology Calicut | Kozhikode, Kerala | https://nitc.ac.in | needs: students, campusAcres
mnnit-allahabad | Motilal Nehru National Institute of Technology Allahabad | Prayagraj, Uttar Pradesh | https://www.mnnit.ac.in | needs: seats, students, placement, campusAcres
mnit-jaipur | Malaviya National Institute of Technology Jaipur | Jaipur, Rajasthan | https://www.mnit.ac.in | needs: campusAcres
manit-bhopal | Maulana Azad National Institute of Technology Bhopal | Bhopal, Madhya Pradesh | https://www.manit.ac.in | needs: seats, students, placement, campusAcres
vnit-nagpur | Visvesvaraya National Institute of Technology Nagpur | Nagpur, Maharashtra | https://vnit.ac.in | needs: seats, students, placement, campusAcres
svnit-surat | Sardar Vallabhbhai National Institute of Technology Surat | Surat, Gujarat | https://www.svnit.ac.in | needs: seats, students, placement, campusAcres
nit-kurukshetra | National Institute of Technology Kurukshetra | Kurukshetra, Haryana | https://nitkkr.ac.in | needs: seats, students, placement, campusAcres
nit-durgapur | National Institute of Technology Durgapur | Durgapur, West Bengal | https://nitdgp.ac.in | needs: campusAcres
nit-delhi | National Institute of Technology Delhi | New Delhi, Delhi | https://nitdelhi.ac.in | needs: seats, students, placement, campusAcres
nit-silchar | National Institute of Technology Silchar | Silchar, Assam | https://www.nits.ac.in | needs: campusAcres
nit-jalandhar | Dr. B R Ambedkar National Institute of Technology Jalandhar | Jalandhar, Punjab | https://www.nitj.ac.in | needs: students, campusAcres
nit-hamirpur | National Institute of Technology Hamirpur | Hamirpur, Himachal Pradesh | https://nith.ac.in | needs: students, campusAcres
nit-patna | National Institute of Technology Patna | Patna, Bihar | https://www.nitp.ac.in | needs: seats, students, placement, campusAcres
nit-raipur | National Institute of Technology Raipur | Raipur, Chhattisgarh | https://www.nitrr.ac.in | needs: seats, students, placement, campusAcres
nit-jamshedpur | National Institute of Technology Jamshedpur | Jamshedpur, Jharkhand | https://www.nitjsr.ac.in | needs: students, campusAcres
nit-srinagar | National Institute of Technology Srinagar | Srinagar, Jammu and Kashmir | https://nitsri.ac.in | needs: campusAcres
nit-agartala | National Institute of Technology Agartala | Agartala, Tripura | https://www.nita.ac.in | needs: seats, students, placement, campusAcres
nit-goa | National Institute of Technology Goa | Ponda, Goa | https://www.nitgoa.ac.in | needs: campusAcres
nit-puducherry | National Institute of Technology Puducherry | Karaikal, Puducherry | https://nitpy.ac.in | needs: seats, students, placement, campusAcres
nit-uttarakhand | National Institute of Technology Uttarakhand | Srinagar (Garhwal), Uttarakhand | https://www.nituk.ac.in | needs: students, campusAcres
nit-andhra-pradesh | National Institute of Technology Andhra Pradesh | Tadepalligudem, Andhra Pradesh | https://nitandhra.ac.in | needs: campusAcres
nit-arunachal-pradesh | National Institute of Technology Arunachal Pradesh | Jote, Arunachal Pradesh | https://www.nitap.ac.in | needs: seats, students, placement, campusAcres
nit-manipur | National Institute of Technology Manipur | Imphal, Manipur | https://www.nitmanipur.ac.in | needs: seats, students, placement, campusAcres
nit-meghalaya | National Institute of Technology Meghalaya | Shillong, Meghalaya | https://www.nitm.ac.in | needs: campusAcres
nit-mizoram | National Institute of Technology Mizoram | Aizawl, Mizoram | https://www.nitmz.ac.in | needs: campusAcres
nit-nagaland | National Institute of Technology Nagaland | Chumoukedima, Nagaland | https://nitnagaland.ac.in | needs: campusAcres
nit-sikkim | National Institute of Technology Sikkim | Ravangla, Sikkim | https://nitsikkim.ac.in | needs: campusAcres
iiest-shibpur | Indian Institute of Engineering Science and Technology, Shibpur | Howrah, West Bengal | https://www.iiests.ac.in | needs: fees, campusAcres
```

### IIITs (26)

Format: slug | name | city, state | official site | needs

```
iiit-allahabad | Indian Institute of Information Technology Allahabad | Prayagraj, Uttar Pradesh | https://www.iiita.ac.in | needs: seats, fees, students, placement, campusAcres
abv-iiitm-gwalior | Atal Bihari Vajpayee Indian Institute of Information Technology and Management Gwalior | Gwalior, Madhya Pradesh | https://www.iiitm.ac.in | needs: seats, fees, students, placement, campusAcres
iiitdm-jabalpur | PDPM Indian Institute of Information Technology, Design and Manufacturing Jabalpur | Jabalpur, Madhya Pradesh | https://www.iiitdmj.ac.in | needs: seats, fees, students, placement, campusAcres
iiitdm-kancheepuram | Indian Institute of Information Technology, Design and Manufacturing Kancheepuram | Chennai, Tamil Nadu | https://www.iiitdm.ac.in | needs: seats, fees, students, placement, campusAcres
iiitdm-kurnool | Indian Institute of Information Technology, Design and Manufacturing Kurnool | Kurnool, Andhra Pradesh | https://iiitk.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-guwahati | Indian Institute of Information Technology Guwahati | Guwahati, Assam | https://www.iiitg.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-kota | Indian Institute of Information Technology Kota | Kota, Rajasthan | https://www.iiitkota.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-vadodara | Indian Institute of Information Technology Vadodara | Gandhinagar, Gujarat | https://iiitvadodara.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-vadodara-diu | Indian Institute of Information Technology Vadodara International Campus Diu | Diu, Dadra and Nagar Haveli and Daman and Diu | https://iiitvadodara.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-sri-city | Indian Institute of Information Technology Sri City, Chittoor | Sri City, Andhra Pradesh | https://www.iiits.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-tiruchirappalli | Indian Institute of Information Technology Tiruchirappalli | Tiruchirappalli, Tamil Nadu | https://iiitt.ac.in | needs: seats, students, placement, campusAcres
iiit-una | Indian Institute of Information Technology Una | Una, Himachal Pradesh | https://iiitu.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-sonepat | Indian Institute of Information Technology Sonepat | Sonipat, Haryana | https://iiitsonepat.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-kalyani | Indian Institute of Information Technology Kalyani | Kalyani, West Bengal | https://iiitkalyani.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-lucknow | Indian Institute of Information Technology Lucknow | Lucknow, Uttar Pradesh | https://iiitl.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-dharwad | Indian Institute of Information Technology Dharwad | Dharwad, Karnataka | https://iiitdwd.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-kottayam | Indian Institute of Information Technology Kottayam | Kottayam, Kerala | https://www.iiitkottayam.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-manipur | Indian Institute of Information Technology Senapati, Manipur | Imphal, Manipur | https://www.iiitmanipur.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-nagpur | Indian Institute of Information Technology Nagpur | Nagpur, Maharashtra | https://iiitn.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-pune | Indian Institute of Information Technology Pune | Pune, Maharashtra | https://www.iiitp.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-ranchi | Indian Institute of Information Technology Ranchi | Ranchi, Jharkhand | https://iiitranchi.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-bhagalpur | Indian Institute of Information Technology Bhagalpur | Bhagalpur, Bihar | https://www.iiitbh.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-bhopal | Indian Institute of Information Technology Bhopal | Bhopal, Madhya Pradesh | https://iiitbhopal.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-surat | Indian Institute of Information Technology Surat | Surat, Gujarat | https://iiitsurat.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-agartala | Indian Institute of Information Technology Agartala | Agartala, Tripura | https://iiitagartala.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iiit-raichur | Indian Institute of Information Technology Raichur | Raichur, Karnataka | https://iiitr.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
```

### GFTIs A to M (28)

Format: slug | name | city, state | official site | needs

```
assam-university | Assam University, Silchar | Silchar, Assam | https://www.aus.ac.in | needs: seats, fees, students, placement, campusAcres
bit-deoghar | Birla Institute of Technology, Deoghar Off-Campus | Deoghar, Jharkhand | https://www.bitmesra.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
bit-mesra | Birla Institute of Technology, Mesra, Ranchi | Ranchi, Jharkhand | https://www.bitmesra.ac.in | needs: seats, fees, students, placement, campusAcres
bit-patna | Birla Institute of Technology, Patna Off-Campus | Patna, Bihar | https://www.bitmesra.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
cit-kokrajhar | Central Institute of Technology Kokrajhar | Kokrajhar, Assam | https://www.cit.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
cu-haryana | Central University of Haryana | Mahendergarh, Haryana | https://www.cuh.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
cu-jammu | Central University of Jammu | Samba, Jammu and Kashmir | https://www.cujammu.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
cu-jharkhand | Central University of Jharkhand | Ranchi, Jharkhand | https://www.cuj.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
cu-karnataka | Central University of Karnataka | Kalaburagi, Karnataka | https://www.cuk.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
cu-punjab | Central University of Punjab | Bathinda, Punjab | https://www.cup.edu.in | needs: seats, fees, hostel, students, placement, campusAcres
cu-rajasthan | Central University of Rajasthan | Kishangarh, Rajasthan | https://www.curaj.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
csvtu-bhilai | Chhattisgarh Swami Vivekanand Technical University, Bhilai | Bhilai, Chhattisgarh | https://csvtu.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
gsv-vadodara | Gati Shakti Vishwavidyalaya, Vadodara | Vadodara, Gujarat | https://gsv.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
gkciet-malda | Ghani Khan Choudhury Institute of Engineering and Technology, Malda | Malda, West Bengal | https://www.gkciet.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
gkv-haridwar | Gurukula Kangri Vishwavidyalaya, Haridwar | Haridwar, Uttarakhand | https://www.gkv.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iict-bhadohi | Indian Institute of Carpet Technology, Bhadohi | Bhadohi, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
iiht-salem | Indian Institute of Handloom Technology, Salem | Salem, Tamil Nadu | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
iiht-varanasi | Indian Institute of Handloom Technology, Varanasi | Varanasi, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
ict-ioc-bhubaneswar | Institute of Chemical Technology, Mumbai: IndianOil Odisha Campus, Bhubaneswar | Bhubaneswar, Odisha | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
iet-sagar | Institute of Engineering and Technology, Dr. H. S. Gour University, Sagar | Sagar, Madhya Pradesh | https://www.dhsgsu.edu.in | needs: seats, fees, hostel, students, placement, campusAcres
iitram-ahmedabad | Institute of Infrastructure, Technology, Research and Management, Ahmedabad | Ahmedabad, Gujarat | https://iitram.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
ggv-bilaspur | Institute of Technology, Guru Ghasidas Vishwavidyalaya, Bilaspur | Bilaspur, Chhattisgarh | https://www.ggu.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-bhubaneswar | International Institute of Information Technology, Bhubaneswar | Bhubaneswar, Odisha | https://www.iiit-bh.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-naya-raipur | International Institute of Information Technology, Naya Raipur | Nava Raipur, Chhattisgarh | https://www.iiitnr.ac.in | needs: seats, fees, students, placement, campusAcres
iust-awantipora | Islamic University of Science and Technology, Kashmir | Awantipora, Jammu and Kashmir | https://www.iust.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
jkiapt-allahabad | J.K. Institute of Applied Physics and Technology, University of Allahabad | Prayagraj, Uttar Pradesh | https://www.allduniv.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
jnu-delhi | Jawaharlal Nehru University, Delhi (School of Engineering) | New Delhi, Delhi | https://www.jnu.ac.in | needs: seats, fees, students, placement, campusAcres
mizoram-university | Mizoram University, Aizawl | Aizawl, Mizoram | https://mzu.edu.in | needs: seats, fees, students, placement, campusAcres
```

### GFTIs N to Z (28)

Format: slug | name | city, state | official site | needs

```
niamt-ranchi | National Institute of Advanced Manufacturing Technology, Ranchi | Ranchi, Jharkhand | https://niamt.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-agartala | National Institute of Electronics and Information Technology, Agartala | Agartala, Tripura | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-aizawl | National Institute of Electronics and Information Technology, Aizawl | Aizawl, Mizoram | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-ajmer | National Institute of Electronics and Information Technology, Ajmer | Ajmer, Rajasthan | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-aurangabad | National Institute of Electronics and Information Technology, Aurangabad | Chhatrapati Sambhajinagar, Maharashtra | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-calicut | National Institute of Electronics and Information Technology, Calicut | Kozhikode, Kerala | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-gorakhpur | National Institute of Electronics and Information Technology, Gorakhpur | Gorakhpur, Uttar Pradesh | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-imphal | National Institute of Electronics and Information Technology, Imphal | Imphal, Manipur | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-kohima | National Institute of Electronics and Information Technology, Kohima | Kohima, Nagaland | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-patna | National Institute of Electronics and Information Technology, Patna | Patna, Bihar | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-ropar | National Institute of Electronics and Information Technology, Ropar | Rupnagar, Punjab | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
nielit-srinagar | National Institute of Electronics and Information Technology, Srinagar | Srinagar, Jammu and Kashmir | https://nielit.gov.in | needs: seats, fees, hostel, students, placement, campusAcres
niftem-kundli | National Institute of Food Technology Entrepreneurship and Management, Kundli | Sonipat, Haryana | https://niftem.ac.in | needs: seats, fees, students, placement, campusAcres
niftem-thanjavur | National Institute of Food Technology Entrepreneurship and Management, Thanjavur | Thanjavur, Tamil Nadu | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
nitttr-bhopal | National Institute of Technical Teachers Training and Research, Bhopal | Bhopal, Madhya Pradesh | https://www.nitttrbpl.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
nerist-itanagar | North Eastern Regional Institute of Science and Technology, Itanagar | Nirjuli, Arunachal Pradesh | https://nerist.ac.in | needs: seats, fees, students, placement, campusAcres
nehu-shillong | North-Eastern Hill University, Shillong | Shillong, Meghalaya | https://nehu.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
ptu-puducherry | Puducherry Technological University, Puducherry | Puducherry, Puducherry | https://ptuniv.edu.in | needs: seats, fees, hostel, students, placement, campusAcres
pec-chandigarh | Punjab Engineering College, Chandigarh | Chandigarh, Chandigarh | https://pec.ac.in | needs: seats, fees, students, placement, campusAcres
rgnau-amethi | Rajiv Gandhi National Aviation University, Fursatganj | Fursatganj, Uttar Pradesh | https://rgnau.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
sliet-longowal | Sant Longowal Institute of Engineering and Technology, Longowal | Longowal, Punjab | https://sliet.ac.in | needs: seats, fees, students, placement, campusAcres
tezpur-university | School of Engineering, Tezpur University | Tezpur, Assam | https://www.tezu.ernet.in | needs: seats, fees, students, placement, campusAcres
spa-bhopal | School of Planning and Architecture, Bhopal | Bhopal, Madhya Pradesh | https://www.spabhopal.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
spa-delhi | School of Planning and Architecture, New Delhi | New Delhi, Delhi | https://spa.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
spa-vijayawada | School of Planning and Architecture, Vijayawada | Vijayawada, Andhra Pradesh | https://www.spav.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
sgsits-indore | Shri G. S. Institute of Technology and Science, Indore | Indore, Madhya Pradesh | https://www.sgsits.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
smvdu-katra | Shri Mata Vaishno Devi University, Katra | Katra, Jammu and Kashmir | https://www.smvdu.ac.in | needs: seats, fees, students, placement, campusAcres
uoh-hyderabad | University of Hyderabad | Hyderabad, Telangana | https://uohyd.ac.in | needs: seats, fees, students, placement, campusAcres
```

### JAC Delhi and UPTAC colleges (41)

Format: slug | name | city, state | official site | needs

```
dtu | Delhi Technological University | New Delhi, Delhi | https://dtu.ac.in | needs: seats, fees, students, placement, campusAcres
nsut | Netaji Subhas University of Technology | New Delhi, Delhi | https://nsut.ac.in | needs: seats, fees, students, placement, campusAcres
iiit-delhi | Indraprastha Institute of Information Technology Delhi | New Delhi, Delhi | https://iiitd.ac.in | needs: seats, fees, students, placement, campusAcres
igdtuw | Indira Gandhi Delhi Technical University for Women | New Delhi, Delhi | https://www.igdtuw.ac.in | needs: seats, fees, students, placement, campusAcres
dseu | Delhi Skill and Entrepreneurship University | New Delhi, Delhi | https://dseu.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
hbtu-kanpur | Harcourt Butler Technical University | Kanpur, Uttar Pradesh | https://hbtu.ac.in | needs: seats, fees, students, placement, campusAcres
mmmut-gorakhpur | Madan Mohan Malaviya University of Technology | Gorakhpur, Uttar Pradesh | https://www.mmmut.ac.in | needs: seats, fees, students, placement, campusAcres
iet-lucknow | Institute of Engineering and Technology, Lucknow | Lucknow, Uttar Pradesh | https://ietlucknow.ac.in | needs: seats, fees, students, placement, campusAcres
knit-sultanpur | Kamla Nehru Institute of Technology, Sultanpur | Sultanpur, Uttar Pradesh | https://knit.ac.in | needs: seats, fees, students, placement, campusAcres
biet-jhansi | Bundelkhand Institute of Engineering and Technology, Jhansi | Jhansi, Uttar Pradesh | https://bietjhs.ac.in | needs: seats, fees, students, placement, campusAcres
rec-ambedkar-nagar | Rajkiya Engineering College, Ambedkar Nagar | Akbarpur, Uttar Pradesh | https://recabn.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
rec-azamgarh | Rajkiya Engineering College, Azamgarh | Azamgarh, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
rec-banda | Rajkiya Engineering College, Banda | Banda, Uttar Pradesh | https://recbanda.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
rec-bijnor | Rajkiya Engineering College, Bijnor | Bijnor, Uttar Pradesh | https://recb.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
rec-kannauj | Rajkiya Engineering College, Kannauj | Kannauj, Uttar Pradesh | https://reck.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
rec-mainpuri | Ahilyabai Holkar Rajkiya Engineering College, Mainpuri | Mainpuri, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
rec-sonbhadra | Rajkiya Engineering College, Sonbhadra | Churk, Uttar Pradesh | https://www.recsonbhadra.ac.in | needs: seats, fees, students, placement, campusAcres
rec-basti | Sardar Patel Rajkiya Engineering College, Basti | Basti, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
rec-gonda | Maa Pateshwari Devi Rajkiya Engineering College, Gonda | Gonda, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
rec-mirzapur | Samrat Ashok Rajkiya Engineering College, Mirzapur | Mirzapur, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
rec-pratapgarh | Bharat Ratna Babasaheb Bhimrao Ambedkar Rajkiya Engineering College, Pratapgarh | Pratapgarh, Uttar Pradesh | https://recp.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
uiet-csjmu-kanpur | University Institute of Engineering and Technology, CSJM University, Kanpur | Kanpur, Uttar Pradesh | https://csjmu.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
iet-bundelkhand-university | Institute of Engineering and Technology, Bundelkhand University, Jhansi | Jhansi, Uttar Pradesh | https://bujhansi.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
foet-lucknow-university | Faculty of Engineering and Technology, University of Lucknow | Lucknow, Uttar Pradesh | https://www.lkouniv.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
uptti-kanpur | Uttar Pradesh Textile Technology Institute, Kanpur | Kanpur, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
aitd-kanpur | Dr. Ambedkar Institute of Technology for Divyangjan, Kanpur | Kanpur, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
kiet-ghaziabad | KIET Group of Institutions | Ghaziabad, Uttar Pradesh | https://www.kiet.edu | needs: seats, fees, hostel, students, placement, campusAcres
akgec-ghaziabad | Ajay Kumar Garg Engineering College | Ghaziabad, Uttar Pradesh | https://www.akgec.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
abes-ec-ghaziabad | ABES Engineering College | Ghaziabad, Uttar Pradesh | https://www.abes.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
abesit-ghaziabad | ABES Institute of Technology | Ghaziabad, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
gl-bajaj-greater-noida | G.L. Bajaj Institute of Technology and Management | Greater Noida, Uttar Pradesh | https://www.glbitm.org | needs: seats, fees, hostel, students, placement, campusAcres
jss-noida | JSS Academy of Technical Education, Noida | Noida, Uttar Pradesh | https://jssaten.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
gcet-greater-noida | Galgotias College of Engineering and Technology | Greater Noida, Uttar Pradesh | https://www.galgotiacollege.edu | needs: seats, fees, hostel, students, placement, campusAcres
imsec-ghaziabad | IMS Engineering College | Ghaziabad, Uttar Pradesh | https://www.imsec.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
niet-greater-noida | Noida Institute of Engineering and Technology | Greater Noida, Uttar Pradesh | https://www.niet.co.in | needs: seats, fees, hostel, students, placement, campusAcres
miet-meerut | Meerut Institute of Engineering and Technology | Meerut, Uttar Pradesh | https://www.miet.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
rkgit-ghaziabad | Raj Kumar Goel Institute of Technology | Ghaziabad, Uttar Pradesh | https://www.rkgit.edu.in | needs: seats, fees, hostel, students, placement, campusAcres
gniot-greater-noida | Greater Noida Institute of Technology | Greater Noida, Uttar Pradesh | no site on file | needs: seats, fees, hostel, students, placement, campusAcres
psit-kanpur | Pranveer Singh Institute of Technology | Kanpur, Uttar Pradesh | https://psit.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
kit-kanpur | Kanpur Institute of Technology | Kanpur, Uttar Pradesh | https://www.kit.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
srmcem-lucknow | Shri Ramswaroop Memorial College of Engineering and Management | Lucknow, Uttar Pradesh | https://www.srmcem.ac.in | needs: seats, fees, hostel, students, placement, campusAcres
```

## One extra question, answer it inside the same file

Add one final object to the array with slug "quota-check" and put your answer in its
"note" field, as plain text. The question: for each of these colleges, which quotas
actually apply for B.Tech admission through JoSAA or CSAB, and what is the source?

- Punjab Engineering College, Chandigarh (I have Home State and Other State on file)
- Birla Institute of Technology Mesra, and its Patna and Deoghar campuses (Home State and All India)
- Assam University, Silchar (Home State and All India)
- I. K. Gujral Punjab Technical University (Home State and All India)

Use the quota labels the official seat matrix or business rules document uses.

## What I do not want

- Student reviews, ratings or rankings from listing sites.
- Photos or logos.
- Branch level opening and closing ranks. That is a separate dataset.
- NIRF ranks. I already have those from the official source.
