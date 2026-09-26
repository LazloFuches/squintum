-- Admin user: robert.egert@gmail.com / collection2026
-- Change this password after first login.
INSERT INTO users (email, name, password_hash, role) VALUES (
  'robert.egert@gmail.com',
  'Robert Egert',
  'c4f1e88ef99927ac8e9755923c224ecc:c81b71e0f18c9f8d1d243067d3cb6a5c89d9c170f42bff79fd757cadebcfda80',
  'admin'
);

-- 01: Keith Haring
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'keith-haring-subway-drawing',
  1,
  'Subway Drawing',
  'Keith Haring',
  'Contemporary',
  'circa 1983',
  'Contemporary',
  'White chalk on black advertising-space paper',
  '',
  '',
  'An original subway drawing by Keith Haring, executed in white chalk on the matte black paper used to cover expired advertising panels in the New York City subway system. Haring produced thousands of these drawings between 1980 and 1985, working quickly in public, often attracting crowds of commuters. The drawings were never intended to be permanent and most were destroyed, peeled away, or painted over, making surviving examples rare.',
  'Has invoice and insurance appraisal on file.',
  0,
  '[{"src":"/collection/images/keith-haring/haring-subway-drawing-in-situ-tseng-kwong-chi.png","alt":"Keith Haring subway drawing in situ, photographed by Tseng Kwong Chi"},{"src":"/collection/images/keith-haring/haring_subway_1983_regert.jpg","alt":"Keith Haring subway drawing, white chalk on black paper, circa 1983"}]',
  '[{"label":"Object","value":"Drawing"},{"label":"Artist","value":"Keith Haring (1958-1990)"},{"label":"Date","value":"circa 1983"},{"label":"Medium","value":"White chalk on black advertising-space paper"},{"label":"Context","value":"New York City subway system"}]',
  '[]'
);

-- 02: Loie Hollowell
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'loie-hollowell',
  2,
  'Untitled',
  'Loie Hollowell',
  'Contemporary',
  '',
  'Contemporary',
  '',
  '',
  '',
  '',
  '',
  1,
  '[{"src":"/collection/images/loie-hollowell/hollowell.png","alt":"Loie Hollowell, work from the collection"}]',
  '[{"label":"Artist","value":"Loie Hollowell"}]',
  '[]'
);

-- 03: Hubert Robert
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'hubert-robert-farnese-gardens',
  3,
  'Vignola''s Gate to the Farnese Gardens, Rome, with a Coach and Horses',
  'Hubert Robert',
  'Old Master Drawings',
  'circa 1760s',
  '18th Century',
  'Red chalk',
  '437 by 336 mm; 17 1/2 by 13 in',
  '',
  'A red chalk drawing by Hubert Robert depicting Vignola''s Gate to the Farnese Gardens on the Palatine Hill in Rome, with a coach and horses passing through. Robert, who spent eleven years in Rome (1754-1765), was celebrated for his atmospheric depictions of ancient and Renaissance architecture. This drawing captures the monumental gateway designed by Giacomo Barozzi da Vignola in the sixteenth century, a favored subject among artists working in Rome during the eighteenth century.',
  'Sotheby''s, Old Master Drawings, Lot 64, January 2021.',
  0,
  '[{"src":"/collection/images/hubert-robert/farnese-gardens.jpg","alt":"Hubert Robert, Vignola''s Gate to the Farnese Gardens, Rome, red chalk drawing"},{"src":"/collection/images/hubert-robert/farnese-gardens-detail.jpg","alt":"Detail of Vignola''s Gate drawing by Hubert Robert"}]',
  '[{"label":"Object","value":"Drawing"},{"label":"Artist","value":"Hubert Robert (Paris 1733-1808)"},{"label":"Date","value":"circa 1760s"},{"label":"Medium","value":"Red chalk"},{"label":"Dimensions","value":"437 by 336 mm; 17 1/2 by 13 in"},{"label":"Auction","value":"Sotheby''s, Old Master Drawings, Lot 64"}]',
  '["Henry P. McIlhenny, Rittenhouse Square, Philadelphia","Christie''s, New York, 20-21 May 1987, lot 125","Collection of Ambassador and Mrs. Felix Rohatyn","Sotheby''s, New York, 14 October 2020, lot 4","Sotheby''s, Old Master Drawings, January 2021, lot 64"]'
);

-- 04: Tleson Lip Cup
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'lip-cup-with-swans',
  4,
  'Attic Black-Figure Lip Cup with Swans',
  'Purportedly attributed to Tleson, son of Nearchos',
  'Ancient Greek',
  'circa 550-500 BC',
  'Archaic',
  'Terracotta',
  '5 7/8 x 8 1/2 in. (15 x 21.6 cm)',
  'Repaired from many fragments, with areas of restoration visible under close inspection. The stem and foot appear intact and stable. Both handles are present with their palmette terminals preserved. The black-figure decoration on the lip is largely intact, with the swan motifs clearly legible on both sides. The interior glaze shows some wear consistent with age. The inscription below the swans, while present, is partially illegible due to surface abrasion and restoration.',
  'An elegant Attic black-figure lip cup (kylix) on a tall stemmed foot, depicting a swan with raised wings on each side of the lip zone. The swans are rendered in fine black-figure technique with incised linear detail articulating the feathers and plumage. A decorative palmette adorns each handle attachment. The interior features a reserved tondo with a central dot-and-circle motif surrounded by black glaze.

Below the swan figures, a partially legible inscription runs along the handle zone. The cup has been purportedly attributed to the ancient Greek vase painter Tleson, son of Nearchos, a prolific potter and painter active in Athens during the mid-sixth century BC. Tleson was known for his elegant lip cups featuring animal motifs, and his signed works are documented in major museum collections worldwide.

The lip cup form is defined by its distinct offset lip, set off from the bowl by a sharp ridge, with figural decoration confined to the lip zone. This form flourished in Attica between roughly 560 and 520 BC, used primarily for the consumption of wine at symposia. The swan, a bird sacred to Apollo, is among the most common motifs found on Tlesonian lip cups and represents a well-established tradition within Archaic Greek ceramic art.

Discussed by Dr. Pieter Heesen in a published work, circa 2010. Dr. Heesen is a recognized authority on Attic lip cups and band cups, and his scholarship has contributed significantly to the attribution and classification of these forms within the corpus of ancient Greek ceramics.',
  '',
  0,
  '[{"src":"/collection/images/lip-cup/cup-with-inscription.jpg","alt":"Side view with swan and inscription"},{"src":"/collection/images/lip-cup/lip-cup-with-inscription.jpg","alt":"Side view showing swan and partially legible inscription"},{"src":"/collection/images/lip-cup/lip-cup-interior.jpg","alt":"Interior view with dot-and-circle tondo"}]',
  '[{"label":"Object","value":"Lip cup (kylix)"},{"label":"Culture","value":"Attic Greek"},{"label":"Period","value":"Archaic"},{"label":"Date","value":"circa 550-500 BC"},{"label":"Attribution","value":"Purportedly Tleson, son of Nearchos"},{"label":"Medium","value":"Terracotta"},{"label":"Technique","value":"Black-figure with incision"},{"label":"Dimensions","value":"5 7/8 x 8 1/2 in. (15 x 21.6 cm)"},{"label":"Decoration","value":"Swans, palmettes, dot-and-circle tondo"}]',
  '["1970: Sotheby''s, London, April 24-25, lot 247","2000: Bonham''s, London, October 3, lot 189","2004: Arte Primitivo, Howard S. Rose Gallery, New York, June 28, lot 31","2006: Gorny & Mosch, Munich, December 12, Auction 154, lot 388","2009: Royal-Athena Gallery, New York, invoice 11417"]'
);

-- 05: Geometric Skyphos
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'skyphos-with-water-birds',
  5,
  'Attic Geometric Skyphos with Water Birds',
  '',
  'Ancient Greek',
  'circa 750-700 BC',
  'Late Geometric',
  'Terracotta with painted slip',
  '6 in. (15.2 cm) diameter, excl. handles',
  'The vessel shows evidence of ancient breaks with professional restoration. Visible repair lines run vertically through the body, and there are localized areas of surface loss, particularly on the upper body near one handle. The painted decoration is largely intact and legible across all registers. Both handles are present, with minor chipping at the attachment points. The foot ring is stable. Overall, the piece is in good condition for its age, with the decoration preserving a clear and complete iconographic program.',
  'An Attic pottery skyphos from the Late Geometric period, decorated in black. The handle zone features two water birds flanked by three vertical lines and dotted rosettes, centered by a hatched X and triple dot motif. Horizontal bands run below the figural zone. The handles are ornamented with horizontal lines and dots, and the rim carries a band of dots between sets of bands.

The birds are rendered in the characteristic Geometric manner: compact, angular bodies filled with crosshatched patterning, thin legs, and long, curving necks. Each stands in profile, separated by groups of vertical bars and dotted rosette fill ornaments. The vessel sits on a low ring foot and retains both of its horizontal loop handles. The interior is finished in a warm red-brown wash consistent with Attic production of this era.

Skyphoi of this type served as deep drinking cups in domestic and ritual contexts throughout ancient Greece. The water bird motif is among the most prevalent in Late Geometric Attic pottery, drawing from a visual vocabulary shared across the eastern Mediterranean during this period. The decorative program on this example is notably complete, with the figural frieze wrapping continuously around the vessel and showing minimal interruption at the handle zones.',
  '',
  0,
  '[{"src":"/collection/images/skyphos/skyphos-with-water-birds-01.jpg","alt":"Front view showing continuous bird frieze and geometric ornament"},{"src":"/collection/images/skyphos/skyphos-01.jpg","alt":"Side A: water birds with crosshatch bodies"},{"src":"/collection/images/skyphos/skyphos-02.jpg","alt":"Side B: water bird frieze continuation"},{"src":"/collection/images/skyphos/skyphos.jpg","alt":"Full view showing handles and repairs"},{"src":"/collection/images/skyphos/skyphos-with-water-birds-02.jpg","alt":"Bird frieze close-up with crosshatch patterning"},{"src":"/collection/images/skyphos/skyphos-with-water-birds-03jpg.jpg","alt":"Interior view showing red-brown wash"}]',
  '[{"label":"Object","value":"Skyphos (deep drinking cup)"},{"label":"Culture","value":"Attic Greek"},{"label":"Period","value":"Late Geometric"},{"label":"Date","value":"circa 750-700 BC"},{"label":"Dimensions","value":"6 in. (15.2 cm) diameter, excl. handles"},{"label":"Medium","value":"Terracotta with painted slip"},{"label":"Technique","value":"Geometric black and polychrome"},{"label":"Decoration","value":"Water birds, dotted rosettes, hatched X, triple dot motif"}]',
  '["1950s: Alan Rosenthal, New York, acquired in Athens and brought to the U.S.","By descent: Nan Rosenthal and Henry B. Cortesi","2016: Christie''s, New York, April 12"]'
);

-- 06: White-Ground Lekythos
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'white-ground-lekythos',
  6,
  'Attic White-Ground Lekythos with Mourning Figure',
  '',
  'Ancient Greek',
  'circa 5th Century BC',
  'Classical',
  'Terracotta',
  '',
  'The vessel is structurally intact with the mouth, handle, body, and foot all present. The white-ground slip shows considerable wear and flaking consistent with burial conditions and the inherent fragility of this technique. The painted figure is partially preserved, with enough detail remaining to identify the subject, posture, and drapery. Some areas of the white slip have darkened or discolored, likely due to soil deposits or past cleaning. The black glaze on the mouth, handle, and foot is stable with minor surface abrasion. No visible repairs or modern restoration.',
  'An Attic white-ground lekythos of standard funerary form, featuring a single painted figure in a posture of mourning or reverence. The figure, rendered in matte red-brown and dark brown pigments against the characteristic white slip ground, appears draped in a garment and stands in a contemplative pose. The composition is centered on the cylindrical body, framed above by a horizontal band at the shoulder.

The vessel has a tall, flaring mouth glazed in black, a single strap handle connecting the lip to the shoulder, and a disk foot with a reserved edge. The white slip that forms the painting ground covers the body from shoulder to foot, a technique reserved almost exclusively for funerary use in fifth-century Athens.

White-ground lekythoi occupy a unique place in the Attic ceramic tradition. Unlike the durable black-figure and red-figure techniques, white-ground painting employed fugitive pigments applied after firing, making these vessels too fragile for everyday use. They were produced specifically as offerings for the dead, placed at grave sites or deposited within tombs. The iconography typically depicts scenes of mourning, visitation at the graveside, or figures preparing offerings. This example, with its solitary mourning figure, belongs to one of the most common and emotionally resonant categories within the genre of ancient Greek funerary art.

The lekythos was the most common vessel form associated with Athenian funerary practice during the Classical period. Filled with olive oil or perfumed ungents, these vessels were brought to the grave as offerings and are frequently depicted in their own imagery, shown leaning against or standing at grave stelae. The white ground itself may have carried symbolic significance, evoking the white marble of funerary monuments.

Production of white-ground lekythoi peaked in Athens between approximately 470 and 400 BC, with workshops such as those of the Achilles Painter, the Thanatos Painter, and the Reed Painter producing some of the finest surviving examples. The form and decoration of this vessel are consistent with Athenian production during this period.',
  '',
  0,
  '[{"src":"/collection/images/lekythos/white-ground-lekythos-with-mourner.jpg","alt":"White-ground lekythos depicting a mourning figure in matte polychrome on white slip"}]',
  '[{"label":"Object","value":"Lekythos (oil flask)"},{"label":"Culture","value":"Attic Greek"},{"label":"Period","value":"Classical"},{"label":"Date","value":"circa 5th Century BC"},{"label":"Medium","value":"Terracotta"},{"label":"Technique","value":"White-ground with polychrome"},{"label":"Function","value":"Funerary"},{"label":"Iconography","value":"Mourning figure"}]',
  '[]'
);

-- 07: Joanne Carson
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'joanne-carson',
  7,
  'Untitled',
  'Joanne Carson',
  'Contemporary',
  '',
  'Contemporary',
  '',
  '',
  '',
  '',
  '',
  1,
  '[{"src":"/collection/images/joanne-carson/carson-adjusted.jpg","alt":"Work by Joanne Carson"},{"src":"/collection/images/joanne-carson/carson.jpg","alt":"Work by Joanne Carson, full view"},{"src":"/collection/images/joanne-carson/carson-detail.jpg","alt":"Work by Joanne Carson, detail"}]',
  '[{"label":"Artist","value":"Joanne Carson"}]',
  '[]'
);

-- 08: Barbara Westerman
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'barbara-westerman',
  8,
  'Untitled',
  'Barbara Westerman',
  'Contemporary',
  '',
  'Contemporary',
  '',
  '',
  '',
  '',
  '',
  1,
  '[]',
  '[{"label":"Artist","value":"Barbara Westerman"}]',
  '[]'
);

-- 09: Tobias Tak
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'tobias-tak',
  9,
  'Untitled',
  'Tobias Tak',
  'Contemporary',
  '',
  'Contemporary',
  '',
  '',
  '',
  '',
  '',
  1,
  '[{"src":"/collection/images/tobias-tak/tak-cropped.jpg","alt":"Work by Tobias Tak"},{"src":"/collection/images/tobias-tak/tak.jpg","alt":"Work by Tobias Tak, full view"},{"src":"/collection/images/tobias-tak/tak-detail.jpg","alt":"Work by Tobias Tak, detail"}]',
  '[{"label":"Artist","value":"Tobias Tak"}]',
  '[]'
);

-- 10: Lisa Silvestri
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'lisa-silvestri',
  10,
  'Untitled',
  'Lisa Silvestri',
  'Contemporary',
  '',
  'Contemporary',
  '',
  '',
  '',
  '',
  '',
  1,
  '[]',
  '[{"label":"Artist","value":"Lisa Silvestri"}]',
  '[]'
);

-- 11: Retna
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'retna',
  11,
  'Untitled',
  'Retna',
  'Contemporary',
  '',
  'Contemporary',
  '',
  '',
  '',
  '',
  '',
  1,
  '[]',
  '[{"label":"Artist","value":"Retna (Marquis Lewis)"}]',
  '[]'
);

-- 12: Gerald Decock
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'gerald-decock',
  12,
  'Untitled',
  'Gerald Decock',
  'Contemporary',
  '',
  'Contemporary',
  '',
  '',
  '',
  '',
  '',
  1,
  '[{"src":"/collection/images/gerald-decock/decock.jpg","alt":"Work by Gerald Decock"}]',
  '[{"label":"Artist","value":"Gerald Decock"}]',
  '[]'
);

-- 13: Greek Icon
INSERT INTO artworks (slug, sort_order, title, artist, category, date_text, period, medium, dimensions, condition_text, description, notes, is_placeholder, images_json, specs_json, provenance_json) VALUES (
  'greek-icon',
  13,
  'Greek Icon',
  '',
  'Devotional',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  1,
  '[{"src":"/collection/images/greek-icon/icon.jpg","alt":"Greek icon"}]',
  '[]',
  '[]'
);
